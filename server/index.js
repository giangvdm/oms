import express from 'express';
import dotenv from 'dotenv';
import path from "path";

import { connectDB } from './config/db.js';
import userRoutes from "./routes/user.route.js";

dotenv.config();

console.log(process.env);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});