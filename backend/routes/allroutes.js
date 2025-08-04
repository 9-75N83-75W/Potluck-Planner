import express from 'express';
import { createUser } from '../controller/UserController.js';

const router=express.Router();

router.post('/create',createUser);


export default router;
