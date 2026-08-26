import express from 'express';
import mongoose from 'mongoose';

import runGraph from './ai/graph.ai.js';
import authRoutes from './routes/auth.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import config from './config/config.js';

// cors policy 
import cors from "cors"

const app = express()

app.use(express.json())  // middleware

// cors middleware
const allowedOrigins = [
    // 'https://ai-battle-arena-zeta.vercel.app',
    'https://arena-agents-f1ii.onrender.com'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
}))

// Connect to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error: any) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('⚠️ Running without database. Auth will not work.');
    }
};

connectToDatabase();


app.get('/', async (req, res) => {

    const result = await runGraph("Write a recursive code for factorial in c++.")

    res.json(result)
})

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes - require authentication
app.post("/invoke", authMiddleware, async (req, res) => {

    const { input } = req.body 
    
    if (!input) {
        return res.status(400).json({
            success: false,
            message: 'Please provide input'
        })
    }

    try {
        const result = await runGraph(input) 

        res.status(200).json({
            message: "Graph executed successfully",
            success: true,
            result 
        })
    } catch (error: any) {
        console.error('Error executing graph:', error);

        if (error?.status === 429 || error?.code === 'rate_limit_exceeded') {
            const retryAfter = error?.headers?.get?.('retry-after') || error?.headers?.['retry-after'];
            return res.status(429).json({
                success: false,
                message: `AI rate limit reached. Please retry in ${retryAfter || 'a few'} seconds.`,
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Error executing graph'
        })
    }
})

export default app
