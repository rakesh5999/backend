const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: { 
        type: String,
        required: true
     },
      user: {
          type: String,
         required:[true,"user id is required for creating a comment "]
      },
     post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"posts",
        required:[true,"post id is required for creating a comment "]
     }
},{timestamps:true})

const commentModel= mongoose.model("Comment",commentSchema)

module.exports= commentModel