const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('./supabase');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Handles Retrieval Augmented Generation (RAG) for chatting with a specific document.
 * @param {string} fileId - The ID of the file to chat with.
 * @param {string} userQuery - The user's question.
 * @param {string} userId - Auth user ID for security.
 */
async function chatWithDocument(fileId, userQuery, userId) {
    try {
        // 1. Fetch file context
        const { data: file, error } = await supabase
            .from('file_metadata')
            .select('title, summary, full_text, name')
            .eq('id', fileId)
            .eq('user_id', userId)
            .single();

        if (error || !file) throw new Error('File not found or access denied');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI assistant for Nebula Cloud Storage. The user is asking a question about their file: "${file.title}" (${file.name}).
            
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Chat error:', error);
        throw error;
    }
}

module.exports = { chatWithDocument };
