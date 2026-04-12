require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    console.log('--- Raw Gemini-Pro Test ---');
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say 'System OK'");
        console.log('SUCCESS:', result.response.text());
    } catch (err) {
        console.error('FAILURE:', err.message);
        if (err.stack) console.error(err.stack);
    }
}

test();
