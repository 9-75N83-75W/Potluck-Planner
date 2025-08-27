import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connect } from "mongoose";
import allroutes from './routes/allroutes.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();
//Cors -> Cross origin resource sharing - since backend and frontend run on different ports
app.use(cors({
  origin: 'http://localhost:5173',
})); // allow requests from React frontend
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 4000;

// // Easiest Test For Backend Connection
// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello from backend!' });
// });

mongoose.connection.on('connected', () => console.log('connected'));
mongoose.connection.on('open', () => console.log('open'));
mongoose.connection.on('disconnected', () => console.log('disconnected'));
mongoose.connection.on('reconnected', () => console.log('reconnected'));
mongoose.connection.on('disconnecting', () => console.log('disconnecting'));
mongoose.connection.on('close', () => console.log('close'));

// 
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/PotluckPlanner")
//mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful');

    console.log("Mongoose DB name:", mongoose.connection.name);

    // Register routes AFTER connection
    app.use('/api', allroutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
  