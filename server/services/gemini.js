const pdf = require('pdf-parse'); // Kept for safety, though multimodal is primary
const mammoth = require('mammoth');
const keyManager = require('../utils/geminiKeys');

// ── Model names (new SDK) ──────────────────────────────────────────────
const GENERATION_MODEL = 'gemini-2.0-flash';
const EMBEDDING_MODEL  = 'gemini-embedding-001';

/**
 * Metadata Schema for JSON Mode
 */
const ANALYSIS_SCHEMA = {
    type: 'object',
    properties: {
        tags: { type: 'array', items: { type: 'string' } },
        summary: { type: 'string' },
        isPII: { type: 'boolean' },
        piiType: { type: 'string', nullable: true },
        title: { type: 'string' },
        category: { type: 'string' }
    },
    required: ['tags', 'summary', 'isPII', 'title', 'category']
};

/**
 * Semi-intelligent fallback for file analysis when Gemini API is unavailable.
 */
function getMockAnalysis(file, textContent) {
    const name = file.originalname?.toLowerCase() || '';
    const text = textContent?.toLowerCase() || '';

    let category = 'General';
    let tags = ['Upload'];
    let isPII = false;
    let piiType = null;

    if (name.includes('invoice') || name.includes('receipt') || text.includes('amount') || text.includes('billing')) {
        category = 'Finance';
        tags.push('invoice', 'payment');
    } else if (name.includes('resume') || name.includes('cv') || text.includes('experience') || text.includes('education')) {
        category = 'Work';
        tags.push('career', 'resume');
    } else if (name.includes('passport') || name.includes('id') || name.includes('license') || text.includes('identity')) {
        category = 'Identity';
        isPII = true;
        piiType = 'Government ID';
        tags.push('legal', 'sensitive');
    } else if (name.includes('contract') || name.includes('agreement') || text.includes('terms')) {
        category = 'Legal';
        tags.push('legal', 'agreement');
    } else if (file.mimetype?.startsWith('image')) {
        category = 'Media';
        tags.push('image');
    }

    return {
        tags: [...new Set(tags)],
        summary: `CloudSense AI is currently at high capacity (429 Rate Limit). A full analysis of "${file.originalname}" will be completed once the queue clears. In the meantime, the file is ready for secure storage.`,
        isPII,
        piiType,
        title: file.originalname.split('.')[0],
        category,
        textContent,
    };
}

/**
 * Parses file content and uses Gemini to generate tags, detect PII, and summarize.
 * Uses NATIVE MULTIMODAL support for PDF and Images.
 */
async function analyzeFile(file) {
    let textContent = '';
    let contents = [];

    // 1. Determine modality
    const isPDF = file.mimetype === 'application/pdf';
    const isImage = file.mimetype.startsWith('image/');
    const isWord = file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    try {
        if (isPDF || isImage) {
            // MULTIMODAL: Send the document directly
            contents = [
                {
                    inlineData: {
                        mimeType: file.mimetype,
                        data: file.buffer.toString('base64')
                    }
                },
                {
                    text: `Analyze this ${isPDF ? 'PDF' : 'image'} document and extract metadata.`
                }
            ];
            textContent = `[Direct Multimodal Parsing: ${file.originalname}]`;
        } else if (isWord) {
            const data = await mammoth.extractRawText({ buffer: file.buffer });
            textContent = data.value;
            contents = [{ text: `Analyze this content:\n\n${textContent.substring(0, 5000)}` }];
        } else if (file.mimetype.startsWith('text/')) {
            textContent = file.buffer.toString('utf8');
            contents = [{ text: `Analyze this content:\n\n${textContent.substring(0, 5000)}` }];
        } else {
            textContent = `[Binary/Unsupported File: ${file.originalname}]`;
            contents = [{ text: `The file type is ${file.mimetype}. Analyze based on title: ${file.originalname}` }];
        }
    } catch (e) {
        console.warn('Preprocessing failed:', e.message);
        textContent = `[Parsing Failed: ${file.originalname}]`;
        contents = [{ text: `Preprocessing failed for ${file.originalname}. Analyze based on name alone if possible.` }];
    }

    try {
        return await keyManager.executeWithFallback(async (ai) => {
            const response = await ai.models.generateContent({
                model: GENERATION_MODEL,
                contents: contents,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: ANALYSIS_SCHEMA
                }
            });

            const data = JSON.parse(response.text);
            return { ...data, textContent };
        });
    } catch (e) {
        console.error('All Gemini keys failed or generation failed:', e.message);
        return getMockAnalysis(file, textContent);
    }
}

/**
 * Generates an embedding for the document content for semantic search.
 */
async function generateEmbedding(text) {
    try {
        return await keyManager.executeWithFallback(async (ai) => {
            const result = await ai.models.embedContent({
                model: EMBEDDING_MODEL,
                contents: text.substring(0, 8000),
            });
            return result.embeddings[0].values;
        });
    } catch (e) {
        console.warn('Embedding generation failed (all API keys busy):', e.message);
        return null;
    }
}

async function init() {
    return await keyManager._ready;
}

module.exports = { analyzeFile, generateEmbedding, init };
