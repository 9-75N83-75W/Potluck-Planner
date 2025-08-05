import express from 'express';
import mongoose from 'mongoose';
import allroutes from './routes/allroutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

//changed port to 4000 per Zahra request
const PORT = process.env.PORT || 4000;

// Test route
app.use('/api',allroutes)
// app.use((req, res, next) => {
//   console.log("Global middleware hit:", req.method, req.originalUrl);
//   next();
// });


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
