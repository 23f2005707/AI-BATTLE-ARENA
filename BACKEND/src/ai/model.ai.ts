import { ChatGoogle } from "@langchain/google";
import {ChatMistralAI} from "@langchain/mistralai";
import {ChatGroq} from "@langchain/groq";

import config from "../config/config.js"

export const geminiModel = new ChatGoogle({
    model: "gemini-2.5-flash-lite",
    apiKey: config.GOOGLE_API_KEY,
    temperature: 0.3,   // lower = faster + deterministic
    maxOutputTokens: 300   // reduce  output size
});

export const mistralAIModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRALAI_API_KEY,
    temperature: 0.3,
    maxTokens: 300
});

export const groqModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: config.GROQ_API_KEY,
    temperature: 0.3, 
    maxTokens: 300   // reduce output size
});