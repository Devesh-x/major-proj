const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function checkModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error('No API key found');
        return;
    }
    const genAI = new GoogleGenerativeAI(key);
    
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-pro"];
    
    for (const m of models) {
        console.log(`Checking ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("High five!");
            console.log(`✅ ${m} works: ${result.response.text()}`);
        } catch (e) {
            console.log(`❌ ${m} failed: ${e.message}`);
        }
    }
}

checkModels();
