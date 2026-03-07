# ☁️ CloudSense — AI-Powered Cloud Storage

> An intelligent, secure cloud storage platform that leverages advanced AI to automatically analyze, organize, and protect your digital assets. With integrated semantic search, CloudSense understands the context of your files, not just their filenames.

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Cloud--Native-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Key Capabilities

| Capability | Description |
|---|---|
| 🤖 **Automated Insights** | Our AI pipeline processes every upload to generate intelligent titles, summaries, and categorizations. |
| 🔍 **Fuzzy Search** | Blazing-fast keyword matching across file names, AI-generated metadata, and summaries. |
| 🧠 **Semantic Search** | Discover files by meaning and context—ask for "travel documents" and find your passport instantly. |
| 🛡️ **Sensitive Data Guard** | Proactive detection of identity documents and PII, ensuring your most private files are flagged and secured. |
| 🔁 **Smart Deduplication** | Intelligent hashing prevents redundant uploads, keeping your storage optimized and clean. |
| 🎨 **Executive Dashboard** | A premium, minimalist interface designed for high-performance file management. |

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

## 📁 Project Architecture

```
major-proj/
├── client/                  # Frontend Application (React)
├── server/                  # Backend Services (Node.js)
├── supabase_setup.sql       # Database Infrastructure
└── README.md
```

---

## 🔬 Core Algorithms

| Feature | Methodology |
|---|---|
| Search Indexing | Advanced Vector Space Modeling |
| Discovery | Semantic Contextual Hybrid Search |
| Optimization | Intelligent Content Fingerprinting |
| AI Pipeline | Transformer-based Extraction |

---

## 📄 API Specifications

| Method | Endpoint | Functionality |
|---|---|---|
| `POST` | `/api/upload` | Ingests file and triggers automated AI analysis |
| `GET` | `/api/search` | Context-aware document retrieval |

---

## 📜 License

MIT © 2026 CloudSense
