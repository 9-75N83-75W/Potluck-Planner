import express from 'express';
import multer from 'multer';

//users
import { createUser, getAllUser, specificUser, forgetPassword, updateAllergies, logoutUser } from '../controller/UserController.js';   // refreshToken
//events and invite
import { createEvent,deleteEvent,editFunction,acceptInviteNew,countingAttendees, getEventById, getInvitedEventsByEmail, getUserEvents} from '../controller/EventsController.js';
//recipes
import { createRecipe,deleteRecipes,editRecipes, getAllRecipes} from '../controller/RecipesController.js';
//tokens
import { authenticateToken } from "../middleware/authMiddleware.js";



const storage=multer.memoryStorage();
const upload=multer({storage})
const router=express.Router();
  
//all routes for user
router.post('/createUser',upload.single('profileImage'),createUser);

router.get('/getAllUsers',getAllUser);

// router.get('/existingUser',specificUser);              // changed to post because you generate a jwt when you log in
router.post('/existingUser',specificUser);

// router.post("/token", refreshToken);     // returns new access token

router.delete("/logout", logoutUser);    // invalidates refresh token to log out user

router.post('/forgotPassword',forgetPassword);

// router.post('/updateAllergies', updateAllergies)
router.post("/allergies", authenticateToken, updateAllergies); //put

//all routes for events
router.post('/createEvent',createEvent);

router.put('/updateEvent/:id',editFunction);

router.delete('/deleteEvent/:id',deleteEvent);

router.get('/Event/:id', getEventById);

//all routes for recipes
router.post('/createRecipe',createRecipe);

router.put('/updateRecipe/:id',editRecipes);

router.delete('/deleteRecipe/:id',deleteRecipes);

//invites
//router.get('/inviteEvent/:id',acceptInvite);

router.get('/attendees/:id',countingAttendees);

//----------------------------------------------------------------------------------------------------------------------------------------------------------
// Short Term Fixes Routes
// add this GET route for invitations:
router.get('/events/invited', getInvitedEventsByEmail);
//invites
router.put('/inviteEvent/:id',acceptInviteNew);

// GET all recipes
router.get("/recipesAll", getAllRecipes);

router.get("/userEvents", getUserEvents);


export default router;
