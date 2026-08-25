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

  console.log(
    models.data.map(model => model.id)
  );

} catch (error) {
  console.error(error);
}