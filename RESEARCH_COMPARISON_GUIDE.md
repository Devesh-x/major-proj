# 📊 Nebula Cloud — Research Comparison Guide

> A guide explaining how we benchmark and compare our AI-powered cloud storage system against traditional systems. Share this with anyone working on the research paper.

---

## 🔬 What We Are Comparing

We compare **Nebula Cloud** (our system) against 3 baselines:

| System | Search | AI | PII Detection | Duplicate Check |
|---|---|---|---|---|
| Traditional SQL Storage | Keyword only | ❌ | ❌ | ❌ |
| Google Drive / Dropbox | Keyword only | Limited | ❌ | Basic |
| **Nebula Cloud (ours)** | **Fuzzy + Semantic** | **✅ Gemini** | **✅ Auto** | **✅ Hash** |

---

## 📐 Comparison 1: Search Accuracy

**Goal:** Show that AI semantic search finds more relevant results than keyword search.

### How to Measure
1. Upload **50 documents** of different types (PDFs, Word docs, text files).
2. Write **20 test queries** (some exact keyword matches, some conceptual ones e.g. "documents about travel").
3. For each query, count how many of the returned results are actually relevant (manually check).
4. Calculate:

```
Precision = Relevant Results Returned / Total Results Returned
Recall    = Relevant Results Returned / Total Relevant Docs in DB
F1 Score  = 2 × (Precision × Recall) / (Precision + Recall)
```

### Expected Results

| Method | Precision | Recall | F1 Score |
|---|---|---|---|
| Traditional SQL LIKE | ~60% | ~55% | ~57% |
| Fuzzy Search (pg_trgm) | ~75% | ~70% | ~72% |
| **Semantic Search (ours)** | **~92%** | **~89%** | **~90%** |

**Graph to make:** Grouped bar chart with 3 groups (Precision, Recall, F1) and 3 bars each.

---

## 📐 Comparison 2: Search Speed vs. Scale

**Goal:** Show that our HNSW vector index scales much better than a linear scan.

### How to Measure
1. Insert documents in batches: 100, 1,000, 10,000, 100,000 rows.
2. Run the same search query 10 times at each scale and record average response time.
3. Do this for: (a) SQL LIKE (linear scan), (b) Fuzzy (pg_trgm), (c) Semantic (HNSW).

### Expected Results (milliseconds)

| # Documents | SQL LIKE | Fuzzy (pg_trgm) | Semantic (HNSW) |
|---|---|---|---|
| 100 | 5ms | 3ms | 12ms |
| 1,000 | 45ms | 6ms | 14ms |
| 10,000 | 420ms | 9ms | 18ms |
| 100,000 | 4,100ms | 12ms | 22ms |

**Graph to make:** Line chart — X-axis = Number of documents, Y-axis = Time (ms). 3 lines for each method.

> Key insight: SQL LIKE grows linearly (O(n)), HNSW grows logarithmically (O(log n)).

---

## 📐 Comparison 3: PII/Sensitive Document Detection

**Goal:** Show that Gemini AI detects ID proofs more accurately than rule-based regex.

### How to Measure
1. Prepare a test set of **30 files**: 15 are real ID proofs (passport, PAN card, etc.), 15 are normal documents.
2. Run each file through 3 methods:
   - **Regex** — pattern match for keywords like "passport", "date of birth", "ID number"
   - **Basic ML Classifier** — a pre-trained text classifier
   - **Gemini AI (ours)** — our system's detection
3. Compare the results with ground truth.

```
True Positive Rate  = Correctly flagged IDs / Total real IDs
False Positive Rate = Normal docs flagged as IDs / Total normal docs
```

### Expected Results

| Method | True Positive Rate | False Positive Rate | Avg. Time/Doc |
|---|---|---|---|
| Regex Pattern Match | 48% | 22% | <1ms |
| Basic ML Classifier | 71% | 14% | ~50ms |
| **Gemini AI (ours)** | **94%** | **4%** | ~800ms |

**Graph to make:** Grouped bar chart — True Positive Rate vs False Positive Rate for each method.

---

## 📐 Comparison 4: Duplicate Detection Accuracy

**Goal:** Show that SHA-256 hashing is near-perfect for exact duplicates.

### How to Measure
1. Upload 20 pairs of files: exact duplicates, renamed duplicates, slightly modified copies.
2. Test each detection method and check if it correctly blocks the duplicate.

### Expected Results

| Method | Exact Duplicate Detected | Renamed Duplicate | Near-Duplicate | Time |
|---|---|---|---|---|
| Filename + Size | 60% | 0% | 0% | 1ms |
| **SHA-256 Hash (ours)** | **100%** | **100%** | 0% | 2ms |
| MinHash + LSH | 80% | 80% | **85%** | 15ms |

**Graph to make:** Grouped bar chart comparing detection rates across methods.

---

## 📐 Comparison 5: Upload Processing Time Breakdown

**Goal:** Show where time is spent in our AI pipeline and identify bottlenecks.

### How to Measure
Add timestamps in `server/index.js` around each stage:
```js
const t0 = Date.now();
// ... upload to Supabase Storage ...
console.log(`Upload time: ${Date.now() - t0}ms`);
```

Repeat for Gemini analysis, embedding generation, and DB write.

### Expected Results (average over 20 uploads)

| Stage | Avg. Time |
|---|---|
| File Upload to Supabase Storage | ~300ms |
| Text Extraction (pdf-parse) | ~100ms |
| Gemini AI Analysis | ~800ms |
| Embedding Generation | ~400ms |
| Database Write | ~50ms |
| **Total** | **~1,650ms** |

**Graph to make:** Stacked bar chart or pie chart showing proportion of time per stage.

---

## 📐 Comparison 6: Auto-Tagging Quality

**Goal:** Show that Gemini-generated tags match what a human would assign.

### How to Measure
1. Upload 30 documents.
2. Have a human manually assign tags to each document.
3. Compare with Gemini's tags using **Jaccard Similarity**:

```
Jaccard(A, B) = |A ∩ B| / |A ∪ B|
```

A score of 1.0 = perfect match, 0.0 = no overlap.

**Graph to make:** Histogram showing distribution of Jaccard scores across 30 documents. Aim for average > 0.7.

---

## 🛠️ Tools to Make the Graphs

| Tool | Recommended For |
|---|---|
| **Google Sheets / Excel** | Bar charts, line charts — easiest to use |
| **Python (matplotlib/seaborn)** | High-quality publication figures |
| **Canva** | Visually polished diagrams |
| **Tableau Public** | Interactive dashboards (free) |

---

## 📝 Paper Structure Suggestion

```
1. Abstract
2. Introduction          — Why current cloud storage is limited
3. Literature Review     — HNSW, pgvector, LLMs for document understanding
4. System Architecture   — Our pipeline diagram
5. Algorithms Used       — HNSW, Cosine Similarity, SHA-256, pg_trgm
6. Experimental Setup    — Dataset, tools, Supabase setup
7. Results & Comparisons — All 6 graphs above
8. Discussion            — Tradeoffs: Gemini latency vs. accuracy
9. Conclusion            — Future: auth, mobile app, MinHash near-duplicates
```

---

## 🔗 Project Repository

GitHub: [https://github.com/Devesh-x/major-proj](https://github.com/Devesh-x/major-proj)
