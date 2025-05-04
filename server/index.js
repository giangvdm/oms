import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import cors from "cors";

import { connectDB } from './config/db.js';
import userRoutes from "./routes/user.route.js";
import searchRoutes from "./routes/search.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

// Server Initialization
app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});