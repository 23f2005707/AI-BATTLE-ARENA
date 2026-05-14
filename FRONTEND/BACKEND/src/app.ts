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
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
}))

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️ Running without database. Auth will not work.');
    })


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
        res.status(500).json({
            success: false,
            message: error.message || 'Error executing graph'
        })
    }
})

export default app