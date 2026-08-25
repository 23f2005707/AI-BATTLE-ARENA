import dotenv from 'dotenv';

dotenv.config();

const config = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
    MISTRALAI_API_KEY: process.env.MISTRALAI_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-battle-arena',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
}

export default config;

