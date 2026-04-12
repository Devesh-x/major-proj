require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { generateEmbedding } = require('./services/hf_analysis');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function diagnose() {
    console.log('--- AI FEATURE DIAGNOSTICS ---');
    
    // 1. Check HF Embedding API
    console.log('\nTesting HF Embedding API...');
    try {
        const emb = await generateEmbedding('test query');
        if (emb) console.log('✅ HF Embedding API working (dim:', emb.length, ')');
        else console.log('❌ HF Embedding API returned null');
    } catch (e) {
        console.error('❌ HF Embedding API Error:', e.message);
    }

    // 2. Check Database Embeddings
    console.log('\nChecking Database Embeddings...');
    try {
        const { data: files, error } = await supabase
            .from('file_metadata')
            .select('id, name, embedding, is_pii, category');
        
        if (error) throw error;
        
        const total = files.length;
        const withEmb = files.filter(f => f.embedding).length;
        const withPII = files.filter(f => f.is_pii).length;
        
        console.log(`- Total Files: ${total}`);
        console.log(`- Files with Embeddings: ${withEmb}`);
        console.log(`- Files flagged PII: ${withPII}`);
        
        if (withEmb < total) {
            console.log('⚠️  ACTION: Some files are missing embeddings. Smart Search will not find them.');
        }
    } catch (e) {
        console.error('❌ DB Check Error:', e.message);
    }

    // 3. Test RPC match_files
    console.log('\nTesting match_files RPC...');
    try {
        const testEmb = await generateEmbedding('test');
        if (testEmb) {
            const { data, error } = await supabase.rpc('match_files', {
                query_embedding: testEmb,
                match_threshold: 0.1,
                match_count: 5
            });
            if (error) console.error('❌ RPC Error:', error.message);
            else console.log(`✅ RPC call success. Found ${data.length} matches.`);
        }
    } catch (e) {
        console.error('❌ RPC Test Failed:', e.message);
    }
}

diagnose();
