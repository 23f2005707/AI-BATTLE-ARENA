import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";

import config from "../config/config.js"

export const cohereModel = new ChatCohere({
    model: "command-r-plus",
    apiKey: config.COHERE_API_KEY,
    temperature: 0.3,
    maxTokens: 400
});

export const mistralAIModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRALAI_API_KEY,
    temperature: 0.3,
    maxTokens: 400
});

export const groqModel = new ChatGroq({
    model: config.GROQ_MODEL,
    apiKey: config.GROQ_API_KEY,
    temperature: 0.3, 
    maxTokens: 400
});

export const groqJudgeModel = new ChatGroq({
    model: config.GROQ_MODEL,
    apiKey: config.GROQ_API_KEY,
    temperature: 0,
    maxTokens: 500
});