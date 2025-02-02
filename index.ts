import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import urlRouter from "./routes/urlRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Use the imported router for the "/api" path or any other desired prefix
app.use("/", urlRouter); // All routes in urlRouter will be prefixed with "/api"

// Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});