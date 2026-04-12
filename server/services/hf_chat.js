/**
 * CloudSense AI Chat — Hybrid approach:
 *   1. For specific questions → HF Extractive QA (roberta-base-squad2)
 *   2. For general questions → Uses stored AI summary + keyword search
 * 
 * Both work reliably on HF free tier.
 */

const supabase = require('./supabase');

const HF_TOKEN = process.env.HF_TOKEN;
const QA_MODEL = 'deepset/roberta-base-squad2';
const QA_URL = `https://router.huggingface.co/hf-inference/models/${QA_MODEL}`;

console.log(`[HF Chat] Model: ${QA_MODEL} | Mode: Hybrid QA + Summary`);

/**
 * Extract answer from document text using HF QA model.
 */
async function extractAnswer(question, context) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
        const res = await fetch(QA_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: { question, context } }),
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`QA API ${res.status}`);
        return await res.json();
    } catch (e) {
        clearTimeout(timeout);
        throw e;
    }
}

/**
 * Smart keyword search — finds relevant passages in document text.
 */
function findRelevantPassages(query, fullText, maxPassages = 3) {
    if (!fullText || fullText.length < 20) return [];

    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const text = fullText.toLowerCase();
    const passages = [];
    const seen = new Set();

    for (const word of words) {
        let startIdx = 0;
        while (passages.length < maxPassages) {
            const idx = text.indexOf(word, startIdx);
            if (idx === -1) break;

            const snippetStart = Math.max(0, idx - 100);
            const snippetEnd = Math.min(fullText.length, idx + 300);
            const key = Math.floor(snippetStart / 200); // deduplicate nearby matches
            
            if (!seen.has(key)) {
                seen.add(key);
                passages.push(fullText.substring(snippetStart, snippetEnd).trim());
            }
            startIdx = idx + word.length;
        }
    }

    return passages;
}

/**
 * Detect if question is general ("tell me about", "what's in this file")
 * vs specific ("what programming languages", "who is the author").
 */
function isGeneralQuestion(query) {
    const q = query.toLowerCase();
    const generalPatterns = [
        'about this file', 'about this document', 'what is this', 'tell me',
        'what inside', 'what\'s in', 'whats in', 'describe', 'overview',
        'summarize', 'summary', 'explain this', 'what does this'
    ];
    return generalPatterns.some(p => q.includes(p));
}

/**
 * Chat with a document — hybrid QA + summary approach.
 */
async function chatWithDocument(fileId, userQuery, userId) {
    let file = null;

    try {
        // 1. Fetch file from Supabase
        const { data, error } = await supabase
            .from('file_metadata')
            .select('title, summary, full_text, name, category, tags')
            .eq('id', fileId)
            .eq('user_id', userId)
            .single();

        if (error || !data) throw new Error('File not found');
        file = data;

        const fullText = (file.full_text || '').trim();
        const hasContent = fullText.length > 30;
        const title = file.title || file.name;

        // 2. Handle general questions with stored summary + overview
        if (isGeneralQuestion(userQuery)) {
            let response = `📄 **${title}**\n📁 Category: ${file.category || 'General'}\n`;

            if (file.tags?.length > 0) {
                response += `🏷️ Tags: ${file.tags.join(', ')}\n`;
            }

            response += `\n📝 **Summary:**\n${file.summary || 'No summary available.'}\n`;

            if (hasContent) {
                // Add first 500 chars as a preview
                response += `\n📖 **Content Preview:**\n${fullText.substring(0, 500).trim()}...`;
                response += `\n\n_Total: ${fullText.length} characters extracted. Ask me specific questions about the content!_`;
            }

            return response;
        }

        // 3. For specific questions — try QA model first
        if (hasContent && HF_TOKEN) {
            try {
                // Send chunks to QA model for better answers
                const chunks = [];
                for (let i = 0; i < Math.min(fullText.length, 8000); i += 2000) {
                    chunks.push(fullText.substring(i, i + 2000));
                }

                let bestAnswer = null;
                let bestScore = 0;

                for (const chunk of chunks) {
                    try {
                        const result = await extractAnswer(userQuery, chunk);
                        if (result.score > bestScore) {
                            bestScore = result.score;
                            bestAnswer = result.answer;
                        }
                    } catch {
                        // Skip failed chunks
                    }
                }

                if (bestAnswer && bestScore > 0.05) {
                    let response = `**${bestAnswer}**`;
                    if (bestScore < 0.3) {
                        response += `\n\n_(Low confidence: ${Math.round(bestScore * 100)}%)_`;
                    }

                    // Add relevant passages for context
                    const passages = findRelevantPassages(userQuery, fullText, 1);
                    if (passages.length > 0) {
                        response += `\n\n📖 **Context from document:**\n> "${passages[0]}..."`;
                    }

                    return response;
                }
            } catch (e) {
                console.warn('[HF Chat] QA model failed:', e.message);
            }
        }

        // 4. Fallback: keyword search in full text
        if (hasContent) {
            const passages = findRelevantPassages(userQuery, fullText, 3);
            if (passages.length > 0) {
                let response = `Here's what I found about "${userQuery}" in **${title}**:\n\n`;
                passages.forEach((p, i) => {
                    response += `> "${p}..."\n\n`;
                });
                return response;
            }
        }

        // 5. Last resort: return summary
        return `I couldn't find a specific answer to "${userQuery}" in this document.\n\n📄 **${title}** (${file.category})\n${file.summary || 'No summary available.'}`;

    } catch (error) {
        console.error('[HF Chat] Error:', error.message);

        if (file) {
            return `📄 **${file.title || file.name}** (${file.category || 'General'})\n\n${file.summary || 'No summary available.'}\n\n_(AI chat temporarily unavailable — try again in a moment)_`;
        }
        return "File not found. Please refresh and try again.";
    }
}

module.exports = { chatWithDocument };
