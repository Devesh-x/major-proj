-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- File Metadata Table
CREATE TABLE IF NOT EXISTS file_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  storage_path TEXT NOT NULL,
  size BIGINT,
  type TEXT,
  tags TEXT[],
  category TEXT, -- New column for Smart Folders
  is_pii BOOLEAN DEFAULT FALSE,
  pii_type TEXT,
  hash TEXT UNIQUE, -- SHA-256 content hash for duplicate detection
  embedding vector(768), -- Dimension for text-embedding-004 is 768
  user_id UUID REFERENCES auth.users(id), -- Link to Supabase Auth
  full_text TEXT, -- Extracted text for RAG (Talk to Your File)
  metrics JSONB, -- To store timing data for research (Comparison 5)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX ON file_metadata USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_file_title_trgm ON file_metadata USING gist (title gist_trgm_ops);
CREATE INDEX idx_file_summary_trgm ON file_metadata USING gist (summary gist_trgm_ops);

-- Semantic Search Function (RPC)
-- (Rest of the file remains same, but ensured for reference)
CREATE OR REPLACE FUNCTION match_files (
  query_embedding vector(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  title TEXT,
  summary TEXT,
  category TEXT,
  storage_path TEXT,
  size BIGINT,
  type TEXT,
  tags TEXT[],
  is_pii BOOLEAN,
  pii_type TEXT,
  full_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    file_metadata.id,
    file_metadata.name,
    file_metadata.title,
    file_metadata.summary,
    file_metadata.category,
    file_metadata.storage_path,
    file_metadata.size,
    file_metadata.type,
    file_metadata.tags,
    file_metadata.is_pii,
    file_metadata.pii_type,
    file_metadata.full_text,
    file_metadata.created_at,
    1 - (file_metadata.embedding <=> query_embedding) AS similarity
  FROM file_metadata
  WHERE (1 - (file_metadata.embedding <=> query_embedding) > match_threshold)
  AND (file_metadata.user_id = auth.uid()) -- Security filter
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
