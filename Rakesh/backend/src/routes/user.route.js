const express= require('express')
const UserController=require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const multer = require('multer')

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only JPG, JPEG, and PNG formats are allowed!'), false)
    }
}

const upload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: fileFilter
})

const userRouter= express.Router()

userRouter.post('/follow/:username',authMiddleware ,UserController.followUserController)

userRouter.post('/unfollow/:username',authMiddleware,UserController.unfollowUserController)

userRouter.patch('/follow/:username',authMiddleware,UserController.respondToFollow)

userRouter.get('/use',authMiddleware,UserController.getAllUsersController)

userRouter.get('/follow/requests', authMiddleware, UserController.getFollowRequestsController)

userRouter.patch('/update', authMiddleware, upload.single("image"), UserController.updateProfileController)

module.exports=userRouter