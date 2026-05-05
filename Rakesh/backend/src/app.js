const express=require('express')
const cookieparser=require('cookie-parser')
const cors = require('cors')

const app=express()


app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true,
}))

const authRouter=require('./routes/auth.route')
const postRouter=require('./routes/post.route')
const userRouter=require('./routes/user.route')


app.use("/api/posts",postRouter)
app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)

module.exports=app