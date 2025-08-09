import express from 'express';
import multer from 'multer';

//users
import { createUser, getAllUser, specificUser, forgetPassword } from '../controller/UserController.js';
//events and invite
import { createEvent,deleteEvent,editFunction,acceptInvite,countingAttendees } from '../controller/EventsController.js';
//recipes
import { createRecipe,deleteRecipes,editRecipes } from '../controller/RecipesController.js';

const storage=multer.memoryStorage();
const upload=multer({storage})
const router=express.Router();
  
//all routes for user
router.post('/createUser',upload.single('profileImage'),createUser);

router.get('/getAllUsers',getAllUser);

router.get('/existingUser',specificUser);

router.post('/forgotPassword',forgetPassword);

//all routes for events
router.post('/createEvent',createEvent);

router.put('/updateEvent/:id',editFunction);

router.delete('/deleteEvent/:id',deleteEvent);

//all routes for recipes
router.post('/createRecipe',createRecipe);

router.put('/updateRecipe/:id',editRecipes);

router.delete('/deleteRecipe/:id',deleteRecipes);

//invites
router.put('/inviteEvent/:id',acceptInvite);

router.get('/attendees/:id',countingAttendees);

export default router;
