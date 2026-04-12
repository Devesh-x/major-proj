const { chatWithDocument } = require('./services/standalone_chat');
require('dotenv').config();

async function test() {
    console.log('--- AI Chat Diagnostics ---');
    console.log('Testing with a dummy query...');
    try {
        // We need a real file ID that exists in the DB
        // or we mock the supabase call in standalone_chat
        const result = await chatWithDocument('e54i7l4mu', 'What is this about?', 'local-user-123');
        console.log('Result:', result);
    } catch (err) {
        console.error('Test failed:', err);
    }
}

test();
