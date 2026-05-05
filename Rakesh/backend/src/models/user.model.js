const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"user already existed"],
        required:[true,'username is required']
    },
    email:{
        type:String,
        unique:[true,"email already existed"],
        required:[true,"email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        select:false
    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/pve5z0jtq/profilepic.webp"
    },
    followers:[{
         type: mongoose.Schema.Types.ObjectId,
         ref:"users"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],
})


const userModel=mongoose.model("users",userSchema)


module.exports=userModel