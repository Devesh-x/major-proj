-- CloudSense Database Migration
-- Run this in Supabase Dashboard → SQL Editor, or via: node scripts/migrate.js

-- 1. Enable pgvector for semantic search (384-dim for BAAI/bge-small-en-v1.5)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Core file metadata table
CREATE TABLE IF NOT EXISTS file_metadata (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name            TEXT NOT NULL,
    storage_path    TEXT NOT NULL,
    size            BIGINT,
    type            TEXT,
    tags            TEXT[],
    summary         TEXT,
    is_pii          BOOLEAN DEFAULT FALSE,
    pii_type        TEXT,
    title           TEXT,
    category        TEXT,
    hash            TEXT,
    user_id         TEXT NOT NULL,
    embedding       VECTOR(384),
    metrics         JSONB,
    full_text       TEXT
);

-- 3. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_file_metadata_user_id   ON file_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_file_metadata_hash       ON file_metadata(hash);
CREATE INDEX IF NOT EXISTS idx_file_metadata_category   ON file_metadata(category);
CREATE INDEX IF NOT EXISTS idx_file_metadata_created_at ON file_metadata(created_at DESC);

-- 4. Full-text search index (fuzzy search support)
CREATE INDEX IF NOT EXISTS idx_file_metadata_title_trgm   ON file_metadata USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_file_metadata_summary_trgm ON file_metadata USING gin(summary gin_trgm_ops);

-- 5. Vector index for semantic search (HNSW - fast approximate nearest neighbour)
CREATE INDEX IF NOT EXISTS idx_file_metadata_embedding
    ON file_metadata USING hnsw (embedding vector_cosine_ops);

-- 6. match_files function for semantic search RPC
CREATE OR REPLACE FUNCTION match_files(
    query_embedding VECTOR(384),
    match_threshold FLOAT,
    match_count     INT,
    user_id_filter  TEXT DEFAULT NULL
)
RETURNS TABLE (
    id           UUID,
    name         TEXT,
    title        TEXT,
    summary      TEXT,
    category     TEXT,
    tags         TEXT[],
    is_pii       BOOLEAN,
    pii_type     TEXT,
    storage_path TEXT,
    size         BIGINT,
    type         TEXT,
    created_at   TIMESTAMPTZ,
    similarity   FLOAT
)
LANGUAGE SQL STABLE
AS $$
    SELECT
        id, name, title, summary, category, tags, is_pii, pii_type,
        storage_path, size, type, created_at,
        1 - (embedding <=> query_embedding) AS similarity
    FROM file_metadata
    WHERE
        (user_id_filter IS NULL OR user_id = user_id_filter)
        AND embedding IS NOT NULL
        AND 1 - (embedding <=> query_embedding) >= match_threshold
    ORDER BY embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Done!
SELECT 'Migration complete ✅' AS status;
