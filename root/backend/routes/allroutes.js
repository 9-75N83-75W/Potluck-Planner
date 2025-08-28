// imports
import express from 'express';

// import multer from 'multer';

import { authenticateToken } from "../middleware/authMiddleware.js";
// Users
import { createUser, loginUser, logoutUser, getAllUsers, forgetPassword, updateUserFoodConstraint, getUserProfile, refreshToken, findOrCreateConstraint } from '../controller/UserController.js';
// Food Constraints
import { createFoodConstraint, getAllFoodConstraints, getFoodConstraintById, updateFoodConstraint, deleteFoodConstraint} from '../controller/FoodConstraintController.js'
// Event
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, addGuest, updateGuestRSVP, assignRecipeToGuest, getInvitedEvents, getAcceptedEvents, getHostedEvents, getEventConstraints } from '../controller/EventController.js';
// Recipe
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe, getRecipesByEvent, getRecipesByUser} from '../controller/RecipeController.js';

// const storage=multer.memoryStorage();
// const upload=multer({storage})
const router = express.Router();

// USER ROUTES
// account management
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// get users
router.get("/:id", authenticateToken, getUserProfile);
router.get("/allUsers", authenticateToken, getAllUsers);

// food constraint
router.put("/:id/constraints/:category", authenticateToken, updateUserFoodConstraint);
router.post("/foodConstraint/findOrCreate", authenticateToken, async (req, res) => {
    try {
      const { constraint, category } = req.body;
  
      if (!constraint || !category) {
        return res.status(400).json({ error: "Constraint and category are required" });
      }
  
      const id = await findOrCreateConstraint(constraint, category);
  
      res.json({ _id: id });
    } catch (err) {
      console.error("Error in findOrCreate route:", err);
      res.status(500).json({ error: err.message });
    }
  });
// authentication
router.post("/refresh", refreshToken);

// password management
router.post("/forget_password", forgetPassword);

// router.post('/createUser',upload.single('profileImage'),createUser);

// FOOD CONSTRAINTS ROUTES
router.post("/createFoodConstraint", createFoodConstraint);
router.get("/getAllFoodConstraints", getAllFoodConstraints);
router.get("/constraints/:id", getFoodConstraintById);

router.put("/updateConstraints/:id", authenticateToken, updateFoodConstraint);
router.delete("/deleteConstraint/:id", authenticateToken, deleteFoodConstraint);

// EVENT ROUTES

// events crud
router.post("/createEvent", authenticateToken, createEvent);
router.get("/allEvents", getAllEvents);
router.get("/event/:id", getEventById);
router.put("/:id/eventUpdate", authenticateToken, updateEvent);
router.delete("/:id/eventDelete", authenticateToken, deleteEvent);
router.get('/events/invited', authenticateToken, getInvitedEvents);
router.get('/events/accepted', authenticateToken, getAcceptedEvents);
router.get('/events/hosting', authenticateToken, getHostedEvents)
router.get("/event/:eventId/constraints", authenticateToken, getEventConstraints);


// guests
router.post("/:id/addGuests", authenticateToken, addGuest);
router.put("/:id/guests/:guestId/status", authenticateToken, updateGuestRSVP);

// recipes
router.put("/:id/guests/:guestId/assign-recipe", authenticateToken, assignRecipeToGuest);

// RECIPE ROUTES
// Basic Recipe CRUD
router.post("/createRecipe", authenticateToken, createRecipe);
router.get("/getRecipes", getAllRecipes);
router.get("/getRecipe/:id", getRecipeById);
router.put("/updateRecipe/:id", authenticateToken, updateRecipe);
router.delete("/deleteRecipe/:id", authenticateToken, deleteRecipe);

// Get recipes by event or user
router.get("/:eventId/recipes", getRecipesByEvent);
router.get("/:userId/recipes", getRecipesByUser);


export default router;
