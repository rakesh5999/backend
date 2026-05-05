const express= require('express')
const postRouter=express.Router()
const postController=require('../controllers/post.controller')
const multer=require('multer')

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only JPG, JPEG, and PNG formats are allowed!'), false)
    }
}

const upload=multer({
    storage:multer.memoryStorage(),
    fileFilter: fileFilter
})
const identifyUser=require('../middlewares/auth.middleware')





postRouter.post("/",upload.single("image"), identifyUser, postController.createPostController)

postRouter.get("/", identifyUser, postController.getPostController)

postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)

postRouter.post("/like/:postId",identifyUser,postController.likePostController)

postRouter.post("/unlike/:postId",identifyUser,postController.unlikePostController)

postRouter.get("/feed",identifyUser,postController.getFeedController)

postRouter.delete("/delete/:postId", identifyUser, postController.DeletePostController)

postRouter.post("/comments/:postId",identifyUser,postController.addCommentController)

postRouter.get("/comments/:postId",identifyUser,postController.getCommentsController)

postRouter.delete("/comments/delete/:commentId", identifyUser, postController.deleteCommentController)


module.exports=postRouter


