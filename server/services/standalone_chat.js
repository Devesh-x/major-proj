const supabase = require('./supabase');
const keyManager = require('../utils/geminiKeys');

/**
 * Handles Retrieval Augmented Generation (RAG) for chatting with a specific document.
 * @param {string} fileId - The ID of the file to chat with.
 * @param {string} userQuery - The user's question.
 * @param {string} userId - Auth user ID for security.
 */
async function chatWithDocument(fileId, userQuery, userId) {
    let file = null;
    try {
        // 1. Fetch file context
        const { data, error } = await supabase
            .from('file_metadata')
            .select('title, summary, full_text, name')
            .eq('id', fileId)
            .eq('user_id', userId)
            .single();

        if (error || !data) throw new Error('File not found or access denied');
        file = data;

        const prompt = `
            You are an AI assistant for CloudSense Cloud Storage. The user is asking a question about their file: "${file.title}" (${file.name}).
            
            Document Content:
            ${file.full_text || file.summary} 

            User Question:
            "${userQuery}"

            Instructions:
            - Answer accurately based on the Document Content provided.
            - If the content is missing, use the summary.
            - If the answer is not in the content, say you don't have enough information from the file.
            - Be helpful, concise, and professional.
        `;

        return await keyManager.executeWithFallback(async (genAI_client) => {
            const model = genAI_client.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        });

    } catch (error) {
        console.error('All Gemini Chat keys failed (API throttled), using local context extractor:', error.message);

        // Fallback requires file to be found
        if (!file) {
            return "I couldn't find the file you're asking about. Please try again or refresh the dashboard.";
        }

        // Smarter local fallback
        const q = userQuery.toLowerCase();
        const content = (file.full_text || file.summary || "").toLowerCase();

        if (q.includes("summary") || q.includes("what is") || q.includes("about")) {
            return `I'm having trouble reaching my brain right now, but here's a quick summary of this file: ${file.summary || "No summary found."}`;
        }

        if (content.length > 50) {
            // Try to find the sentence containing a keyword from the query
            const keywords = q.split(' ').filter(word => word.length > 4);
            for (const word of keywords) {
                const idx = content.indexOf(word);
                if (idx !== -1) {
                    const snippet = content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 120));
                    return `I'm currently in offline mode, but I found this relevant snippet in the file: "...${snippet}..."`;
                }
            }
        }

        return "I'm currently experiencing high traffic and couldn't process this specific question. However, I've indexed this file and you can see its summary and tags in the dashboard!";
    }
}

module.exports = { chatWithDocument };
