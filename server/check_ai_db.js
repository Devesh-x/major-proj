require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    console.log('--- DATABASE HEALTH CHECK ---');
    try {
        // 1. Check if table has embedding column
        const { data: firstFile, error: fetchErr } = await supabase
            .from('file_metadata')
            .select('*')
            .limit(1)
            .single();

        if (fetchErr) {
            console.error('❌ Error fetching from file_metadata:', fetchErr.message);
        } else {
            console.log('✅ Connected to file_metadata table.');
            console.log('Column check:');
            console.log(`- embedding: ${firstFile.embedding ? (Array.isArray(firstFile.embedding) ? 'Present (Array)' : 'Present (Other)') : 'MISSING'}`);
            console.log(`- is_pii: ${typeof firstFile.is_pii !== 'undefined' ? 'Present' : 'MISSING'}`);
            console.log(`- category: ${firstFile.category || 'Empty'}`);
        }

        // 2. Check match_files RPC
        const { data: rpcTest, error: rpcErr } = await supabase.rpc('match_files', {
            query_embedding: Array(384).fill(0), // BGE Small is 384 dimensions
            match_threshold: 0.1,
            match_count: 1
        });

        if (rpcErr) {
            console.error('❌ RPC match_files logic error:', rpcErr.message);
            if (rpcErr.message.includes('not found')) {
                console.log('👉 ACTION REQUIRED: Need to create the match_files function in SQL.');
            }
        } else {
            console.log('✅ RPC match_files is available.');
        }

        // 3. Stats for AI Insights
        const { count, error: countErr } = await supabase
            .from('file_metadata')
            .select('*', { count: 'exact', head: true });
        
        console.log(`Total files in DB: ${count || 0}`);

    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

check();
