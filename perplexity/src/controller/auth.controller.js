import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"; 
import { sendEmail } from "../services/mail.service.js";
 
export const register = async (req, res) => {

  const { username, email, password } = req.body;

  const isUserExist = await userModel.findOne({ 
    $or: [{ username }, { email }]
   });

  if (isUserExist) {
    return res.status(400).json({ message: "Username or email already exists",
      success: false,
      err:"User already exists"
     });
  }

  const user=await userModel.create({ username, email, password });


      await sendEmail({
        to: email,
        subject: "Welcome to Our perplexity App",
        html:  `
          <p>Hi <strong>${username},</strong>, 
          welcome to our perplexity App!</p>`
      });

      res.status(201).json({
        message: "User registered successfully",
        success: true,
        user:{
          id: user._id,
          username: user.username,
          email: user.email
        }
      });

    }