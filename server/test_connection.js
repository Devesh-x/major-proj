const dns = require('dns').promises;
const https = require('https');

async function test() {
    console.log('--- 🌐 NETWORK & DNS DIAGNOSTIC ---');

    const hosts = [
        'google.com',
        'huggingface.co',
        'supabase.com',
        'ydeekuguretigbjjdlyz.supabase.co'
    ];

    for (const host of hosts) {
        try {
            const result = await dns.lookup(host);
            console.log(`✅ ${host.padEnd(40)} -> ${result.address}`);
        } catch (err) {
            console.log(`❌ ${host.padEnd(40)} -> FAILED (${err.code})`);
        }
    }

    console.log('\n--- 📁 CHECKING SUPABASE REACHABILITY ---');
    try {
        const url = 'https://ydeekuguretigbjjdlyz.supabase.co/rest/v1/';
        https.get(url, (res) => {
            console.log(`📡 Supabase Endpoint Status: ${res.statusCode}`);
        }).on('error', (e) => {
            console.log(`📡 Supabase Endpoint Error: ${e.message}`);
        });
    } catch (e) {
        console.log(`💥 Request Logic Failure: ${e.message}`);
    }
}

test();
