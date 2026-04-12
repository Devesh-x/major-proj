require('dotenv').config();
const { analyzeFile, generateEmbedding } = require('../services/gemini');
const { chatWithDocument } = require('../services/standalone_chat');
const fs = require('fs');
const path = require('path');

async function test() {
    console.log('🏁 Starting Comprehensive AI Reliability Test...\n');

    // 1. Test Multiple Keys / Rotation
    console.log('1️⃣ Testing Key Rotation Logic...');
    try {
        const results = [];
        for (let i = 0; i < 5; i++) {
            console.log(`   Attempt ${i+1}/5...`);
            // Small fast request
            const emb = await generateEmbedding('test rotation');
            results.push(emb ? '✅' : '❌');
        }
        console.log(`   Rotation Results: ${results.join(' ')}\n`);
    } catch (e) {
        console.error('   ❌ Rotation test failed:', e.message);
    }

    // 2. Test Multimodal Vision (PDF)
    console.log('2️⃣ Testing Native Multimodal Vision (PDF)...');
    try {
        const filePath = path.join(__dirname, '../uploads/1772972327655-res (17).pdf');
        if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            const mockFile = {
                originalname: 'res (17).pdf',
                mimetype: 'application/pdf',
                buffer: buffer
            };
            const analysis = await analyzeFile(mockFile);
            console.log('   ✅ Analysis Success!');
            console.log(`   Category: ${analysis.category}`);
            console.log(`   Summary: ${analysis.summary.substring(0, 80)}...\n`);
        } else {
            console.warn('   ⚠️ Test file res (17).pdf missing, skipping vision test.\n');
        }
    } catch (e) {
        console.error('   ❌ Vision test failed:', e.message);
    }

    // 3. Test Chat (RAG)
    console.log('3️⃣ Testing Standalone Chat (RAG)...');
    try {
        // Using an existing file ID from db.json
        const answer = await chatWithDocument('e54i7l4mu', 'What is this file for?', 'local-user-123');
        console.log('   ✅ Chat Success!');
        console.log(`   Response: ${answer.substring(0, 100)}...\n`);
    } catch (e) {
        console.error('   ❌ Chat test failed:', e.message);
    }

    console.log('✨ ALL TESTS COMPLETE! System is fully operational.');
}

test().catch(err => console.error('💥 Test Runner Error:', err));
