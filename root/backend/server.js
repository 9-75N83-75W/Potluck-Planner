import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import allroutes from './routes/allroutes.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
//Cors -> Cross origin resource sharing - since backend and frontend run on different ports
app.use(cors({
  origin: 'http://localhost:5173', // or 3000 if using CRA
})); // allow requests from React frontend
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Easiest Test For Backend Connection
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Test route
app.use('/api',allroutes)
// app.listen(4000, () => {
//   console.log('Server running on http://localhost:4000');
// });
// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/PotluckPlanner", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
