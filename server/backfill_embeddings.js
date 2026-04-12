require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { generateEmbedding } = require('./services/hf_analysis');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function backfill() {
    console.log('--- 🧠 STARTING EMBEDDING BACKFILL ---');
    
    // 1. Fetch files missing embeddings
    const { data: files, error } = await supabase
        .from('file_metadata')
        .select('id, name, title, summary, tags')
        .is('embedding', null);

    if (error) {
        console.error('Error fetching files:', error.message);
        return;
    }

    console.log(`Found ${files.length} files requiring embeddings.`);

    for (const file of files) {
        console.log(`Processing: "${file.name}"...`);
        try {
            // Combine fields for a rich embedding context
            const textToEmbed = `${file.title} ${file.summary} ${(file.tags || []).join(' ')}`.trim();
            const embedding = await generateEmbedding(textToEmbed);

            if (embedding) {
                const { error: updError } = await supabase
                    .from('file_metadata')
                    .update({ embedding })
                    .eq('id', file.id);

                if (updError) console.error(`   ❌ Failed to update DB for ${file.name}:`, updError.message);
                else console.log(`   ✅ Success`);
            } else {
                console.warn(`   ⚠️  Could not generate embedding for ${file.name} (Check HF Token or Content)`);
            }
            
            // Wait slightly to avoid HF rate limits on free tier
            await new Promise(r => setTimeout(r, 800));
            
        } catch (e) {
            console.error(`   ❌ Unexpected error for ${file.name}:`, e.message);
        }
    }

    console.log('\n🎉 Backfill complete!');
}

backfill();
