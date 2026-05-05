const mongoose=require('mongoose')


async function connectedToDB(){
    await mongoose.connect(process.env.MONGO_URI)

    console.log("connected to database");
    
}

module.exports=connectedToDB
