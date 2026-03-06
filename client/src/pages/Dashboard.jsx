import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Cloud, LayoutGrid, List, Search, Upload, Bell,
    FileText, Image as ImageIcon, File, ShieldAlert, Trash2, Download,
    Brain, FolderOpen, Clock, SearchCode, Settings, LogOut,
    MessageSquare, Eye, EyeOff, Send, X, ChevronRight, Bookmark
} from 'lucide-react';

const NAV = [
    { path: '/dashboard', icon: LayoutGrid, label: 'All Files' },
    { path: '#insights', icon: Brain, label: 'AI Insights' },
    { path: '#recent', icon: Clock, label: 'Recent' },
    { path: '#search', icon: SearchCode, label: 'Smart Search' },
    { path: '/profile', icon: Settings, label: 'Settings' },
];

function FileIcon({ type }) {
    if (type?.startsWith('image')) return <ImageIcon size={22} color="#a78bfa" />;
    if (type?.includes('pdf')) return <FileText size={22} color="#f87171" />;
    return <File size={22} color="#94a3b8" />;
}

function fmtSize(b) {
    if (!b) return '0 KB';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
}

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    // Core State
    const [files, setFiles] = useState([]); // Will fetch from DB
    const [categories, setCategories] = useState(['All']);
    const [activeCategory, setActiveCategory] = useState('All');

    // Search & View State
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState('fuzzy');
    const [viewMode, setViewMode] = useState('grid');
    const [searchPerf, setSearchPerf] = useState(null); // Comparison 1 & 2

    // AI Standout Features State
    const [selectedFile, setSelectedFile] = useState(null); // For "Talk to Your File"
    const [chatQuery, setChatQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [privacyUnlocked, setPrivacyUnlocked] = useState({}); // Track which PII files are manually unblurred

    // Upload/Alert State
    const [alert, setAlert] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [summarizingFolder, setSummarizingFolder] = useState(false);
    const [folderSummary, setFolderSummary] = useState(null);

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch('http://localhost:5000/api/search?query=&mode=fuzzy', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const fileList = Array.isArray(data) ? data : (data.results || []);
            setFiles(fileList);

            // Dynamically build categories from files
            const cats = ['All', ...new Set(fileList.map(f => f.category).filter(Boolean))];
            setCategories(cats);
        } catch (err) { console.error("Fetch failed", err); }
    };

    const handleSummarizeFolder = async () => {
        if (activeCategory === 'All') return;
        setSummarizingFolder(true);
        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch('http://localhost:5000/api/summarize-category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ category: activeCategory })
            });
            const data = await res.json();
            setFolderSummary(data.folderSummary);
        } catch (err) { console.error("Summary failed", err); }
        finally { setSummarizingFolder(false); }
    };

    React.useEffect(() => { fetchFiles(); }, []);

    const handleSearch = async e => {
        e.preventDefault();
        if (!query.trim()) { fetchFiles(); setSearchPerf(null); return; }

        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch(`http://localhost:5000/api/search?query=${query}&mode=${mode}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setFiles(data.results);
            setSearchPerf(data.performance);
        } catch (err) { console.error("Search failed", err); }
    };

    const handleUpload = async e => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.status === 409) {
                const data = await res.json();
                setAlert({ type: 'error', message: data.message || "Duplicate detected" });
                setUploading(false);
                return;
            }

            const data = await res.json();
            setAlert({ type: 'success', name: file.name, metrics: data.metrics });
            fetchFiles();
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const togglePrivacy = (fileId) => {
        const pin = prompt("Enter Security Pin to Unlock (Demo: 1234):");
        if (pin === '1234') setPrivacyUnlocked(prev => ({ ...prev, [fileId]: true }));
        else if (pin !== null) alert("Identity Verification Failed.");
    };

    const handleUpdateTags = async (fileId, newTags) => {
        try {
            const token = localStorage.getItem('sb-token');
            await fetch('http://localhost:5000/api/update-tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ fileId, tags: newTags })
            });
            fetchFiles();
        } catch (err) { console.error("Update tags failed", err); }
    };

    const handleChat = async e => {
        e.preventDefault();
        if (!chatQuery.trim() || !selectedFile) return;

        const newMsg = { role: 'user', content: chatQuery };
        setChatHistory(p => [...p, newMsg]);
        setChatQuery('');
        setChatLoading(true);

        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ fileId: selectedFile.id, query: chatQuery })
            });
            const data = await res.json();
            setChatHistory(p => [...p, { role: 'ai', content: data.answer }]);
        } catch (err) {
            setChatHistory(p => [...p, { role: 'ai', content: "Sorry, I couldn't analyze that right now." }]);
        } finally {
            setChatLoading(false);
        }
    };


    const filteredFiles = files.filter(f => activeCategory === 'All' || f.category === activeCategory);

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#050b18', fontFamily: 'Inter, sans-serif', color: '#f1f5f9', overflow: 'hidden' }}>

            {/* ── Sidebar ── */}
            <aside style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.025)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Logo */}
                <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Cloud size={16} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Nebula</span>
                </div>

                {/* AI Smart Folders (Categories) */}
                <div style={{ padding: '20px 10px 10px' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px', marginBottom: 12 }}>Smart Folders</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, fontSize: '0.82rem', border: 'none', cursor: 'pointer',
                                    background: activeCategory === cat ? 'rgba(59,130,246,0.1)' : 'transparent',
                                    color: activeCategory === cat ? '#60a5fa' : '#64748b',
                                    transition: '0.2s'
                                }}>
                                <FolderOpen size={15} opacity={activeCategory === cat ? 1 : 0.5} />
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px', margin: '10px 0 12px' }}>Library</p>
                    {NAV.map(({ path, icon: Icon, label }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link key={label} to={path}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '9px 12px', borderRadius: 10,
                                    fontSize: '0.855rem', fontWeight: 500,
                                    textDecoration: 'none',
                                    color: isActive ? '#fff' : '#64748b',
                                    background: isActive ? '#2563eb' : 'transparent',
                                    boxShadow: isActive ? '0 2px 12px rgba(37,99,235,0.35)' : 'none',
                                    transition: 'all 0.15s',
                                }}>
                                <Icon size={17} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>D</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Devesh</p>
                        <p style={{ fontSize: '0.72rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>devesh@email.com</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('sb-token'); navigate('/'); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                        <LogOut size={15} />
                    </button>
                </div>
            </aside>

            {/* ── Main area ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Header */}
                <header style={{ height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 500 }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={16} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input value={query} onChange={e => setQuery(e.target.value)}
                                placeholder={mode === 'semantic' ? 'Search by meaning…' : 'Search files…'}
                                style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 10 }} />
                        </div>
                        <button type="button" onClick={() => setMode(m => m === 'fuzzy' ? 'semantic' : 'fuzzy')}
                            style={{ height: 36, padding: '0 12px', borderRadius: 8, border: `1px solid ${mode === 'semantic' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}`, background: mode === 'semantic' ? 'rgba(59,130,246,0.12)' : 'transparent', color: mode === 'semantic' ? '#60a5fa' : '#64748b', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                            {mode === 'semantic' ? 'SIMILARITY' : 'KEYWORD'}
                        </button>
                        <button type="submit" className="btn-primary" style={{ height: 36, padding: '0 16px', borderRadius: 8, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>Search</button>
                    </form>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', position: 'relative', display: 'flex' }}>
                            <Bell size={18} />
                            <span style={{ position: 'absolute', top: 0, right: 0, width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                        </button>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 16px', borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                            {uploading
                                ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />AI Processing…</>
                                : <><Upload size={15} />Upload</>}
                            <input type="file" style={{ display: 'none' }} disabled={uploading} />
                        </label>
                    </div>
                </header>

                {/* Page body */}
                <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

                    {/* Dashboard Summary Chips */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={20} color="#3b82f6" />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Files</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{files.length}</p>
                            </div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Brain size={20} color="#8b5cf6" />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>AI Insights</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>12 Tags</p>
                            </div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldAlert size={20} color="#ef4444" />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700 }}>PII Detected</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{files.filter(f => f.is_pii).length}</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Processing Alert */}
                    {alert && (
                        <div style={{
                            marginBottom: 28,
                            background: alert.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(37,99,235,0.08)',
                            border: `1px solid ${alert.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(37,99,235,0.15)'}`,
                            borderRadius: 16, padding: '16px 20px', position: 'relative'
                        }}>
                            <button onClick={() => setAlert(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={16} /></button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: alert.metrics ? 12 : 0 }}>
                                {alert.type === 'error' ? <ShieldAlert size={18} color="#ef4444" /> : <Brain size={18} color="#60a5fa" />}
                                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                                    {alert.type === 'error' ? alert.message : `AI Processing Complete for "${alert.name}"`}
                                </h3>
                            </div>
                            {alert.metrics && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                                    {[['Hashing', 'hash'], ['Analysis', 'analysis'], ['Vectors', 'embedding'], ['Storage', 'storage']].map(([label, key]) => (
                                        <div key={key} style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <p style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{label}</p>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#60a5fa' }}>{alert.metrics.stages[key]}ms</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activeCategory} Files</h1>
                            {activeCategory !== 'All' && (
                                <button onClick={handleSummarizeFolder} disabled={summarizingFolder}
                                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>
                                    {summarizingFolder ? <><span style={{ width: 10, height: 10, border: '2px solid rgba(96,165,250,0.3)', borderTopColor: '#60a5fa', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Generating…</> : <><Brain size={12} /> Summarize Folder</>}
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3 }}>
                            {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                                <button key={v} onClick={() => setViewMode(v)}
                                    style={{ padding: '6px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', background: viewMode === v ? 'rgba(255,255,255,0.1)' : 'transparent', color: viewMode === v ? '#f1f5f9' : '#64748b', display: 'flex' }}>
                                    <Icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Folder AI Summary Box */}
                    {folderSummary && (
                        <div style={{ marginBottom: 24, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 16, padding: '16px 20px', position: 'relative' }}>
                            <button onClick={() => setFolderSummary(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={16} /></button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <Brain size={16} color="#a78bfa" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Folder Intelligence Insight</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#f1f5f9', fontWeight: 500 }}>{folderSummary}</p>
                        </div>
                    )}

                    {/* Files Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                        {filteredFiles.map(f => {
                            const isBlurred = f.is_pii && !privacyUnlocked[f.id];
                            return (
                                <div key={f.id} onClick={() => setSelectedFile(f)}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${f.is_pii ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`,
                                        borderRadius: 20, padding: '20px 18px', cursor: 'pointer',
                                        transition: '0.2s', position: 'relative', overflow: 'hidden',
                                        boxShadow: selectedFile?.id === f.id ? '0 0 0 2px #3b82f6' : 'none'
                                    }}>

                                    {/* PII Shield Overlay (Blur) */}
                                    {isBlurred && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,11,24,0.4)', backdropFilter: 'blur(12px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
                                            <ShieldAlert size={28} color="#ef4444" style={{ marginBottom: 12 }} />
                                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 4 }}>Secured Document</p>
                                            <p style={{ fontSize: '0.6rem', color: '#94a3b8', marginBottom: 16 }}>Identity Verification Required</p>
                                            <button onClick={(e) => { e.stopPropagation(); togglePrivacy(f.id); }}
                                                style={{ padding: '8px 14px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>
                                                Unlock Secure View
                                            </button>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileIcon type={f.type} />
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><Download size={14} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', transition: '0.2s' }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4, height: 40, overflow: 'hidden', marginBottom: 12 }}>{f.summary}</p>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, marginTop: 'auto' }}>
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {f.tags.slice(0, 2).map(t => (
                                                <span key={t} onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newTags = prompt("Edit Tags (comma separated):", f.tags.join(', '));
                                                    if (newTags !== null) handleUpdateTags(f.id, newTags.split(',').map(s => s.trim()));
                                                }}
                                                    style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: 6, background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.1)', cursor: 'pointer' }}>#{t}</span>
                                            ))}
                                            {f.tags.length > 2 && <span style={{ fontSize: '0.62rem', color: '#475569' }}>+{f.tags.length - 2}</span>}
                                        </div>
                                        <span style={{ fontSize: '0.65rem', color: '#334155', fontWeight: 600 }}>{fmtSize(f.size)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Standout: Talk to Your File (Chat Drawer) ── */}
            {selectedFile && (
                <aside style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', background: 'rgba(13,22,38,0.8)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 100 }}>
                    <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MessageSquare size={16} color="#3b82f6" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Nebula Insight</h3>
                                <p style={{ fontSize: '0.65rem', color: '#64748b' }}>Chatting with {selectedFile.name}</p>
                            </div>
                        </div>
                        <button onClick={() => { setSelectedFile(null); setChatHistory([]); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={18} /></button>
                    </div>

                    <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 14 }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#60a5fa', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}><Brain size={12} /> AI SUMMARY</p>
                            <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>{selectedFile.summary}</p>
                        </div>

                        {chatHistory.map((m, i) => (
                            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: m.role === 'user' ? '#2563eb' : 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: 14, border: m.role === 'ai' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                                <p style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>{m.content}</p>
                            </div>
                        ))}
                        {chatLoading && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '10px 14px' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'bounce 1s infinite' }} />
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'bounce 1s infinite 0.2s' }} />
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'bounce 1s infinite 0.4s' }} />
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleChat} style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ position: 'relative' }}>
                            <input value={chatQuery} onChange={e => setChatQuery(e.target.value)}
                                placeholder="Ask about this file..."
                                style={{ padding: '12px 42px 12px 14px', borderRadius: 12, fontSize: '0.82rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <button type="submit" disabled={chatLoading} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: 8, background: '#2563eb', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Send size={14} />
                            </button>
                        </div>
                    </form>
                </aside>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
            `}</style>
        </div>
    );
}
