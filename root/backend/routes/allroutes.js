import express from 'express';
import multer from 'multer';

//users
import { createUser, getAllUser, specificUser, forgetPassword, updateAllergies } from '../controller/UserController.js';
//events and invite
import { createEvent,deleteEvent,editFunction,acceptInvite,countingAttendees, getEventById } from '../controller/EventsController.js';
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

router.post('/updateAllergies', updateAllergies)

//all routes for events
router.post('/createEvent',createEvent);

router.put('/updateEvent/:id',editFunction);

router.delete('/deleteEvent/:id',deleteEvent);

router.get('/Event/:id', getEventById);

//all routes for recipes
router.post('/createmountain',createRecipe);

router.put('/updateRecipe/:id',editRecipes);

router.delete('/deleteRecipe/:id',deleteRecipes);

//invites
router.put('/inviteEvent/:id',acceptInvite);

router.get('/attendees/:id',countingAttendees);

// Short Term Fixes Routes
// add this GET route for invitations:
// router.get('/events/invited', getInvitedEventsByEmail);

// router.get("/Event/", async (req, res) => {
//     try {
//       const event = await event.findById(req.params.id);
//       if (!event) {
//         return res.status(404).json({ message: "Event not found" });
//       }
//       res.json({ event });
//     } catch (error) {
//       console.error("Error fetching event:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   });

export default router;
