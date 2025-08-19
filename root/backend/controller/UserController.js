import User from "../models/User.js";
//is multer causing an issue? make sure to run the command npm i multer in terminal first.
import multer from "multer";
import mongoose from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import "dotenv/config"
import { generateToken } from "../middleware/authMiddleware.js";

//profile pic
const storage = multer.memoryStorage();
const upload = multer({ storage });
export default upload;

//create a new user
export const createUser=async(req,res)=>{
    try {
        //console.log("Incoming request");

        console.log("BODY:", req.body);
        const {name,email,phone,password,allergies}=req.body;

        if (!name){
            return res.status(400).json({message:"Name is required"})
        }
        if (!email){
            return res.status(400).json({message:"Email is required"})
        }
        if (!phone){
            return res.status(400).json({message:"Phone # is required"})
        }
        if (!password){
            return res.status(400).json({message:"Password is required"})
        }
        // if (!allergies){
        //     return res.status(400).json({message:"Allergy must be filled out"})
        // }
        // if (allergies == null || typeof allergies !== 'object') {
        //     return res.status(400).json({message:"Allergies must be an object, or left empty"})
        // }
        let parsedAllergies = {};

        if (allergies && typeof allergies === 'string') {
            try {
                parsedAllergies = JSON.parse(allergies);
            } catch (err) {
                console.warn("Could not parse allergies, ignoring.");
            }
        } else if (typeof allergies === 'object' && allergies !== null) {
        parsedAllergies = allergies;
        }

console.log(name,email,phone,password,allergies);
console.log(mongoose.connection.readyState)

        // normalized email
        const normalizedEmail=email.trim().toLowerCase()    

        // hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser=new User({
            name:String(name),
            email:normalizedEmail,
            phone,
            password: hashedPassword,
            // profileImage:req.file.buffer,
            profileImage: req.file?.buffer || null,
            // allergies:{
            //     AirborneAllergy: allergies?.AirborneAllergy||[],
            //     DietaryAllergy: allergies?.DietaryAllergy||[],
            //     DietaryRestrictions: allergies?.DietaryRestrictions||[],
            //     Preferences: allergies?.Preferences||[],
            //     NoAllergy: allergies?.NoAllergy||[]
            // }
            allergies: {
                AirborneAllergy: parsedAllergies.AirborneAllergy || [],
                DietaryAllergy: parsedAllergies.DietaryAllergy || [],
                DietaryRestrictions: parsedAllergies.DietaryRestrictions || [],
                Preferences: parsedAllergies.Preferences || [],
                NoAllergy: parsedAllergies.NoAllergy || []
            }
        });
        await newUser.save()
        
        res.status(200).json({message:"User Created",user:newUser});
    } catch (error) {
        console.error("Error:", error);
        // 400 error not 500 -> (connection error)
        res.status(400).json({message:`Error: ${error}`});   
    }
};

//getting all backend users
export const getAllUser=async(req,res)=>{
    try {
        const users=await User.find({})
        res.status(200).json(users)

    }
    catch(error) {
        console.error("Error:", error);
        res.status(500).json({message: "Couldn't get User"});
    }
};

//logging in
export const specificUser=async(req,res)=>{
    try {
        //.body when executing .query using postman
        const {email,password}=req.body;
        if (!email){
            return res.status(400).json({ message:"Email is required" })
        }
        if (!password){
            return res.status(400).json({ message:"Password is required" })
        }

        const normalizedEmail=email.trim().toLowerCase()
        const existingUser=await User.findOne({ email: normalizedEmail })
        if(!existingUser){
            return res.status(404).json({ message:"User not found" });
        }
        console.log(password, existingUser.password)
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if(!validPassword){
            return res.status(400).json({ message:"Password is incorrect" })
        }
        // console.log("hi token", process.env.JWT_SECRET)
        
        // issue JWT
        const accessToken = generateToken(res, existingUser.email)
        // const refreshToken = jwt.sign(
        //     { email: existingUser.email },
        //     process.env.REFRESH_TOKEN_SECRET
        // )

        // existingUser.refreshToken = refreshToken;
        await existingUser.save()

        return res.status(200).json({
            message:"Log-In Successful",
            accessToken,
            // refreshToken,
            User: { email: existingUser.email }
        });
    }   catch (error) {
        console.error("Error", error);
        res.status(500).json({message:`Error: ${error}`})
    }
}

// export async function refreshToken(req, res) {
//     const { token } = req.body
//     if (!token) return res.status(400).json({ message: "Refresh token required" })

//     const user = await User.findOne({ refreshToken: token })
//     if (!user) return res.status(400).json({ message: "Invalid refresh token" })

//     jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decodedUser) => {
//         if (err) return res.status(400)

//         const accessToken = jwt.sign(
//             { email: decodedUser.email },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: "15m" }
//         )

//         res.status(200).json({ accessToken })
//     })
// }

// logout
export async function logoutUser(req, res) {
    const { token } = req.body;
  const user = await User.findOne({ refreshToken: token });

  if (!user) return res.status(400);

  user.refreshToken = null;
  await user.save();

  res.status(200).json({ message: "Logged out" });
}

export const forgetPassword=async(req,res)=>{
    try { 
        const {email,password}=req.body;        //should this be .query??
        if (!email){
            return res.status(400).json({message:"Email is required"})
        }
        if (!password){
            return res.status(400).json({message:"Password is required"})
        }
        const normalizedEmail=email.trim().toLowerCase()
        const existingUser=await User.findOne({ email: normalizedEmail })
        if(!existingUser){
            return res.status(404).json({message:"User not found"});
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUser.password=hashedPassword;
        await existingUser.save()

        res.status(200).json({message:"Password changed"})
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({message:`Error: ${error}`})
    }
}

export const updateAllergies = async (req, res) => {
  try {
    const { email, allergies } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!allergies || typeof allergies !== "object") {
      return res.status(400).json({ message: "Allergies data is required and must be an object" });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allergies fields (make sure your User model has this schema)
    user.allergies = {
      AirborneAllergy: allergies.AirborneAllergy || [],
      DietaryAllergy: allergies.DietaryAllergy || [],
      DietaryRestrictions: allergies.DietaryRestrictions || [],
      Preferences: allergies.Preferences || [],
      NoAllergy: allergies.NoAllergy || []
    };

    await user.save();

    return res.status(200).json({ message: "Allergies updated successfully", allergies: user.allergies });
  } catch (error) {
    console.error("Error updating allergies:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//profile pic
// export const Profilepic = async (req: MulterRequest, res: Response) => {
//     try {
//         const {fileName,email} = req.body

//         if (!fileName){
//             return res.status(400).json({message:"fileName is required"})
//         }
//         if (!email){
//             return res.status(400).json({message:"email is required"})
//         }

//         const newPicture = new Subject({
//             fileName,
//             email,
//             r: req.files.buffer
//             c
//         })
        
//     } catch (error) {
        
//     }
// }