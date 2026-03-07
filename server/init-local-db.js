const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/cloudsense_db'
});

async function init() {
    try {
        await client.connect();
        console.log('Connected to local Postgres. Initializing schema...');

        const sqlPath = path.join(__dirname, '..', 'supabase_setup.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute the SQL setup
        await client.query(sql);
        console.log('✅ Schema initialized successfully!');

    } catch (err) {
        console.error('❌ Failed to initialize local DB:', err.message);
        console.log('\nMake sure your Docker container is running: docker-compose up -d');
    } finally {
        await client.end();
    }
}

init();
