/**
 * Supabase Setup Script — runs over HTTPS (no direct pg port needed)
 * Creates the storage bucket and verifies the connection.
 * Usage: node scripts/setup_supabase.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    console.log('\n🔌 Connecting to Supabase:', process.env.SUPABASE_URL);

    // 1. Test connection
    console.log('\n1️⃣  Testing database connection...');
    const { data: tables, error: tableErr } = await supabase
        .from('file_metadata')
        .select('id')
        .limit(1);

    if (tableErr) {
        if (tableErr.message.includes('does not exist')) {
            console.log('   ⚠️  Table "file_metadata" does not exist yet.');
            console.log('   → Run the SQL from scripts/migrate.sql in your Supabase Dashboard:');
            console.log('   → https://supabase.com/dashboard/project/ydeekuguretigbjjdlyz/sql/new\n');
        } else {
            console.log('   ❌ DB Error:', tableErr.message);
        }
    } else {
        console.log(`   ✅ Connected! file_metadata table exists (${tables.length} rows visible)`);
    }

    // 2. Create storage bucket
    console.log('\n2️⃣  Creating storage bucket "files"...');
    const { data: bucket, error: bucketErr } = await supabase.storage.createBucket('files', {
        public: false,
        allowedMimeTypes: null, // allow all
        fileSizeLimit: 52428800 // 50MB
    });

    if (bucketErr) {
        if (bucketErr.message.includes('already exists') || bucketErr.message.includes('duplicate')) {
            console.log('   ✅ Bucket "files" already exists');
        } else {
            console.log('   ❌ Bucket error:', bucketErr.message);
        }
    } else {
        console.log('   ✅ Bucket "files" created successfully');
    }

    // 3. List buckets to confirm
    console.log('\n3️⃣  Listing all storage buckets...');
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    if (!listErr && buckets) {
        buckets.forEach(b => console.log(`   📦 ${b.name} (public: ${b.public})`));
    }

    console.log('\n✅ Setup complete!\n');
    console.log('Next steps:');
    console.log('1. Run the SQL schema in Supabase Dashboard if not done:');
    console.log('   https://supabase.com/dashboard/project/ydeekuguretigbjjdlyz/sql/new');
    console.log('2. Paste the contents of: scripts/migrate.sql');
    console.log('3. Then set RUN_LOCAL=false in .env and restart the server\n');
}

run().catch(err => {
    console.error('💥 Setup failed:', err.message);
    process.exit(1);
});
