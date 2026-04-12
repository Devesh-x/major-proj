require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { analyzeFile } = require('../services/gemini');

const DB_PATH = path.join(__dirname, '../db.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

async function heal() {
    console.log('🚀 Starting Database Healing Process...');

    if (!fs.existsSync(DB_PATH)) {
        console.error('❌ db.json not found at', DB_PATH);
        return;
    }

    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const files = db.files || [];
    let healedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < files.length; i++) {
        const fileEntry = files[i];
        const needsHealing = 
            fileEntry.summary === 'AI analysis unavailable.' || 
            fileEntry.summary.includes('Parsing Failed') ||
            fileEntry.summary.includes('throttled') ||
            (fileEntry.full_text && fileEntry.full_text.includes('Parsing Failed'));

        if (needsHealing) {
            console.log(`\n[${i+1}/${files.length}] Healing file: ${fileEntry.name} (${fileEntry.id})`);
            
            const filePath = path.join(UPLOADS_DIR, fileEntry.storage_path);
            
            if (!fs.existsSync(filePath)) {
                console.warn(`   ⚠️ File missing on disk: ${fileEntry.storage_path}. Skipping.`);
                continue;
            }

            try {
                const buffer = fs.readFileSync(filePath);
                const mockFile = {
                    originalname: fileEntry.name,
                    mimetype: fileEntry.type,
                    buffer: buffer
                };

                const analysis = await analyzeFile(mockFile);
                
                // Update the entry
                files[i] = {
                    ...fileEntry,
                    tags: analysis.tags,
                    summary: analysis.summary,
                    is_pii: analysis.isPII,
                    pii_type: analysis.piiType,
                    title: analysis.title,
                    category: analysis.category,
                    full_text: analysis.textContent || fileEntry.full_text
                };

                console.log(`   ✅ Healed successfully: ${analysis.category} | ${analysis.tags.slice(0, 3).join(', ')}`);
                healedCount++;

                // Wait 20 seconds to avoid hitting rate limits
                console.log('   ⏳ Waiting 20s for quota reset...');
                await new Promise(resolve => setTimeout(resolve, 20000));

                // Partial save every 5 files to prevent data loss on crash
                if (healedCount % 5 === 0) {
                    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
                }
            } catch (err) {
                console.error(`   ❌ Failed to heal ${fileEntry.name}:`, err.message);
                failedCount++;
            }
        }
    }

    // Final save
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log(`\n✨ Healing Complete!`);
    console.log(`   - Healed: ${healedCount}`);
    console.log(`   - Failed: ${failedCount}`);
    console.log(`   - Total Files: ${files.length}`);
}

heal().catch(err => {
    console.error('💥 Fatal Healing Error:', err);
});
