/**
 * CloudSense Database Migration Runner
 * Connects via direct PostgreSQL and runs migrate.sql
 * Usage: node scripts/migrate.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    const client = await pool.connect();
    try {
        console.log('🔌 Connected to Supabase PostgreSQL...');
        
        const sql = fs.readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8');
        
        // Split and run statement by statement (skip empty lines)
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const stmt of statements) {
            try {
                const result = await client.query(stmt);
                if (result.rows?.length > 0) {
                    console.log('   ', result.rows[0]);
                } else {
                    // Print first 60 chars of statement as progress
                    console.log(`   ✅ ${stmt.substring(0, 60).replace(/\n/g, ' ')}...`);
                }
            } catch (e) {
                // Log but continue — most errors are "already exists" which is fine
                if (e.message.includes('already exists')) {
                    console.log(`   ⚠️  Already exists (skipping): ${stmt.substring(0, 50)}...`);
                } else {
                    console.error(`   ❌ Error: ${e.message}`);
                    console.error(`      Statement: ${stmt.substring(0, 100)}`);
                }
            }
        }

        // Verify table exists
        const check = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'file_metadata' 
            ORDER BY ordinal_position
        `);
        
        console.log('\n📋 file_metadata table columns:');
        check.rows.forEach(r => console.log(`   ${r.column_name} (${r.data_type})`));
        console.log('\n🎉 Migration complete! Database is ready.\n');

    } finally {
        client.release();
        await pool.end();
    }
}

run().catch(err => {
    console.error('💥 Migration failed:', err.message);
    process.exit(1);
});
