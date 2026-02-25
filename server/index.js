require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

const { analyzeFile, generateEmbedding } = require('./services/gemini');
const supabase = require('./services/supabase');

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Cloud Storage API Running...');
});

// File Upload & AI Processing
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    console.log(`Processing file: ${file.originalname}`);

    // check for duplicates
    const { data: existingFile } = await supabase
      .from('file_metadata')
      .select('id')
      .eq('name', file.originalname)
      .eq('size', file.size)
      .single();

    if (existingFile) {
      return res.status(409).json({ error: 'Duplicate file detected' });
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
app.get('/api/search', async (req, res) => {
  try {
    const { query, mode } = req.query; // mode can be 'fuzzy' or 'semantic'
    if (!query) return res.status(400).json({ error: 'Query is required' });

    console.log(`Searching for: ${query} (Mode: ${mode})`);

    let files = [];

    if (mode === 'semantic') {
      // 1. Generate embedding for query
      const embedding = await generateEmbedding(query);

      // 2. Vector similarity search via RPC call to Supabase
      // Assuming a stored procedure 'match_files' exists
      const { data, error } = await supabase.rpc('match_files', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 10
      });

      if (error) throw error;
      files = data;
    } else {
      // Fuzzy Search using SQL ILIKE
      const { data, error } = await supabase
        .from('file_metadata')
        .select('*')
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
