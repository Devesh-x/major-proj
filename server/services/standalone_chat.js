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
        // 1. Fetch file metadata and summary
        const { data: file, error } = await supabase
            .from('file_metadata')
            .select('title, summary, storage_path, name')
            .eq('id', fileId)
            .eq('user_id', userId)
            .single();

        if (error || !file) throw new Error('File not found or access denied');

        // 2. Ideally, we would fetch the full text from storage here.
        // For this "standout" feature demo, we'll use the AI-generated summary 
        // and file context to answer, or fetch a chunk if needed.
        // In a full implementation, we'd read the file from Supabase Storage.

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI assistant for Nebula Cloud Storage. The user is asking a question about their file: "${file.title}" (${file.name}).
            
            File Context/Summary:
            ${file.summary}

            User Question:
            "${userQuery}"

            Instructions:
            - Answer the question based on the provided file context.
            - If the answer isn't in the summary, acknowledge that you are analyzing based on the summary provided during upload.
            - Be concise and professional.
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
