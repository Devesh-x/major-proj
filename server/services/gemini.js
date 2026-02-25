const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Parses file content and uses Gemini to generate tags, detect PII, and summarize content.
 */
async function analyzeFile(file) {
    let textContent = '';

    // Extract text based on file type
    if (file.mimetype === 'application/pdf') {
        const data = await pdf(file.buffer);
        textContent = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const data = await mammoth.extractRawText({ buffer: file.buffer });
        textContent = data.value;
    } else if (file.mimetype.startsWith('text/')) {
        textContent = file.buffer.toString('utf8');
    } else {
        // For images or unknown types, we'd ideally use multimodal Gemini, 
        // but for now let's handle text-based docs primarily or use image analysis.
        textContent = `[Image/Binary File: ${file.originalname}]`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the following document content and provide the following in JSON format:
    1. "tags": (Array of strings) Relevant tags for this document.
    2. "summary": (String) A brief 1-2 sentence summary.
    3. "isPII": (Boolean) Does this document look like a sensitive ID proof (Passport, National ID, Social Security, etc.)?
    4. "piiType": (String or null) If isPII is true, what type of ID is it?
    5. "title": (String) A Descriptive title for the file if the original is vague.

    Document Content:
    ${textContent.substring(0, 10000)} 
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean JSON response (handled carefully because AI might wrap it in markdown block)
    try {
        const jsonStr = text.match(/\{[\s\S]*\}/)[0];
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Failed to parse Gemini response:', text);
        return { tags: ['general'], summary: 'Could not analyze content', isPII: false };
    }
}

/**
 * Generates an embedding for the document content for semantic search.
 */
async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text.substring(0, 8000));
    return result.embedding.values;
}

module.exports = { analyzeFile, generateEmbedding };
