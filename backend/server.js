import express from "express";
// import dotenv from "dotenv/config";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors"

import connectDB from "./config/mongodb.js";
import {connectCloudinary} from "./config/cloudinary.js"

import authRouter from "./routes/authRoutes.js";
import donationRouter from "./routes/donationRoutes.js";

// App configuration


const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors())

// Api Endpoints
app.use('/api/auth', authRouter);
app.use('/api/donations', donationRouter);

// Checking Server
app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`));


