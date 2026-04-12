require('dotenv').config();
const { chatWithDocument } = require('./services/standalone_chat');

async function test() {
    console.log('--- AI Chat Final Verification ---');
    try {
        const result = await chatWithDocument('e54i7l4mu', 'Summarize this file.', 'local-user-123');
        console.log('AI Response:', result);
    } catch (err) {
        console.error('Final verification failed:', err);
    }
}

test();
