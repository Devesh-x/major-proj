const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiKeyManager {
    constructor() {
        this.keys = this._loadKeys();
        this.currentIndex = 0;
        this.clients = this.keys.map(key => new GoogleGenerativeAI(key));
    }

    _loadKeys() {
        const keyString = process.env.GEMINI_API_KEY || '';
        // Split by comma, remove whitespace, and filter out empty strings
        const parsedKeys = keyString.split(',').map(k => k.trim()).filter(k => k);

        if (parsedKeys.length === 0) {
            console.warn('⚠️ No Gemini API keys found in environment variables.');
        } else {
            console.log(`🔑 Loaded ${parsedKeys.length} Gemini API key(s) for rotation.`);
        }
        return parsedKeys;
    }

    /**
     * Executes a GoogleGenerativeAI operation, automatically falling back to the next
     * available API key if a 429 (Resource Exhausted) error occurs.
     * 
     * @param {Function} operation - A function that takes a `genAI` client instance and returns a Promise.
     * @returns {Promise<any>} The result of the operation.
     */
    async executeWithFallback(operation) {
        if (this.clients.length === 0) {
            throw new Error("No Gemini API keys available to process the request.");
        }

        let attempts = 0;
        const maxAttempts = this.clients.length;

        while (attempts < maxAttempts) {
            const currentClient = this.clients[this.currentIndex];
            try {
                // Try executing the AI operation with the current client
                return await operation(currentClient);
            } catch (error) {
                // Check if the error is a rate limit (429) or related to quota
                const isRateLimit = error.message?.includes('429') ||
                    error.message?.includes('RESOURCE_EXHAUSTED') ||
                    error.status === 429;

                if (isRateLimit) {
                    console.warn(`[Key Manager] Key ${this.currentIndex + 1}/${maxAttempts} exhausted. Rotating to next key...`);
                    // Move to the next key, looping back to 0 if at the end
                    this.currentIndex = (this.currentIndex + 1) % this.clients.length;
                    attempts++;
                } else {
                    // If it's a different kind of error (e.g., bad prompt), throw it immediately
                    throw error;
                }
            }
        }

        // Output error if all keys have been exhausted
        throw new Error(`All ${maxAttempts} Gemini API keys have been exhausted (429 Rate Limit).`);
    }
}

// Export a singleton instance
module.exports = new GeminiKeyManager();
