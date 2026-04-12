require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const res = await model.generateContent("Hi");
        console.log("OK:" + res.response.text().substring(0, 10));
    } catch (e) {
        console.log("ERR:" + e.message);
    }
}
test();
