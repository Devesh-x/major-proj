/**
 * Gemini API Key Manager — uses the new @google/genai SDK.
 * Supports round-robin key rotation on 429 / RESOURCE_EXHAUSTED errors.
 * 
 * Because @google/genai is ESM-only, we use dynamic import() and expose
 * an async init() + executeWithFallback() wrapper.
 */

class GeminiKeyManager {
    constructor() {
        this.keys = this._loadKeys();
        this.currentIndex = 0;
        this.clients = []; // filled by init()
        this._ready = this._init();
    }

    _loadKeys() {
        const keyString = process.env.GEMINI_API_KEY || '';
        const parsedKeys = keyString.split(',').map(k => k.trim()).filter(k => k);

        if (parsedKeys.length === 0) {
            console.warn('⚠️ No Gemini API keys found in environment variables.');
        } else {
            console.log(`🔑 Loaded ${parsedKeys.length} Gemini API key(s) for rotation.`);
        }
        return parsedKeys;
    }

    async _init() {
        if (this.keys.length === 0) return;
        try {
            const { GoogleGenAI } = await import('@google/genai');
            this.clients = this.keys.map(key => new GoogleGenAI({ apiKey: key }));
            console.log('✅ Gemini SDK (@google/genai) initialized successfully.');
        } catch (e) {
            console.error('❌ Failed to initialize @google/genai SDK:', e.message);
        }
    }

    /**
     * Executes a Gemini operation with automatic key rotation on rate-limit errors.
     * @param {Function} operation — receives a GoogleGenAI client instance, returns a Promise.
     * @param {Object} options — custom options for the execution.
     * @param {number} options.maxRetries — maximum retries for rate limiting.
     */
    async executeWithFallback(operation, options = {}) {
        await this._ready;

        if (this.clients.length === 0) {
            throw new Error('No Gemini API keys available.');
        }

        let attempts = 0;
        const maxAttempts = options.maxRetries || Math.max(this.clients.length, 50); 

        while (attempts < maxAttempts) {
            const currentClient = this.clients[this.currentIndex];
            try {
                return await operation(currentClient);
            } catch (error) {
                const msg = error.message || '';
                const isRateLimit =
                    msg.includes('429') ||
                    msg.includes('RESOURCE_EXHAUSTED') ||
                    error.status === 429;

                if (isRateLimit) {
                    attempts++;
                    console.warn(`[Key Manager] Throttled (Attempt ${attempts}/${maxAttempts})...`);
                    
                    // If we've tried all keys and are still throttled, and it's the last few attempts, wait 35s
                    if (attempts > (maxAttempts - 2)) {
                        console.log(`[Key Manager] 🛑 All keys exhausted. Entering 35s "Quota Recovery" sleep...`);
                        await new Promise(resolve => setTimeout(resolve, 35000));
                    } else {
                        // Progressive Backoff (1s per attempt + jitter)
                        const delay = (attempts * 1000) + Math.floor(Math.random() * 500);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }

                    // Rotate if possible
                    if (this.clients.length > 1) {
                        this.currentIndex = (this.currentIndex + 1) % this.clients.length;
                    }
                } else {
                    throw error;
                }
            }
        }

        throw new Error(`Exhausted all retries after ${maxAttempts} attempts due to Rate Limits.`);
    }
}

module.exports = new GeminiKeyManager();
