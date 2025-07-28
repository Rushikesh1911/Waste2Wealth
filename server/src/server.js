// Core imports
import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import passport from "passport";

import connectDB from "./config/db.js";

dotenv.config();
connectDB();



const app = express();
const server = http.createServer(app);







// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Server startup
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
