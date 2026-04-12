/**
 * CloudSense File Analysis Service
 * Uses pdfjs-dist (Mozilla PDF.js) for reliable PDF text extraction.
 */

const mammoth = require('mammoth');

const HF_TOKEN = process.env.HF_TOKEN;
const SUMMARY_MODEL = process.env.HF_SUMMARY_MODEL || 'facebook/bart-large-cnn';
const EMBEDDING_MODEL = process.env.HF_EMBEDDING_MODEL || 'BAAI/bge-small-en-v1.5';

// ─── HF API helper ───────────────────────────────────────────────────────────

async function hfPost(model, payload, retries = 3) {
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;
    const headers = {
        'Content-Type': 'application/json',
        ...(HF_TOKEN ? { 'Authorization': `Bearer ${HF_TOKEN}` } : {})
    };

    for (let i = 0; i < retries; i++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        try {
            const res = await fetch(url, {
                method: 'POST', headers,
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (res.status === 503) {
                console.log(`[HF] Model cold start, retrying...`);
                await new Promise(r => setTimeout(r, 15000 * (i + 1)));
                continue;
            }
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`HF ${res.status}: ${txt}`);
            }
            return await res.json();
        } catch (e) {
            clearTimeout(timeout);
            if (i === retries - 1) throw e;
            console.warn(`[HF] Attempt ${i + 1} failed: ${e.message}`);
        }
    }
    throw new Error('HF unavailable');
}

// ─── Sanitize for PostgreSQL ─────────────────────────────────────────────────

function sanitize(text) {
    if (!text) return '';
    return text
        .replace(/\u0000/g, '')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// ─── PDF text extraction using pdfjs-dist ────────────────────────────────────

async function extractPDFText(buffer, filename) {
    try {
        const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');

        const data = new Uint8Array(buffer);
        const doc = await pdfjsLib.getDocument({ data, useSystemFonts: true }).promise;

        let fullText = '';
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        fullText = sanitize(fullText);

        if (fullText.length > 20) {
            console.log(`[PDF] ✅ Extracted ${fullText.length} chars from "${filename}" (${doc.numPages} pages)`);
            return fullText;
        }

        console.warn(`[PDF] ⚠️ Only ${fullText.length} chars from "${filename}" — may be image-based`);
        return fullText || '';
    } catch (e) {
        console.error(`[PDF] ❌ Failed for "${filename}": ${e.message}`);
        return '';
    }
}

// ─── File classification ─────────────────────────────────────────────────────

function classifyFile(file, textContent) {
    const name = (file.originalname || '').toLowerCase();
    const text = (textContent || '').toLowerCase();

    let category = 'General';
    let tags = ['document'];
    let isPII = false;
    let piiType = null;

    // 1. Initial categorization
    if (name.includes('invoice') || name.includes('receipt') || text.includes('invoice') || text.includes('billing') || text.includes('amount due')) {
        category = 'Finance'; tags.push('invoice', 'finance');
    } else if (name.includes('resume') || name.includes('cv') || text.includes('experience') || text.includes('education') || text.includes('skills')) {
        category = 'Career'; tags.push('resume', 'career');
    } else if (name.includes('passport') || name.includes('license') || text.includes('date of birth') || text.includes('national id')) {
        category = 'Identity'; isPII = true; piiType = 'Government ID'; tags.push('identity', 'sensitive');
    } else if (name.includes('contract') || name.includes('agreement') || text.includes('whereas') || text.includes('terms and conditions')) {
        category = 'Legal'; tags.push('legal', 'contract');
    } else if (name.includes('report') || text.includes('analysis') || text.includes('findings')) {
        category = 'Reports'; tags.push('report', 'analysis');
    } else if (file.mimetype?.startsWith('image/')) {
        category = 'Media'; tags.push('image', 'media');
    }

    // 2. Specific PII Detection (Keywords + Filename)
    const piiKeywords = ['social security', 'ssn', 'aadhaar', 'adhar', 'adhaar', 'pan card', 'tax id', 'national id', 'passport', 'license', 'dl-', 'dob'];
    const hasPIIKeyword = piiKeywords.some(k => name.includes(k) || text.includes(k));

    if (hasPIIKeyword) {
        isPII = true;
        piiType = piiType || 'Government ID / SSN';
        if (!tags.includes('sensitive')) tags.push('sensitive');
        
        // Ensure it's categorized under Identity if it's an ID card
        const isID = ['aadhaar', 'adhar', 'adhaar', 'pan card', 'passport', 'license'].some(k => name.includes(k) || text.includes(k));
        if (isID) {
            category = 'Identity';
            console.log(`[Security] 🛡️  Flagged "${file.originalname}" as Identity based on keyword match.`);
        }
    }

    if (text.includes('bank account') || text.includes('credit card') || text.includes('routing number')) {
        isPII = true; piiType = 'Financial Data';
        if (!tags.includes('sensitive')) tags.push('sensitive');
    }

    const title = (file.originalname || 'Untitled').replace(/\.[^.]+$/, '');
    const hasText = textContent && textContent.length > 100;
    const summary = hasText
        ? textContent.substring(0, 300).trim() + '...'
        : `${title} — ${category}`;

    return { tags: [...new Set(tags)], summary, isPII, piiType, title, category };
}

// ─── Main: analyzeFile ───────────────────────────────────────────────────────

async function analyzeFile(file) {
    let textContent = '';

    try {
        const isPDF = file.mimetype === 'application/pdf';
        const isWord = file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const isText = file.mimetype?.startsWith('text/');
        const isImage = file.mimetype?.startsWith('image/');

        if (isWord) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            textContent = sanitize(result.value);
        } else if (isText) {
            textContent = sanitize(file.buffer.toString('utf8'));
        } else if (isPDF) {
            textContent = await extractPDFText(file.buffer, file.originalname);
        } else if (isImage) {
            try {
                const Tesseract = require('tesseract.js');
                console.log(`[OCR] 👁️  Reading image "${file.originalname}"...`);
                const { data: { text } } = await Tesseract.recognize(file.buffer, 'eng');
                textContent = sanitize(text);
                console.log(`[OCR] ✅ Extracted ${textContent.length} chars`);
            } catch (err) {
                console.warn(`[OCR] ⚠️ Failed for "${file.originalname}": ${err.message}`);
            }
        }
    } catch (e) {
        console.error('[Analysis] Extraction error:', e.message);
    }

    const metadata = classifyFile(file, textContent);

    // AI summary
    if (HF_TOKEN && textContent.length > 200) {
        try {
            const result = await hfPost(SUMMARY_MODEL, {
                inputs: textContent.substring(0, 1024),
                parameters: { max_length: 130, min_length: 30, do_sample: false }
            });
            if (Array.isArray(result) && result[0]?.summary_text) {
                metadata.summary = result[0].summary_text;
            }
        } catch (e) {
            console.warn('[Analysis] AI summary failed:', e.message);
        }
    }

    console.log(`[Analysis] ✅ "${file.originalname}" → ${metadata.category} | ${textContent.length} chars`);
    return { ...metadata, textContent };
}

// ─── Embeddings ──────────────────────────────────────────────────────────────

async function generateEmbedding(text) {
    if (!HF_TOKEN || !text || text.length < 2) return null;
    try {
        const result = await hfPost(EMBEDDING_MODEL, { inputs: sanitize(text).substring(0, 512) });
        if (Array.isArray(result) && typeof result[0] === 'number') return result;
        if (Array.isArray(result) && Array.isArray(result[0])) return result[0];
        return null;
    } catch (e) {
        console.warn('[Embedding] Failed:', e.message);
        return null;
    }
}

async function init() {
    console.log(`🤗 HF AI: Token ${HF_TOKEN ? '✅' : '❌'} | Summary: ${SUMMARY_MODEL} | Embed: ${EMBEDDING_MODEL}`);
    try {
        require('pdfjs-dist/legacy/build/pdf.mjs');
        console.log('📄 PDF: pdfjs-dist ✅');
    } catch {
        console.error('📄 PDF: pdfjs-dist NOT INSTALLED');
    }
    try {
        require('tesseract.js');
        console.log('👁️  OCR: tesseract.js ✅');
    } catch {
        console.error('👁️  OCR: tesseract.js NOT INSTALLED');
    }
}

module.exports = { analyzeFile, generateEmbedding, init };
