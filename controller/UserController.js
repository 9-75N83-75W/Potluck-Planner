//import User from "../models/User.js";
import User from "../models/User.js";
//is multer causing and issue? make sure to run the command npm i multer in terminal first.
import multer from "multer";

//profile pic
const storage =multer.memoryStorage();
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
        if (!allergies){
            return res.status(400).json({message:"Allergy must be filled out"})
        }
console.log(name,email,phone,password,allergies);
        const normalizedEmail=email.trim().toLowerCase()    
        const newUser=new User({
            name:String(name),
            email:normalizedEmail,
            phone,
            password,
            profileImage:req.file ? req.file.buffer : null,
            allergies:{
                AirborneAllergy: allergies?.AirborneAllergy||[],
                DietaryAllergy: allergies?.DietaryAllergy||[],
                DietaryRestrictions: allergies?.DietaryRestrictions||[],
                Preferences: allergies?.Preferences||[],
                NoAllergy: allergies?.NoAllergy||[]
            }
        });
        await newUser.save()
        
        res.status(200).json({message:"User Created",user:newUser});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({message:"Internal server Error"});

        
    }
};

//getting all back end users
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
        //.body when execusting .query using postman
        const {email,password}=req.body ;
        if (!email){
            return res.status(400).json({message:"Email is required"})
        }
        if (!password){
            return res.status(400).json({message:"Password is required"})
        }
        const normalizedEmail=email.trim().toLowerCase()
        const existingUser=await User.findOne({email:normalizedEmail})
        if(!existingUser){
            return res.status(404).json({message:"User not found"});
        }
        if(existingUser.password!=password){
            return res.status(400).json({message:"Password is incorrect"})
        }
        return res.status(200).json({message:"Log-In Successful",existingUser});
        
    } 
    catch (error) {
        console.error("Error", error);
        res.status(500).json({message:"Interal Server Error"})
    }
}

export const forgetPassword=async(req,res)=>{
    try { 
        const {email,password}=req.query;
        if (!email){
            return res.status(400).json({message:"Email is required"})
        }
        if (!password){
            return res.status(400).json({message:"Password is required"})
        }
        const normalizedEmail=email.trim().toLowerCase()
        const existingUser=await User.findOne({email:normalizedEmail})
        if(!existingUser){
            return res.status(404).json({message:"User not found"});
        }
        existingUser.password=password;
        await existingUser.save()
        res.status(200).json({message:"Password changed"})
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({message:"Interal Server Error"})
    }
}

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