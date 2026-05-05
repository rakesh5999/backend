const postModel=require('../models/post.model')
const Imagekit=require('@imagekit/nodejs')
const {toFile}=require('@imagekit/nodejs')
const { Folders } = require('@imagekit/nodejs/resources.js')
const jwt=require('jsonwebtoken')
const likeModel=require('../models/like.model')
const { promises } = require('node:dns')
const followModel = require('../models/follow.model')
const commentModel= require('../models/comment.model')

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

    const posts= await postModel.find({
        user:userId
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

   return res.status(200).json({
        message:"post fetched successfully",
        post
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

    const user =req.user

    const posts= await Promise.all((await postModel.find().populate("user").lean())
    .map(async (post)=>{
         const isLiked = await likeModel.findOne({
            user:user.username,
            post:post._id
         })

         post.isLiked= Boolean( isLiked)
           const record = await followModel.findOne({
                follower: user.username,
                followee: post.user.username
            })

            if (!record) {
                post.followStatus = "none"
            } else if (record.status === "pending") {
                post.followStatus = "pending"
            } else {
                post.followStatus = "following"
            }

         return post
    }))


    res.status(200).json({
        message:"posts fetched successfully",
        posts
    })

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
    deleteCommentController
}