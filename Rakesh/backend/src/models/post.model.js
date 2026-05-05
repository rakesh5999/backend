const mongoose=require('mongoose')

const postSchema= new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imgUri:{
        type:String,
        required:[true,"imgUri is required for creating an post"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"userId is required for creating an post"]
    },
    comment: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Comment"
    },
    like: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "users"
     }
},{timestamps:true})

const postModel=mongoose.model("posts",postSchema)

module.exports=postModel