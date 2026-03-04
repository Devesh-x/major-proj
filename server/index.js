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

// File Upload & AI Processing
app.post('/api/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    console.log(`Processing file: ${file.originalname} for user: ${req.user.id}`);

    // Generate SHA-256 hash for duplicate detection
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // check for duplicates by hash and user_id
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

    // 1. Analyze file with Gemini
    const analysis = await analyzeFile(file);

    // 2. Generate Embedding for Semantic Search
    let embedding = null;
    try {
      embedding = await generateEmbedding(file.buffer.toString('utf8').substring(0, 5000));
    } catch (e) {
      console.warn('Embedding generation failed, skipping...');
    }

    // 3. Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 4. Save metadata to Database
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
          embedding: embedding
        }
      ]);

    if (dbError) throw dbError;

    res.json({
      message: 'File uploaded and analyzed successfully',
      metadata: analysis,
      storage_path: uploadData.path
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Search Files (Fuzzy + Semantic)
app.get('/api/search', authenticate, async (req, res) => {
  try {
    const { query, mode } = req.query; // mode can be 'fuzzy' or 'semantic'
    if (!query) return res.status(400).json({ error: 'Query is required' });

    console.log(`Searching for: ${query} (Mode: ${mode}) for user: ${req.user.id}`);

    let files = [];

    if (mode === 'semantic') {
      // 1. Generate embedding for query
      const embedding = await generateEmbedding(query);

      // 2. Vector similarity search via RPC call to Supabase
      const { data, error } = await supabase.rpc('match_files', {
        query_embedding: embedding,
        match_threshold: 0.3, // Lowered threshold for better recall as discussed in research
        match_count: 10,
        // We'll need to modify the RPC or filter results by user_id
      });

      if (error) throw error;
      // Filter by user_id manually if RPC doesn't support it yet
      files = data.filter(f => f.user_id === req.user.id);
    } else {
      // Fuzzy Search using SQL ILIKE
      const { data, error } = await supabase
        .from('file_metadata')
        .select('*')
        .eq('user_id', req.user.id)
        .or(`name.ilike.%${query}%,title.ilike.%${query}%,summary.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      files = data;
    }

    res.json(files);
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
