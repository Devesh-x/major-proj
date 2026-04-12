const { classifyFile } = require('./services/hf_analysis.js');
const fs = require('fs');

const testFile = {
    originalname: 'PII_Test_SSN.txt',
    mimetype: 'text/plain'
};
const textContent = fs.readFileSync('../PII_Test_SSN.txt', 'utf8');

const analysis = classifyFile(testFile, textContent);
console.log('--- ANALYSIS RESULT ---');
console.log(JSON.stringify(analysis, null, 2));

if (analysis.isPII) {
    console.log('\n✅ PII DETECTION WORKING: The file was correctly flagged as sensitive.');
} else {
    console.log('\n❌ PII DETECTION FAILED: The file was not flagged.');
}
