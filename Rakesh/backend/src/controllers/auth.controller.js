const userModel=require('../models/user.model')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


async function registerController(req,res){
    let {username,email,password,bio,profileImage}=req.body

    // Trim whitespace to prevent trailing spaces from mobile keyboards
    if (username) username = username.trim()
    if (email) email = email.trim()

    const isUserAlreadyExists=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"user already exists"+(isUserAlreadyExists.email==email?"Email already exists":"Username already exists")
        })
    }

    const hash= await bcrypt.hash(password,10)
    const user= await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password:hash
    })

    const token=jwt.sign({
        id:user._id,
        username:user.username
    },
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
)

res.cookie("token", token, {
    httpOnly: true,
    secure: true,     
    sameSite: "none",  
});
res.status(201).json({
    message:"user registered successfully ",
    user:{
        email:user.email,
        username:user.username,
        bio:user.bio,
        profileImage:user.profileImage
    }
})

}





 async function loginController(req,res){
    // The frontend sends the identifier (either username or email) as 'username'
    let {username, password}=req.body
    
    if (username) username = username.trim()

    const user= await userModel.findOne({
        $or:[
            {
               username:username
            },
            {
               email:username
            }
        ]
    }).select("+password")

    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }


    const isPassword= await bcrypt.compare(password,user.password)

    if(!isPassword){
        return res.status(401).json({
            message:"Invalid password"
        })
    }

    const token=jwt.sign({
        id:user._id,
        username:user.username
    },
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
)

res.cookie("token", token, {
    httpOnly: true,
    secure: true,      
    sameSite: "none",  
});
res.status(200).json({
    message:"user logged in",
    user:{
         username:user.username,
         email:user.email,
         bio:user.bio,
         profileImage:user.profileImage
    }
})

}

async function getmeController(req,res){
    const userId=req.user.id

    const user= await userModel.findById(userId)

    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }

    res.status(200).json({
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
}



async function logoutController(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    res.status(200).json({ message: "logged out successfully" })
}



module.exports={
    registerController,
    loginController,
    getmeController,
    logoutController
}