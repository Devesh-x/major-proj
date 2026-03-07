# ☁️ Nebula Cloud — AI-Powered Cloud Storage

> An intelligent cloud storage platform that uses **Gemini AI** to automatically parse, tag, and secure your files — with both fuzzy and semantic search built in.

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Supabase%20%7C%20Gemini-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Auto-Tagging** | Gemini parses every uploaded file and generates titles, summaries, and tags automatically |
| 🔍 **Fuzzy Search** | Fast keyword-based search across file names, titles, and summaries |
| 🧠 **Semantic Search** | Find files by meaning, not just words — powered by vector embeddings |
| 🛡️ **PII Detection** | Automatically flags sensitive documents (Passport, National ID, etc.) with a security alert |
| 🔁 **Duplicate Prevention** | Blocks re-uploading of identical files using SHA-256 content hashing |
| 🎨 **Premium Dashboard** | Glassmorphism UI with drag-and-drop uploads and real-time feedback |

---

## 🏗️ Tech Stack

**Frontend**
- React 19 + Vite 6
- Tailwind CSS v4
- Lucide React (icons)
- Axios

**Backend**
- Node.js + Express
- Multer (file handling)
- pdf-parse, mammoth (document parsing)
- `@google/generative-ai` (Gemini)
- `@supabase/supabase-js`

**Infrastructure (Free Tier)**
- **Supabase** — Auth, PostgreSQL database, File Storage
- **pgvector** — Vector similarity search (HNSW indexing)
- **Google AI Studio** — Gemini 1.5 Flash + text-embedding-004

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A [Supabase](https://supabase.com) account (free)
- A [Google AI Studio](https://aistudio.google.com) API key (free)

### 1. Clone the Repository

```bash
git clone https://github.com/Devesh-x/major-proj.git
cd major-proj
```

### 2. Set Up Supabase

Go to the **SQL Editor** in your Supabase project and run the full contents of:

```
supabase_setup.sql
```

This will:
- Enable the `pgvector` extension
- Create the `file_metadata` table with vector column
- Create the `match_files` RPC function for semantic search

Also create a **Storage bucket** named `files` in your Supabase dashboard.

### 3. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Install Dependencies & Run

**Backend:**
```bash
cd server
npm install
node index.js
```

**Frontend** (in a new terminal):
```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧠 How the AI Pipeline Works

```
User Uploads File
       │
       ▼
┌─────────────────┐
│  Text Extraction │  ← pdf-parse / mammoth / raw text
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  Gemini 1.5 Flash    │  → Tags, Summary, PII Detection
└────────┬─────────────┘
         │
         ▼
┌─────────────────────────┐
│  text-embedding-004      │  → 768-dim vector embedding
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Supabase Storage + pgvector │  → File stored, metadata saved
└──────────────────────────────┘
```

**Search Flow:**
- **Fuzzy mode** → SQL `ILIKE` pattern matching on name, title, summary
- **Semantic mode** → Embed query → HNSW cosine similarity via `match_files` RPC

---

## 📁 Project Structure

```
major-proj/
├── client/                  # React frontend
│   └── src/
│       ├── App.jsx          # Main dashboard
│       └── index.css        # Tailwind + global styles
├── server/                  # Node.js backend
│   ├── services/
│   │   ├── gemini.js        # AI analysis + embeddings
│   │   └── supabase.js      # DB client
│   └── index.js             # Express API routes
├── supabase_setup.sql       # Database schema + RPC functions
└── README.md
```

---

## 🔬 Algorithms

| Feature | Algorithm | Time Complexity |
|---|---|---|
| Fuzzy Search | `pg_trgm` trigram matching | O(log n) |
| Semantic Search | HNSW Approximate Nearest Neighbor | O(log n) |
| Similarity Scoring | Cosine Similarity | O(d) |
| Duplicate Detection | SHA-256 content hash | O(1) |
| AI Tagging | Gemini transformer (zero-shot) | — |

---

## 📄 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload a file; triggers AI analysis |
| `GET` | `/api/search?query=&mode=fuzzy` | Keyword/fuzzy file search |
| `GET` | `/api/search?query=&mode=semantic` | Semantic vector search |

---

## 📜 License

MIT © 2026 Devesh
