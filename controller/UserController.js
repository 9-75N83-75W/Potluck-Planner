//import User from "../models/User.js";
import User from "../models/User.js";


//create a new user

export const createUser=async(req,res)=>{
    try {
        //console.log("Incoming request");
        const {name,email,password}=req.body;
        if (!name){
            return res.status(400).json({message:"Name is required"})
        }
        if (!email){
            return res.status(400).json({message:"Email is required"})
        }
        if (!password){
            return res.status(400).json({message:"Password is required"})
        }
        const normalizedEmail=email.trim().toLowerCase()    
        const newUser=await User.create({name,email:normalizedEmail,password});
        
        res.status(200).json({message:"User Created",user:newUser.toObject()});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({message:"Internal server Error"});

        
    }
};

