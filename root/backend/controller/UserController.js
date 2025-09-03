// imports
import User from "../models/User.js";
import FoodConstraint from "../models/FoodConstraint.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import "dotenv/config"
import { generateToken } from "../middleware/authMiddleware.js";


// Create a new user
export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, profilePicture } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
          }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: "An account with this email already exists, try logging in." });
        }

        // hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        
        // Create new user
        const newUser = new User({ 
            firstName,
            lastName, 
            email: normalizedEmail, 
            phone, 
            password: hashedPassword, 
            profilePicture 
        });
        await newUser.save();

        // Issue JWT
        // Generate and set the access token cookie and get the token string
        const accessToken = generateToken(res, newUser);
        const refreshToken = generateRefreshToken(newUser);

        // Save refresh token in db
        newUser.refreshToken = refreshToken;
        await newUser.save();


        res.status(201).json({ 
            message: " Successfully signed up.", 
            user: { id: newUser._id, email: newUser.email, firstName, lastName }, accessToken, refreshToken,
        });
    } catch (err) {
        res.status(500).json({ error: `Failed to create user. Server Error:${err}` });
    }
};

// Login 
export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const normalizedEmail = email.trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Compare password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }
  
      // Issue JWT
      // Generate and set the access token cookie and get the token string
      const accessToken = generateToken(res, user);
      const refreshToken = generateRefreshToken(user);

      // save refresh token
      user.refreshToken = refreshToken;
      await user.save();
  
      res.status(200).json({
        message: "Login successful",
        user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
        accessToken, refreshToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: `Error logging in: ${error}` });
    }
  };

// Logout
export const logoutUser = async (req, res) => {
    try {
      console.log(req.cookies)

      res.clearCookie("jwt", {path:"/"})
  
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({ error: `Logout error: ${err}` });
    }
  };

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("airborneAllergies dietaryAllergies dietaryRestrictions preferenceDislikes preferenceLikes");
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: `Failed to fetch users: ${err}` });
    }
};


// View profile
export const getUserProfile = async (req, res) => {
    try {
        // Security check: Ensure the authenticated user is requesting their own profile
        if (req.params.id !== req.user.id) {
            return res.status(403).json({ error: "Forbidden: You can only view your own profile" });
        }
        
        const user = await User.findById(req.params.id).populate("airborneAllergies dietaryAllergies dietaryRestrictions preferenceDislikes preferenceLikes");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: `Failed to fetch profile: ${err}` });
    }
};

// Find or create food constraint
export const findOrCreateConstraint = async (constraint, category) => {
  try {

    if (typeof constraint !== "string") {
      console.error("Invalid constraint type:", constraint);
      throw new Error("Constraint must be a string");
    }

    if (!constraint || !category) {
      throw new Error("Constraint and category are required");
    }

    const trimmedConstraint = constraint.trim().toLowerCase();

    // Check if it already exists
    let existingConstraint = await FoodConstraint.findOne({
      constraint: trimmedConstraint,
      category,
    });

    if (existingConstraint) {
      return existingConstraint._id;
    }

    // Create new constraint if it doesn't exist
    const newConstraint = new FoodConstraint({
      constraint: trimmedConstraint,
      category,
    });

    await newConstraint.save();
    return newConstraint._id;

  } catch (err) {
    console.error("Error in findOrCreateConstraint:", err);
    throw err; // propagate error to caller
  }
};


// Update food constraints by category
export const updateUserFoodConstraint = async (req, res) => {
    try {
      const { category } = req.params; // e.g. "dietary_allergy"
      const { constraints } = req.body; // array of strings
  
      if (!["airborne_allergy", "dietary_allergy", "dietary_restriction", "preference_dislikes", "preference_likes"].includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }
  
      const constraintIds = await Promise.all(
        constraints.map((c) => findOrCreateConstraint(c, category))
      );
  
      const fieldMap = {
        airborne_allergy: "airborneAllergies",
        dietary_allergy: "dietaryAllergies",
        dietary_restriction: "dietaryRestrictions",
        preference_dislikes: "preferenceDislikes",
        preference_likes: "preferenceLikes",
      };
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { [fieldMap[category]]: constraintIds },
        { new: true }
      ).populate("airborneAllergies dietaryAllergies dietaryRestrictions preferenceDislikes preferenceLikes");
  
      if (!updatedUser) return res.status(404).json({ error: "User not found" });
  
      res.json(updatedUser);
    } catch (err) {
      console.error("Error updating food constraints:", err);
      res.status(500).json({ error: `Failed to update food constraints: ${err}` });
    }
  };

//--------------------------------- Note: not implemented yet, will get to it if we have time, if someone wants to test it in postman though - please do!

// Forget password
export const forgetPassword=async(req,res)=>{
  try { 
      const {email,password}=req.body;
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
      existingUser.password=await bcrypt.hash(password, 10);
      await existingUser.save()
      res.status(200).json({message:"Password changed"})
  } catch (error) {
      console.error("Error", error);
      res.status(500).json({message:`Error: ${error}`})
  }
}


//------- Token Mess  ------- Note: I know refresh tokens are being generated but I don't think they are being used, but I don't want to break the code so please ignore them for now 

// ================== HELPERS ==================

const generateRefreshToken = (user) => {
  return jwt.sign(
    { email: user.email, id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

  // ================== REFRESH TOKEN ==================
  export const refreshToken = async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: "Refresh token required" });
  
      const user = await User.findOne({ refreshToken: token });
      if (!user) return res.status(403).json({ error: "Invalid refresh token" });
  
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid or expired refresh token" });
  
        generateToken(res, user);
        res.json({ message: "Access token refreshed" });
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to refresh token" });
    }
  };


//is multer causing an issue? make sure to run the command npm i multer in terminal first.
// import multer from "multer";
// //profile pic
// const storage =multer.memoryStorage();
// const upload = multer({ storage });
// export default upload;


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