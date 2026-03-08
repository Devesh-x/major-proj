require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

const { analyzeFile, generateEmbedding } = require('./services/gemini');
const { chatWithDocument } = require('./services/standalone_chat');
const supabase = require('./services/supabase');
const crypto = require('crypto');

const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  req.user = user;
  next();
};

app.get('/', (req, res) => {
  res.send('AI Cloud Storage API Running...');
});

// File Upload & AI Processing (Benchmarked)
app.post('/api/upload', authenticate, upload.single('file'), async (req, res) => {
  const t0 = Date.now();
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    console.log(`Processing file: ${file.originalname} for user: ${req.user.id}`);

    // 1. Content Hashing (SHA-256) - Timing
    const h0 = Date.now();
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const hashTime = Date.now() - h0;

    // Check for duplicates
    const { data: existingFile } = await supabase
      .from('file_metadata')
      .select('id, name')
      .eq('hash', fileHash)
      .eq('user_id', req.user.id)
      .single();

    if (existingFile) {
      return res.status(409).json({
        error: 'Duplicate file detected',
        message: `This file already exists in your storage as "${existingFile.name}"`
      });
    }

    // 2. Analyze file with Gemini - Timing
    const a0 = Date.now();
    let analysis = null;
    try {
      analysis = await analyzeFile(file);
    } catch (e) {
      console.error('Core Gemini call failed unexpectedly:', e);
      analysis = {
        title: file.originalname,
        summary: 'Error processing file.',
        tags: ['Error'],
        category: 'Uncategorized',
        isPII: false,
        textContent: ''
      };
    }
    const analysisTime = Date.now() - a0;

    // 3. Generate Embedding for Semantic Search - Timing
    const v0 = Date.now();
    let embedding = null;
    try {
      if (analysis.textContent) {
        embedding = await generateEmbedding(`${analysis.title} ${analysis.summary} ${analysis.tags.join(' ')}`);
      }
    } catch (e) {
      console.warn('Embedding generation failed, skipping...');
    }
    const embeddingTime = Date.now() - v0;

    // 4. Upload to Supabase Storage - Timing
    const u0 = Date.now();
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });
    if (uploadError) throw uploadError;
    const uploadStoreTime = Date.now() - u0;

    // 5. Database Write with Metrics
    const d0 = Date.now();
    const metrics = {
      total: Date.now() - t0,
      stages: {
        hash: hashTime,
        analysis: analysisTime,
        embedding: embeddingTime,
        storage: uploadStoreTime
      }
    };

    const { data: dbData, error: dbError } = await supabase
      .from('file_metadata')
      .insert([
        {
          name: file.originalname,
          storage_path: uploadData.path,
          size: file.size,
          type: file.mimetype,
          tags: analysis.tags,
          summary: analysis.summary,
          is_pii: analysis.isPII,
          pii_type: analysis.piiType,
          title: analysis.title,
          category: analysis.category,
          hash: fileHash,
          user_id: req.user.id,
          embedding: embedding,
          metrics: metrics,
          full_text: analysis.textContent
        }
      ]).select();

    if (dbError) throw dbError;

    res.json({
      message: 'File analyzed and stored successfully',
      metadata: analysis,
      metrics: metrics,
      file: dbData[0]
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Summarize Entire Category (Folder Insight)
app.post('/api/summarize-category', authenticate, async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ error: 'Category is required' });

    console.log(`Summarizing category ${category} for user ${req.user.id}`);

    // Fetch all summaries in this category
    const { data: files, error } = await supabase
      .from('file_metadata')
      .select('title, summary')
      .eq('user_id', req.user.id)
      .eq('category', category);

    if (error) throw error;
    if (!files.length) return res.json({ summary: 'No files in this folder to summarize.' });

    const context = files.map(f => `- ${f.title}: ${f.summary}`).join('\n');
    const result = await analyzeFile({
      mimetype: 'text/plain',
      buffer: Buffer.from(`Summarize these document summaries for the folder "${category}":\n${context}`),
      originalname: `${category}_summary.txt`
    });

    res.json({ folderSummary: result.summary });
  } catch (error) {
    console.error('Folder summary error:', error);
    res.status(500).json({ error: 'Failed to generate folder summary' });
  }
});

// Delete File
app.delete('/api/delete-file/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get storage path
    const { data: file, error: fetchErr } = await supabase
      .from('file_metadata')
      .select('storage_path')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchErr || !file) throw new Error('File not found');

    // 2. Delete from Storage
    await supabase.storage.from('files').remove([file.storage_path]);

    // 3. Delete from DB
    await supabase.from('file_metadata').delete().eq('id', id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update File Tags
app.post('/api/update-tags', authenticate, async (req, res) => {
  try {
    const { fileId, tags } = req.body;
    const { error } = await supabase
      .from('file_metadata')
      .update({ tags })
      .eq('id', fileId)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Tags updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Files (Benchmarked Hybrid Search)
app.get('/api/search', authenticate, async (req, res) => {
  const tStart = Date.now();
  try {
    const { query = '', mode = 'fuzzy' } = req.query;

    let results = [];

    if (mode === 'semantic') {
      const embedding = await generateEmbedding(query);
      const { data, error } = await supabase.rpc('match_files', {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 10
      });
      if (error) throw error;
      results = data;
    } else {
      // Fuzzy Search using pg_trgm (via ILIKE with our new GIST indexes)
      let queryBuilder = supabase
        .from('file_metadata')
        .select('*')
        .eq('user_id', req.user.id);

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,summary.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false });

      if (error) throw error;
      results = data;
    }

    res.json({
      results,
      performance: {
        time_ms: Date.now() - tStart,
        mode: mode
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Chat with Document Endpoint
app.post('/api/chat', authenticate, async (req, res) => {
  try {
    const { fileId, query } = req.body;
    if (!fileId || !query) return res.status(400).json({ error: 'fileId and query are required' });

    console.log(`User ${req.user.id} chatting with file ${fileId}: ${query}`);
    const answer = await chatWithDocument(fileId, query, req.user.id);

    res.json({ answer });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
