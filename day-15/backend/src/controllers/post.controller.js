const postModel=require('../models/post.model')
const Imagekit=require('@imagekit/nodejs')
const {toFile}=require('@imagekit/nodejs')
const { Folders } = require('@imagekit/nodejs/resources.js')
const jwt=require('jsonwebtoken')
const likeModel=require('../models/like.model')
const { promises } = require('node:dns')
const followModel = require('../models/follow.model')
const commentModel= require('../models/comment.model')
const saveModel = require('../models/save.model')

const imagekit= new Imagekit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req,res){

    console.log(req.body,req.file);
    
    const file= await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer),'file'),
        fileName: "Test",
        folder:"insta-clone-posts"
    })
    
    const post= await postModel.create({
        caption:req.body.caption,
        imgUri:file.url,
        user:req.user.id
    })


    res.status(201).json({
        message:"post created successfully",
        post
    })

}


async function getPostController(req,res){


    const userId=req.user.id

    const postsRaw = await postModel.find({
        user: userId
    }).sort({ createdAt: -1 }).populate("user").lean()

    const postIds = postsRaw.map(p => p._id)
    
    const myLikes = await likeModel.find({
        user: req.user.username,
        post: { $in: postIds }
    }).lean()
    const myLikePostIds = new Set(myLikes.map(l => l.post.toString()))

    const mySaves = await saveModel.find({
        user: req.user.username,
        post: { $in: postIds }
    }).lean()
    const mySavePostIds = new Set(mySaves.map(s => s.post.toString()))

    const likeCounts = await likeModel.aggregate([
        { $match: { post: { $in: postIds } } },
        { $group: { _id: "$post", count: { $sum: 1 } } }
    ])
    const countsMap = {}
    likeCounts.forEach(c => countsMap[c._id.toString()] = c.count)

    const posts = postsRaw.map(post => {
        const pid = post._id.toString()
        post.likesCount = countsMap[pid] || 0
        post.isLiked = myLikePostIds.has(pid)
        post.isSaved = mySavePostIds.has(pid)
        return post
    })


    res.status(200).json({
        message:"post fetch successfully",
        posts
    })


}


async function getPostDetailsController(req,res){


    const userId=req.user.id
    const postId= req.params.postId

    

    const post= await postModel.findById(postId)

   

    if(!post){
        return res.status(404).json({
            message:"post not found"
        })
    }

    const isValidUser= post.user.toString()===userId

    if(!isValidUser){
        return res.status(401).json({
            message:"Forbidden content"
        })
    }

    const postObj = post.toObject()
    postObj.likesCount = await likeModel.countDocuments({post:post._id})
    const isLiked = await likeModel.findOne({post:post._id, user:req.user.username})
    postObj.isLiked = Boolean(isLiked)

   return res.status(200).json({
        message:"post fetched successfully",
        post: postObj
    })



}


async function likePostController(req,res){
    const username=req.user.username
    const postId= req.params.postId

    const post = await postModel.findById(postId )

    if(!post){
        return res.status(404).json({
             message:"post not found"
        })
    }

    const like =await likeModel.create({
        post:postId,
        user: username
    })

    res.status(200).json({
        message:"post like successfully",
        like
    })


}

async function unlikePostController(req,res){
    const postId =req.params.postId
    const username=req.user.username

    const isLiked = await likeModel.findOne({
        post:postId,
        user:username
    })

    if(!isLiked){
        return res.status(400).json({
            message:"Post didn't like"
        })
    }

    await likeModel.findOneAndDelete({_id:isLiked._id})

    res.status(200).json({
        message:"post unliked successfully."
    })

}

async function getFeedController(req,res){
    console.log("Reached getFeedController, user:", req.user);
    try {
        const user = req.user
        const postsRaw = await postModel.find().sort({ createdAt: -1 }).populate("user").lean()

        // Get all post IDs
        const postIds = postsRaw.map(p => p._id)

        // Bulk fetch likes for current user
        const myLikes = await likeModel.find({
            user: user.username,
            post: { $in: postIds }
        }).lean()
        const myLikePostIds = new Set(myLikes.map(l => l.post.toString()))

        const mySaves = await saveModel.find({
            user: user.username,
            post: { $in: postIds }
        }).lean()
        const mySavePostIds = new Set(mySaves.map(s => s.post.toString()))

        // Bulk fetch total like counts using aggregation
        const likeCounts = await likeModel.aggregate([
            { $match: { post: { $in: postIds } } },
            { $group: { _id: "$post", count: { $sum: 1 } } }
        ])
        const countsMap = {}
        likeCounts.forEach(c => countsMap[c._id.toString()] = c.count)

        // Bulk fetch follow status
        const followeeUsernames = [...new Set(postsRaw.filter(p => p.user).map(p => p.user.username))]
        const followRecords = await followModel.find({
            follower: user.username,
            followee: { $in: followeeUsernames }
        }).lean()
        const followMap = {}
        followRecords.forEach(r => followMap[r.followee] = r.status)

        const posts = postsRaw.map(post => {
            const pid = post._id.toString()
            post.isLiked = myLikePostIds.has(pid)
            post.isSaved = mySavePostIds.has(pid)
            post.likesCount = countsMap[pid] || 0

            if (post.user) {
                const status = followMap[post.user.username]
                if (!status) {
                    post.followStatus = "none"
                } else if (status === "pending") {
                    post.followStatus = "pending"
                } else if (status === "accepted") {
                    post.followStatus = "following"
                } else {
                    post.followStatus = "none"
                }
            } else {
                post.followStatus = "none"
            }
            return post
        })


        res.status(200).json({
            message:"posts fetched successfully",
            posts
        })
    } catch (error) {
        console.error("Error in getFeedController:", error)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}



async function DeletePostController(req,res){
         
     const userId=req.user.id
     const postId= req.params.postId


     
    const post= await postModel.findById(postId)

   

    if(!post){
        return res.status(404).json({
            message:"post not found"
        })
    }


     const isValidUser= post.user.toString()===userId

    if(!isValidUser){
        return res.status(401).json({
            message:"Forbidden content"
        })
    }

    await postModel.findByIdAndDelete(postId)


    return res.status(200).json({
        message:"post deleted successfully",
        post
    })
}


async function addCommentController(req,res){
     const username=req.user.username
     const postId= req.params.postId
     const { text } = req.body

    const post = await postModel.findById(postId )

    if(!post){
        return res.status(404).json({
             message:"post not found"
        })
    }


    const comment =await commentModel.create({
        text,
        post:postId,
        user: username
    })

    res.status(200).json({
        message:"post commented successfully",
        comment
    })


}


async function getCommentsController(req,res){
     const postId = req.params.postId 
    
         const comments=await commentModel.find({
           post:postId
          })
    
          res.status(200).json({
        message: "comments fetched successfully",
        comments
        })
}


async function deleteCommentController(req, res) {
    const username = req.user.username
    const commentId = req.params.commentId

    const comment = await commentModel.findById(commentId)

    if (!comment) {
        return res.status(404).json({ message: "comment not found" })
    }

    if (comment.user !== username) {
        return res.status(401).json({ message: "you can only delete your own comments" })
    }

    await commentModel.findByIdAndDelete(commentId)

    res.status(200).json({ message: "comment deleted successfully" })
}

async function savePostController(req, res) {
    const postId = req.params.postId
    const username = req.user.username

    const alreadySaved = await saveModel.findOne({ post: postId, user: username })
    if (alreadySaved) {
        return res.status(400).json({ message: "Post already saved" })
    }

    const save = await saveModel.create({ post: postId, user: username })
    res.status(201).json({ message: "Post saved successfully", save })
}

async function unsavePostController(req, res) {
    const postId = req.params.postId
    const username = req.user.username

    const save = await saveModel.findOneAndDelete({ post: postId, user: username })
    if (!save) {
        return res.status(400).json({ message: "Post not saved" })
    }

    res.status(200).json({ message: "Post unsaved successfully" })
}

async function getSavedPostsController(req, res) {
    try {
        const username = req.user.username
        const savedRecords = await saveModel.find({ user: username }).select('post').lean()
        const postIds = savedRecords.map(r => r.post)

        const postsRaw = await postModel.find({ _id: { $in: postIds } }).sort({ createdAt: -1 }).populate("user").lean()
        
        // Similar to getFeed, populate isLiked, likesCount, and isSaved
        const myLikes = await likeModel.find({ user: username, post: { $in: postIds } }).lean()
        const myLikePostIds = new Set(myLikes.map(l => l.post.toString()))
        
        const mySaves = await saveModel.find({ user: username, post: { $in: postIds } }).lean()
        const mySavePostIds = new Set(mySaves.map(s => s.post.toString()))

        const likeCounts = await likeModel.aggregate([
            { $match: { post: { $in: postIds } } },
            { $group: { _id: "$post", count: { $sum: 1 } } }
        ])
        const countsMap = {}
        likeCounts.forEach(c => countsMap[c._id.toString()] = c.count)

        const posts = postsRaw.map(post => {
            const pid = post._id.toString()
            post.isLiked = myLikePostIds.has(pid)
            post.isSaved = mySavePostIds.has(pid)
            post.likesCount = countsMap[pid] || 0
            return post
        })

        res.status(200).json({ message: "Saved posts fetched successfully", posts })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

module.exports={
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    getFeedController,
    unlikePostController,
    DeletePostController,
    addCommentController,
    getCommentsController,
    deleteCommentController,
    savePostController,
    unsavePostController,
    getSavedPostsController
}