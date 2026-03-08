const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const isLocal = process.env.RUN_LOCAL === 'true';
const dbPath = path.join(__dirname, '..', 'db.json');
const uploadDir = path.join(__dirname, '..', 'uploads');

// Load/Init Local DB
const getLocalData = () => {
    if (!fs.existsSync(dbPath)) return { files: [] };
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};
const saveLocalData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Cloud Supabase (Only init if credentials look valid to avoid crash in Local Mode)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
let cloudClient = null;

if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseKey) {
    try {
        cloudClient = createClient(supabaseUrl, supabaseKey);
    } catch (e) {
        console.warn('Failed to init cloud Supabase client:', e.message);
    }
}

// Vector Similarity Helper (Cosine Similarity)
const dotProduct = (a, b) => a.reduce((sum, val, i) => sum + val * b[i], 0);
const magnitude = (arr) => Math.sqrt(arr.reduce((sum, val) => sum + val * val, 0));
const cosineSimilarity = (a, b) => {
    if (!a || !b) return 0;
    return dotProduct(a, b) / (magnitude(a) * magnitude(b));
};

const db = {
    from: (table) => {
        if (!isLocal) return cloudClient.from(table);

        return {
            select: () => {
                let filters = [];
                let sortCol = 'created_at';
                let sortAsc = false;

                const chain = {
                    eq: (col, val) => {
                        filters.push(f => f[col] === val);
                        return chain;
                    },
                    or: (filterStr) => {
                        const query = filterStr.split(',')[0].split('.').pop().replace(/%/g, '').toLowerCase();
                        filters.push(f =>
                            f.title?.toLowerCase().includes(query) ||
                            f.summary?.toLowerCase().includes(query) ||
                            f.category?.toLowerCase().includes(query) ||
                            (f.tags && f.tags.some(t => t.toLowerCase().includes(query))) ||
                            f.full_text?.toLowerCase().includes(query)
                        );
                        return chain;
                    },
                    order: (col, { ascending }) => {
                        sortCol = col;
                        sortAsc = ascending;
                        return chain;
                    },
                    single: async () => {
                        const { files } = getLocalData();
                        const results = files.filter(f => filters.every(fn => fn(f)));
                        return { data: results[0] || null, error: null };
                    },
                    then: async (resolve) => {
                        const { files } = getLocalData();
                        const results = files.filter(f => filters.every(fn => fn(f)))
                            .sort((a, b) => (sortAsc ? a[sortCol] > b[sortCol] : a[sortCol] < b[sortCol]) ? 1 : -1);
                        resolve({ data: results, error: null });
                    }
                };
                return chain;
            },
            insert: (rows) => ({
                select: async () => {
                    const data = getLocalData();
                    const newRows = rows.map(r => ({
                        id: Math.random().toString(36).substr(2, 9),
                        created_at: new Date().toISOString(),
                        ...r
                    }));
                    data.files.push(...newRows);
                    saveLocalData(data);
                    return { data: newRows, error: null };
                }
            }),
            update: (updates) => ({
                eq: (col, val) => ({
                    eq: async (c2, v2) => {
                        const data = getLocalData();
                        data.files = data.files.map(f => (f[col] === val && f[c2] === v2) ? { ...f, ...updates } : f);
                        saveLocalData(data);
                        return { error: null };
                    }
                })
            }),
            delete: () => ({
                eq: async (col, val) => {
                    const data = getLocalData();
                    data.files = data.files.filter(f => f[col] !== val);
                    saveLocalData(data);
                    return { error: null };
                }
            })
        };
    },

    rpc: async (name, params) => {
        if (!isLocal) return cloudClient.rpc(name, params);
        if (name === 'match_files') {
            const { files } = getLocalData();
            const results = files.map(f => ({
                ...f,
                similarity: cosineSimilarity(f.embedding, params.query_embedding)
            }))
                .filter(f => f.similarity >= params.match_threshold)
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, params.match_count);
            return { data: results, error: null };
        }
    },

    storage: {
        from: (folder) => {
            if (!isLocal) return cloudClient.storage.from(folder);
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

            return {
                upload: async (fileName, buffer) => {
                    fs.writeFileSync(path.join(uploadDir, fileName), buffer);
                    return { data: { path: fileName }, error: null };
                },
                remove: async (paths) => {
                    paths.forEach(p => {
                        const fp = path.join(uploadDir, p);
                        if (fs.existsSync(fp)) fs.unlinkSync(fp);
                    });
                    return { data: null, error: null };
                }
            };
        }
    },

    auth: {
        getUser: async () => {
            if (!isLocal) return cloudClient.auth.getUser();
            return { data: { user: { id: 'local-user-123', email: 'local@cloudsense.ai' } }, error: null };
        }
    }
};

module.exports = db;
