import express from 'express';
import mongoose from 'mongoose';
import allroutes from './routes/allroutes.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Test route
app.use('/api',allroutes)

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/potluck", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
