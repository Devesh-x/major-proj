const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const keyManager = require('../utils/geminiKeys');

/**
 * Semi-intelligent fallback for file analysis when Gemini API is unavailable.
 */
function getMockAnalysis(file, textContent) {
    const name = file.originalname?.toLowerCase() || "";
    const text = textContent?.toLowerCase() || "";

    let category = "General";
    let tags = ["Upload"];
    let isPII = false;
    let piiType = null;

    // Detect Category
    if (name.includes("invoice") || name.includes("receipt") || text.includes("amount") || text.includes("billing")) {
        category = "Finance";
        tags.push("invoice", "payment");
    } else if (name.includes("resume") || name.includes("cv") || text.includes("experience") || text.includes("education")) {
        category = "Work";
        tags.push("career", "resume");
    } else if (name.includes("passport") || name.includes("id") || name.includes("license") || text.includes("identity")) {
        category = "Identity";
        isPII = true;
        piiType = "Government ID";
        tags.push("legal", "sensitive");
    } else if (name.includes("contract") || name.includes("agreement") || text.includes("terms")) {
        category = "Legal";
        tags.push("legal", "agreement");
    } else if (file.mimetype?.startsWith("image")) {
        category = "Media";
        tags.push("image");
    }

    return {
        tags: [...new Set(tags)],
        summary: `Local analysis of "${file.originalname}". Full AI parsing throttled.`,
        isPII,
        piiType,
        title: file.originalname.split(".")[0],
        category,
        textContent
    };
}

/**
 * Parses file content and uses Gemini to generate tags, detect PII, and summarize content.
 */
async function analyzeFile(file) {
    let textContent = '';

    try {
        if (file.mimetype === 'application/pdf') {
            const data = await pdf(file.buffer);
            textContent = data.text;
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const data = await mammoth.extractRawText({ buffer: file.buffer });
            textContent = data.value;
        } else if (file.mimetype.startsWith('text/')) {
            textContent = file.buffer.toString('utf8');
        } else {
            textContent = `[Image/Binary File: ${file.originalname}]`;
        }
    } catch (e) {
        console.warn('Text extraction failed:', e);
        textContent = `[Parsing Failed: ${file.originalname}]`;
    }

    try {
        const prompt = `
            Analyze the following document content and provide the following in JSON format:
            1. "tags": (Array of strings) Relevant keywords for this document.
            2. "summary": (String) A brief 1-2 sentence summary.
            3. "isPII": (Boolean) Does this document look like a sensitive ID proof (Passport, National ID, Social Security, PAN, etc.)?
            4. "piiType": (String or null) If isPII is true, what type of ID is it?
            5. "title": (String) A descriptive title for the file.
            6. "category": (String) A single high-level category for organization (e.g., 'Finance', 'Work', 'Personal', 'Identity', 'Legal').

            Document Content:
            ${textContent.substring(0, 10000)} 
        `;

        // Wrap the Gemini call inside the key manager failover
        return await keyManager.executeWithFallback(async (genAI_client) => {
            const model = genAI_client.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonStr = text.match(/\{[\s\S]*\}/)[0];
            const resObj = JSON.parse(jsonStr);
            return { ...resObj, textContent };
        });
    } catch (e) {
        console.error('All Gemini keys failed or parsing failed, using Smart Fallback:', e.message);
        return getMockAnalysis(file, textContent);
    }
}

/**
 * Generates an embedding for the document content for semantic search.
 */
async function generateEmbedding(text) {
    try {
        return await keyManager.executeWithFallback(async (genAI_client) => {
            const model = genAI_client.getGenerativeModel({ model: "gemini-embedding-001" });
            const result = await model.embedContent(text.substring(0, 8000));
            return result.embedding.values;
        });
    } catch (e) {
        console.warn('Embedding generation failed (all API keys busy).');
        return null;
    }
}

module.exports = { analyzeFile, generateEmbedding };

module.exports = { analyzeFile, generateEmbedding };
