require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function list() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // The SDK doesn't have a direct listModels, we have to use the fetch API or similar if we want to be thorough,
        // but usually we can just try the common ones.
        // Actually, let's just try 'gemini-1.0-pro' which is the older name for gemini-pro.
        
        const models = ["gemini-pro", "gemini-1.0-pro", "gemini-1.5-flash", "gemini-1.5-pro"];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log("SUPPORTED: " + m);
            } catch (e) {
                console.log("NOT SUPPORTED: " + m + " (" + e.message.substring(0, 50) + ")");
            }
        }
    } catch (e) {
        console.log("ERR: " + e.message);
    }
}
list();
