/**
 * AI Cloud Storage: Research Benchmarking Script
 * This script runs a series of tests to generate data for the Research Comparisons.
 */
require('dotenv').config();
const { analyzeFile, generateEmbedding } = require('./services/gemini');
const crypto = require('crypto');

// Mock file for benchmarking
const testFiles = [
    {
        name: 'Passport_Sample.txt',
        content: 'This is a sample document for John Doe. Passport Number: Z1234567. Issued on 2020-01-01.',
        mimetype: 'text/plain'
    },
    {
        name: 'Work_Report.txt',
        content: 'Q4 Financial goals for the CloudSense team. We reached 200% growth in cloud storage usage.',
        mimetype: 'text/plain'
    }
];

async function runBenchmarks() {
    console.log('🚀 Starting CloudSense AI Benchmarking Suite...\n');

    for (const f of testFiles) {
        console.log(`--- Testing: ${f.name} ---`);
        const buffer = Buffer.from(f.content);
        const fileObj = { originalname: f.name, buffer, mimetype: f.mimetype };

        // 1. Benchmark: Upload Pipeline Latency (Comparison 5)
        const start = Date.now();

        const h0 = Date.now();
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');
        const hTime = Date.now() - h0;

        const a0 = Date.now();
        const analysis = await analyzeFile(fileObj);
        const aTime = Date.now() - a0;

        const e0 = Date.now();
        const embedding = await generateEmbedding(f.content);
        const eTime = Date.now() - e0;

        const total = Date.now() - start;

        console.log('✅ Pipeline Metrics:');
        console.log(` - Hashing: ${hTime}ms`);
        console.log(` - Gemini Analysis: ${aTime}ms`);
        console.log(` - Embedding: ${eTime}ms`);
        console.log(` - Total Time to Insight: ${total}ms`);

        console.log('\n✅ AI Qualitative Results:');
        console.log(` - Title: ${analysis.title}`);
        console.log(` - Tags: ${analysis.tags.join(', ')}`);
        console.log(` - PII Detected: ${analysis.isPII ? 'YES' : 'NO'} (${analysis.piiType || 'N/A'})`);
        console.log(` - Smart Folder Category: ${analysis.category}`);
        console.log('\n-----------------------------------\n');
    }

    console.log('✨ Benchmarking Complete. Use these values for Comparison 5 in your research paper.');
}

if (process.env.GEMINI_API_KEY) {
    runBenchmarks();
} else {
    console.error('❌ Error: GEMINI_API_KEY not found in .env');
}
