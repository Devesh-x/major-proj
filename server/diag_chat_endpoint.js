const fetch = require('node-fetch');

async function testChat() {
    const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer dummy-token'
        },
        body: JSON.stringify({ 
            fileId: 'e54i7l4mu', 
            query: 'What is this regarding?' 
        })
    });

    const data = await res.json();
    console.log('Status Code:', res.status);
    console.log('Response Body:', data);
}

testChat().catch(console.error);
