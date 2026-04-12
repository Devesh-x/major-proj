require('dotenv').config();

async function test() {
    console.log('=== Gemini New SDK Full Test ===\n');

    // 1. Test generation
    console.log('1. Testing text generation (gemini-2.5-flash)...');
    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Say just the word OK',
        });
        console.log('   ✅ Generation works:', response.text.trim());
    } catch (e) {
        console.log('   ❌ Generation failed:', e.message);
    }

    // 2. Test embedding
    console.log('\n2. Testing embedding (gemini-embedding-001)...');
    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const result = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: 'Test embedding for CloudSense',
        });
        const vals = result.embeddings[0].values;
        console.log('   ✅ Embedding works: vector has', vals.length, 'dimensions');
    } catch (e) {
        console.log('   ❌ Embedding failed:', e.message);
    }

    // 3. Test key manager integration
    console.log('\n3. Testing key manager + file analysis...');
    try {
        const keyManager = require('./utils/geminiKeys');
        const result = await keyManager.executeWithFallback(async (ai) => {
            const resp = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'Respond with just: SYSTEM_OK',
            });
            return resp.text;
        });
        console.log('   ✅ Key manager works:', result.trim());
    } catch (e) {
        console.log('   ❌ Key manager failed:', e.message);
    }

    // 4. Test analyzeFile
    console.log('\n4. Testing analyzeFile (full pipeline)...');
    try {
        const { analyzeFile } = require('./services/gemini');
        const mockFile = {
            originalname: 'test_invoice.txt',
            mimetype: 'text/plain',
            buffer: Buffer.from('Invoice #1234. Total amount due: $500. Payment due by April 30, 2026. Billed to: Devesh Kumar.')
        };
        const analysis = await analyzeFile(mockFile);
        console.log('   ✅ analyzeFile works:');
        console.log('      Title:', analysis.title);
        console.log('      Category:', analysis.category);
        console.log('      Tags:', analysis.tags);
        console.log('      Summary:', analysis.summary?.substring(0, 80));
        console.log('      PII:', analysis.isPII);
    } catch (e) {
        console.log('   ❌ analyzeFile failed:', e.message);
    }

    // 5. Test chat
    console.log('\n5. Testing chatWithDocument...');
    try {
        const { chatWithDocument } = require('./services/standalone_chat');
        const answer = await chatWithDocument('e54i7l4mu', 'What is this file about?', 'local-user-123');
        console.log('   ✅ Chat works:', answer.substring(0, 100));
    } catch (e) {
        console.log('   ❌ Chat failed:', e.message);
    }

    console.log('\n=== Test Complete ===');
}

test();
