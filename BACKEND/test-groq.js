import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

console.log(
    "GROQ KEY:",
    process.env.GROQ_API_KEY ? "LOADED" : "NOT LOADED"
);

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

try {
    const models = await groq.models.list();

    console.log("AVAILABLE MODELS:");

    models.data.forEach(model => {
        console.log(model.id);
    });

} catch (error) {
    console.error("GROQ ERROR:");
    console.error(error);
}