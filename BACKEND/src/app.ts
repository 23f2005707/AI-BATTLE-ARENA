import express from 'express';

import runGraph from './ai/graph.ai.js';

// cors policy 
import cors from "cors"

const app = express()

app.use(express.json())  // middleware

// cors middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true 
}))


app.get('/', async (req, res) => {

    const result = await runGraph("Write a recursive code for factorial in c++.")

    res.json(result)
})


// invoke api 
app.post("/invoke", async (req, res) => {

    const { input } = req.body 
    const result = await runGraph(input) 

    res.status(200).json({
        message: "Graph executed successfully",
        success: true,
        result 
    })
})

export default app