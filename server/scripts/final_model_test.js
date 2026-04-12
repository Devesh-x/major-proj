require('dotenv').config();
async function test() {
    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const resp = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ text: 'Say OK' }]
        });
        console.log('RESULT:', resp.text);
    } catch (e) {
        console.error('ERROR:', e.message);
    }
}
test();
