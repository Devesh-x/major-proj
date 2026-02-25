-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

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
  is_pii BOOLEAN DEFAULT FALSE,
  pii_type TEXT,
  embedding vector(1536), -- Dimension for text-embedding-004 is usually 768 or 1536, let's assume 1536 for high quality
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID -- Link to Auth if needed
);

-- Semantic Search Function (RPC)
CREATE OR REPLACE FUNCTION match_files (
  query_embedding vector(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  title TEXT,
  summary TEXT,
  storage_path TEXT,
  size BIGINT,
  type TEXT,
  tags TEXT[],
  is_pii BOOLEAN,
  pii_type TEXT,
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
    file_metadata.storage_path,
    file_metadata.size,
    file_metadata.type,
    file_metadata.tags,
    file_metadata.is_pii,
    file_metadata.pii_type,
    file_metadata.created_at,
    1 - (file_metadata.embedding <=> query_embedding) AS similarity
  FROM file_metadata
  WHERE 1 - (file_metadata.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
