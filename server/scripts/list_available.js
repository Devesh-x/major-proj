require('dotenv').config();
async function list() {
    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const models = await ai.models.list();
        console.log('--- AVAILABLE MODELS ---');
        console.log(JSON.stringify(models, null, 2));
    } catch (e) {
        console.error('Error listing models:', e.message);
    }
}
list();
