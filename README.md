# Nebula Cloud Storage - Setup Guide

This project consists of a React frontend and a Node.js backend with Gemini AI integration.

## 1. Prerequisites
- [Supabase Account](https://supabase.com/) (Free tier)
- [Google AI Studio API Key](https://aistudio.google.com/) (Gemini API)

## 2. Environment Variables
Create a `.env` file in the `server` directory based on `.env.example`:

```env
PORT=5000
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## 3. Database Setup
Go to your Supabase SQL Editor and run the contents of `supabase_setup.sql` to:
1. Enable `pgvector`.
2. Create the `file_metadata` table.
3. Create the `match_files` RPC function for semantic search.

## 4. Running the Project

### Start Backend
```bash
cd server
npm install
node index.js
```

### Start Frontend
```bash
cd client
npm install
npm run dev
```

## Features
- **AI Analysis**: Gemini parses your files to generate titles, summaries, and tags.
- **Security**: Automated detection of PII/ID proofs with visual warnings.
- **Search**: Choose between traditional Fuzzy search and AI-powered Semantic search.
- **UI**: Modern glassmorphism dashboard with real-time upload status.
