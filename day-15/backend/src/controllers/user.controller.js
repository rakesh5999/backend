const Imagekit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')

const imagekit = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})



const followModel=require('../models/follow.model')
const userModel=require('../models/user.model')


async function followUserController(req,res){

   
    const followerUsername= req.user.username
    const followeeUsername=req.params.username

    if(followerUsername===followeeUsername){
        return res.status(400).json({
            message:"you cannot follow yourself"
        })
    }

    const isFolloweeExists = await userModel.findOne({
        username:followeeUsername
    })

    if(!isFolloweeExists){
        return res.status(404).json({
            message:"user you are trying to follow does not exist"
        })
    }
    const isAlreadyfollowing= await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })

    if(isAlreadyfollowing){
        return res.status(200).json({
            message:`you are already following ${followeeUsername}`,
            follow:isAlreadyfollowing
        })
    }

    const followRecord= await followModel.create({
        follower: followerUsername.trim(),
        followee: followeeUsername.trim()
    })

    res.status(201).json({
        message:`you are now following ${followeeUsername}`,
        follow:followRecord
    })
}

async function unfollowUserController(req,res){
       followerUsername=req.user.username
       followeeUsername=req.params.username
       
       const isFollowing =await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
       })

       if(!isFollowing){
        return res.status(200).json({
            message:`you are not following ${followeeUsername}`
        })
       }


       await followModel.findByIdAndDelete(isFollowing._id)

       // Update user models if the follow was already accepted
       if (isFollowing.status === 'accepted') {
           await userModel.findOneAndUpdate({ username: followerUsername }, { $pull: { following: (await userModel.findOne({username: followeeUsername}))._id } })
           await userModel.findOneAndUpdate({ username: followeeUsername }, { $pull: { followers: (await userModel.findOne({username: followerUsername}))._id } })
       }

       res.status(200).json({
        message:`you have unfollowed ${followeeUsername}`
       })

}

async function respondToFollow(req,res){
    const requestId = req.params.requestId

    if(!["accepted", "rejected"].includes(req.body.status)){
        return res.status(400).json({ message: "Invalid status" })
    }

    const followRecord = await followModel.findById(requestId)

    if(!followRecord){
        return res.status(404).json({
            message: "no follow request found"
        })
    }

    const follower = followRecord.follower
    const followee = followRecord.followee

    followRecord.status = req.body.status
    await followRecord.save()

    if (req.body.status === "accepted") {
        const followerUser = await userModel.findOne({ username: { $regex: new RegExp(`^${follower}$`, 'i') } })
        const followeeUser = await userModel.findOne({ username: { $regex: new RegExp(`^${followee}$`, 'i') } })

        if (followerUser && followeeUser) {
            await userModel.findByIdAndUpdate(followerUser._id, { $addToSet: { following: followeeUser._id } })
            await userModel.findByIdAndUpdate(followeeUser._id, { $addToSet: { followers: followerUser._id } })
        }
    } else if (req.body.status === "rejected") {
        const followerUser = await userModel.findOne({ username: { $regex: new RegExp(`^${follower}$`, 'i') } })
        const followeeUser = await userModel.findOne({ username: { $regex: new RegExp(`^${followee}$`, 'i') } })

        if (followerUser && followeeUser) {
            await userModel.findByIdAndUpdate(followerUser._id, { $pull: { following: followeeUser._id } })
            await userModel.findByIdAndUpdate(followeeUser._id, { $pull: { followers: followerUser._id } })
        }
    }

    res.status(200).json({
        message: "status updated "
    })
}

async function getAllUsersController(req, res) {

    const me = req.user.username

    const users = await userModel.find({ username: { $ne: me } }).select('username profileImage').lean()

    const usersWithStatus = await Promise.all(
        users.map(async (user) => {
            const record = await followModel.findOne({
                follower: { $regex: new RegExp(`^${me}$`, 'i') },
                followee: user.username
            })

            if (!record) {
                user.followStatus = "none"
            } else if (record.status === 'pending') {
                user.followStatus = "pending"
            } else {
                user.followStatus = "following"
            }

            return user
        })
    )

    res.status(200).json({
        message: "all users found",
        usersWithStatus
    })
}

async function getFollowRequestsController(req,res){

     const me = req.user.username

     const response=await followModel.find({
        followee: { $regex: new RegExp(`^${me}$`, 'i') },
        status:"pending"
      })

      res.status(200).json({
    message: "user is requesting to follow",
    response
    })
}

async function updateProfileController(req,res){

    const user = req.user


    const file = await imagekit.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), 'file'),
            fileName: "profile",
            folder: "insta-clone-profiles"  
          })

          const updatedUser = await userModel.findByIdAndUpdate(
                       user.id,
                      { profileImage: file.url },
                      { new: true }
                    )


                    res.status(200).json({
                       message: "profile image updated successfully",
                       updatedUser
                  })



}






module.exports={
    followUserController,
    unfollowUserController,
    respondToFollow,
    getAllUsersController,
    getFollowRequestsController,
    updateProfileController
}