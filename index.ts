import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import urlRouter from "./routes/urlRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// CORS Options
const allowedOrigins: string[] = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://ghost-share-two.vercel.app'
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin ?? '') !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to Database
connectDB();

// Use the imported router for the "/api" path or any other desired prefix
app.use("/", urlRouter); // All routes in urlRouter will be prefixed with "/api"

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});