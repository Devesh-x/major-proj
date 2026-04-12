import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Cloud, LayoutGrid, List, Search, Upload, Bell,
    FileText, Image as ImageIcon, File, ShieldAlert, Trash2, Download,
    Brain, FolderOpen, Clock, SearchCode, Settings, LogOut,
    MessageSquare, Send, X, Loader2, Plus, Sparkles, ChevronRight,
    HardDrive, Zap, TrendingUp
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NAV = [
    { path: 'all', icon: LayoutGrid, label: 'All Files' },
    { path: 'insights', icon: Brain, label: 'AI Insights' },
    { path: 'recent', icon: Clock, label: 'Recent' },
    { path: 'search', icon: SearchCode, label: 'Smart Search' },
    { path: '/profile', icon: Settings, label: 'Settings' },
];

function FileIcon({ type, size = 18 }) {
    if (type?.startsWith('image')) return <ImageIcon size={size} />;
    if (type?.includes('pdf')) return <FileText size={size} />;
    return <File size={size} />;
}

function fmtSize(b) {
    if (!b) return '0 KB';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
}

function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const getFileUrl = (path) => {
    if (!path) return '#';
    return `https://ydeekuguretigbjjdlyz.supabase.co/storage/v1/object/public/files/${path}`;
};

function AnimatedNumber({ value, suffix = '' }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseFloat(value) || 0;
        if (end === 0) return;
        const duration = 900;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setDisplay(end); clearInterval(timer); }
            else setDisplay(start);
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    return <>{typeof value === 'string' && isNaN(value) ? value : (Number.isInteger(parseFloat(value)) ? Math.floor(display) : display.toFixed(1))}{suffix}</>;
}

function FileCard({ file: f, idx, viewMode, isSelected, isBlurred, getFileUrl, togglePrivacy, handleDelete, setSelectedFile, fmtSize, fmtDate, ff }) {
    // Defensive check
    if (!f) return null;

    if (viewMode === 'list') {
        return (
            <div key={f.id} onClick={() => window.open(getFileUrl(f.storage_path), '_blank')}
                className={`file-card-list${isSelected ? ' selected' : ''}`}
                style={{ animationDelay: `${idx * 30}ms` }}
            >
                <div style={{ width: 36, height: 36, borderRadius: 9, background: '#f4f4f5', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#52525b' }}>
                    <FileIcon type={f.type} size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.84rem', color: '#09090b', letterSpacing: '-0.015em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 1 }}>{f.title}</p>
                    <p style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 400 }}>{fmtSize(f.size)} · {fmtDate(f.created_at)}</p>
                </div>
                {f.is_pii && <ShieldAlert size={14} color="#ef4444" />}
                <div style={{ display: 'flex', gap: 2 }}>
                    <button className="icon-btn" title="Chat with AI" onClick={ev => { ev.stopPropagation(); setSelectedFile(f); }}><MessageSquare size={14} /></button>
                    <button className="icon-btn" onClick={ev => { ev.stopPropagation(); window.open(getFileUrl(f.storage_path), '_blank'); }}><Download size={14} /></button>
                    <button className="icon-btn danger" onClick={ev => { ev.stopPropagation(); handleDelete(f.id); }}><Trash2 size={14} /></button>
                </div>
            </div>
        );
    }

    return (
        <div key={f.id} onClick={() => window.open(getFileUrl(f.storage_path), '_blank')}
            className={`file-card file-appear${isSelected ? ' selected' : ''}`}
            style={{ animationDelay: `${idx * 35}ms` }}
        >
            {isBlurred && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(14px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16 }}>
                    <ShieldAlert size={22} color="#ef4444" />
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Secured</p>
                    <button onClick={ev => { ev.stopPropagation(); togglePrivacy(f.id); }}
                        style={{ padding: '6px 16px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: ff }}>
                        Unlock
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: '#f4f4f5', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b' }}>
                    <FileIcon type={f.type} size={18} />
                </div>
                <div style={{ display: 'flex', gap: 1 }}>
                    <button className="icon-btn" title="Chat with AI" onClick={ev => { ev.stopPropagation(); setSelectedFile(f); }}><MessageSquare size={13} /></button>
                    <button className="icon-btn" onClick={ev => { ev.stopPropagation(); window.open(getFileUrl(f.storage_path), '_blank'); }}><Download size={13} /></button>
                    <button className="icon-btn danger" onClick={ev => { ev.stopPropagation(); handleDelete(f.id); }}><Trash2 size={13} /></button>
                </div>
            </div>

            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#09090b', marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.025em' }}>{f.title}</h4>
            <p style={{ fontSize: '0.78rem', color: '#71717a', lineHeight: 1.55, height: 38, overflow: 'hidden', marginBottom: 14, fontWeight: 400 }}>{f.summary}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 12 }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {f.tags?.slice(0, 2).map(t => (
                        <span key={t} style={{ fontSize: '0.58rem', padding: '3px 8px', background: '#f4f4f5', borderRadius: 5, color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid rgba(0,0,0,0.05)' }}>{t}</span>
                    ))}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#c0c0c0', fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>{fmtSize(f.size)}</span>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const [files, setFiles] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [query, setQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedFile, setSelectedFile] = useState(null);
    const [chatQuery, setChatQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [privacyUnlocked, setPrivacyUnlocked] = useState({});
    const [alert, setAlert] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [summarizingFolder, setSummarizingFolder] = useState(false);
    const [folderSummary, setFolderSummary] = useState(null);
    const [stats, setStats] = useState({ totalFiles: 0, storageUsed: '0' });
    const [activeTab, setActiveTab] = useState('all'); // all, insights, recent, search
    const [smartQuery, setSmartQuery] = useState('');
    const [smartResults, setSmartResults] = useState([]);
    const [smartLoading, setSmartLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        setTimeout(() => setMounted(true), 60);
        fetchFiles();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, chatLoading]);

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch(`${API_URL}/api/search?query=&mode=fuzzy`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const fileList = Array.isArray(data) ? data : (data.results || []);
            setFiles(fileList);
            setStats({
                totalFiles: fileList.length,
                storageUsed: (fileList.reduce((acc, f) => acc + (f.size || 0), 0) / 1048576).toFixed(1)
            });
            const cats = ['All', ...new Set(fileList.map(f => f.category).filter(Boolean))];
            setCategories(cats);
        } catch (err) { console.error('Fetch failed', err); }
    };

    const handleSummarizeFolder = async () => {
        if (activeCategory === 'All') return;
        setSummarizingFolder(true);
        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch(`${API_URL}/api/summarize-category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ category: activeCategory })
            });
            const data = await res.json();
            setFolderSummary(data.folderSummary);
        } catch (err) { console.error('Summary failed', err); }
        finally { setSummarizingFolder(false); }
    };

    const handleUpload = async e => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.status === 409) {
                const data = await res.json();
                setAlert({ type: 'error', message: data.message || 'Duplicate detected' });
                setUploading(false);
                return;
            }
            const data = await res.json();
            setAlert({ 
                type: 'success', 
                name: file.name, 
                metrics: data.metrics,
                secured: data.metadata?.isPII || data.file?.is_pii 
            });
            fetchFiles();
        } catch (err) { console.error('Upload failed', err); }
        finally { setUploading(false); }
    };

    const togglePrivacy = fileId => {
        const pin = prompt('Enter Security Pin (Demo: 1234):');
        if (pin === '1234') setPrivacyUnlocked(prev => ({ ...prev, [fileId]: true }));
        else if (pin !== null) window.alert('Verification failed.');
    };

    const handleDelete = async fileId => {
        if (!confirm('Delete this file?')) return;
        try {
            const token = localStorage.getItem('sb-token');
            await fetch(`${API_URL}/api/delete-file/${fileId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchFiles();
            setSelectedFile(null);
        } catch (err) { console.error('Delete failed', err); }
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
            const res = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ fileId: selectedFile.id, query: newMsg.content })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Server error');
            setChatHistory(p => [...p, { role: 'ai', content: data.answer || "I'm currently in lightweight offline mode, but I can't find the answer in this file." }]);
        } catch (err) {
            console.error('Chat error:', err);
            setChatHistory(p => [...p, { role: 'ai', content: err.message || "The AI connection is currently interrupted or rate-limited. Please try again later." }]);
        } finally { setChatLoading(false); }
    };

    const handleSmartSearch = async (e) => {
        if (e) e.preventDefault();
        if (!smartQuery.trim()) return;
        setSmartLoading(true);
        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch(`${API_URL}/api/search?query=${encodeURIComponent(smartQuery)}&mode=semantic`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setSmartResults(data.results || []);
        } catch (err) { console.error('Smart search failed', err); }
        finally { setSmartLoading(false); }
    };

    const filteredFiles = files.filter(f =>
        (activeCategory === 'All' || f.category === activeCategory) &&
        (query === '' || f.title?.toLowerCase().includes(query.toLowerCase()) || f.summary?.toLowerCase().includes(query.toLowerCase()))
    );

    const ff = "'DM Sans', sans-serif";

    return (
        <div className={mounted ? 'mounted' : ''} style={{
            display: 'flex', height: '100vh',
            background: '#f5f5f5',
            fontFamily: ff,
            overflow: 'hidden',
            position: 'relative',
        }}>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                :root {
                    --black: #0a0a0a;
                    --off-black: #111111;
                    --surface: #161616;
                    --border: rgba(255,255,255,0.07);
                    --border-light: rgba(0,0,0,0.07);
                    --text-primary: #f0f0f0;
                    --text-muted: rgba(255,255,255,0.38);
                    --text-subtle: rgba(255,255,255,0.22);
                    --accent: #f0f0f0;
                    --white: #ffffff;
                }

                .mount-fade {
                    opacity: 0;
                    transform: translateY(12px);
                    transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1);
                }
                .mounted .mount-fade { opacity: 1; transform: translateY(0); }
                .delay-1 { transition-delay: 0.05s !important; }
                .delay-2 { transition-delay: 0.12s !important; }
                .delay-3 { transition-delay: 0.19s !important; }
                .delay-4 { transition-delay: 0.26s !important; }

                .nav-link {
                    display: flex; align-items: center; gap: 10px;
                    padding: 9px 12px; border-radius: 8px;
                    font-size: 0.82rem; font-weight: 500;
                    text-decoration: none; color: var(--text-muted);
                    transition: color 0.15s, background 0.15s;
                    letter-spacing: -0.01em;
                    border: none; background: transparent; width: 100%; cursor: pointer; text-align: left;
                }
                .nav-link-item { text-decoration: none; display: block; width: 100%; }
                .nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
                .nav-link.active { color: var(--white); background: rgba(255,255,255,0.1); font-weight: 600; }

                .cat-btn {
                    display: flex; align-items: center; gap: 9px;
                    padding: 8px 12px; border-radius: 8px;
                    font-size: 0.82rem; font-weight: 500;
                    border: none; cursor: pointer; width: 100%;
                    text-align: left; letter-spacing: -0.01em;
                    color: var(--text-muted);
                    background: transparent;
                    transition: color 0.15s, background 0.15s;
                }
                .cat-btn:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
                .cat-btn.active { color: var(--white); background: rgba(255,255,255,0.1); font-weight: 600; }

                .stat-card {
                    background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px 24px;
                    display: flex; align-items: center; gap: 18px; transition: border-color 0.2s, transform 0.2s; cursor: default;
                }
                .stat-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-2px); }

                .file-card {
                    background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 16px; padding: 20px;
                    cursor: pointer; transition: all 0.22s cubic-bezier(0.22,1,0.36,1); position: relative; overflow: hidden;
                }
                .file-card:hover { box-shadow: 0 8px 28px -6px rgba(0,0,0,0.12); border-color: rgba(0,0,0,0.12); transform: translateY(-2px); }
                .file-card.selected { border-color: #0a0a0a; box-shadow: 0 0 0 2px #0a0a0a; }

                .file-card-list {
                    display: flex; align-items: center; gap: 14px; padding: 13px 18px; border-radius: 12px;
                    border: 1px solid rgba(0,0,0,0.07); background: #fff; cursor: pointer; transition: all 0.15s;
                }
                .file-card-list:hover { border-color: rgba(0,0,0,0.14); background: #fafafa; }
                .file-card-list.selected { border-color: #0a0a0a; }

                .icon-btn {
                    background: none; border: none; padding: 6px; border-radius: 7px;
                    cursor: pointer; display: flex; align-items: center; justify-content: center; color: #a1a1aa; transition: all 0.15s;
                }
                .icon-btn:hover { color: #09090b; background: #f4f4f5; }
                .icon-btn.danger:hover { color: #ef4444; background: rgba(239,68,68,0.08); }

                .upload-btn {
                    display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px;
                    background: #0a0a0a; color: #fff; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: none;
                    letter-spacing: -0.01em; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
                }
                .upload-btn:hover { background: #1a1a1a; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.2); }

                .search-input {
                    width: 100%; padding: 9px 14px 9px 40px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08);
                    background: #f8f8f8; color: #09090b; font-size: 0.85rem; font-family: 'DM Sans', sans-serif;
                    letter-spacing: -0.01em; outline: none; transition: all 0.15s;
                }
                .search-input:focus { border-color: rgba(0,0,0,0.2); background: #fff; }

                .chat-bubble-user { align-self: flex-end; background: #0a0a0a; color: #fff; padding: 10px 14px; border-radius: 14px 14px 3px 14px; font-size: 0.84rem; line-height: 1.55; max-width: 85%; }
                .chat-bubble-ai { align-self: flex-start; background: #f4f4f5; color: #09090b; padding: 10px 14px; border-radius: 14px 14px 14px 3px; font-size: 0.84rem; line-height: 1.6; max-width: 85%; }

                .dot-bounce { animation: dot-bounce 1.2s infinite ease-in-out; }
                @keyframes dot-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-5px); opacity: 1; } }
                @keyframes spin { to { transform: rotate(360deg); } }
                .spin { animation: spin 0.8s linear infinite; }
                .alert-anim { animation: alert-slide 0.3s ease forwards; }
                @keyframes alert-slide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
                .file-appear { opacity: 0; transform: translateY(14px); animation: file-appear 0.38s cubic-bezier(0.22,1,0.36,1) forwards; }
                @keyframes file-appear { to { opacity: 1; transform: translateY(0); } }
                @keyframes drawer-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>

            {/* ═══════════════ SIDEBAR ═══════════════ */}
            <aside style={{
                width: 248, flexShrink: 0,
                background: 'var(--black)',
                display: 'flex', flexDirection: 'column',
                borderRight: '1px solid var(--border)',
                position: 'relative', zIndex: 10,
            }}>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")` }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="mount-fade" style={{ padding: '26px 18px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Cloud size={17} color="#0a0a0a" />
                        </div>
                        <div>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.04em', display: 'block', lineHeight: 1.1 }}>CloudSense</span>
                            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>Storage</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
                        <p className="mount-fade delay-1" style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '4px 8px 8px', paddingTop: 4 }}>Folders</p>
                        <div className="mount-fade delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 20 }}>
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setActiveCategory(cat)} className={`cat-btn${activeCategory === cat ? ' active' : ''}`}>
                                    <FolderOpen size={14} style={{ opacity: 0.7 }} /> {cat}
                                    {activeCategory === cat && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                                </button>
                            ))}
                        </div>

                        <p className="mount-fade delay-2" style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 8px 8px' }}>Navigate</p>
                        <div className="mount-fade delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {NAV.map(({ path, icon: Icon, label }) => (
                                path.startsWith('/') ? (
                                    <Link key={label} to={path} className={`nav-link${location.pathname === path ? ' active' : ''}`}>
                                        <Icon size={14} style={{ opacity: 0.8 }} /> {label}
                                    </Link>
                                ) : (
                                    <button key={label} onClick={() => setActiveTab(path)} className={`nav-link${activeTab === path ? ' active' : ''}`}>
                                        <Icon size={14} style={{ opacity: 0.8 }} /> {label}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    <div className="mount-fade delay-4" style={{ padding: '14px 14px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>D</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Devesh</p>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>devesh@email.com</p>
                        </div>
                        <button onClick={() => { localStorage.removeItem('sb-token'); navigate('/'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }} title="Log out">
                            <LogOut size={15} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ═══════════════ MAIN ═══════════════ */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f7f7f7', minWidth: 0 }}>
                <header className="mount-fade" style={{ height: 62, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
                    <div style={{ position: 'relative', width: 320 }}>
                        <Search size={14} color="#c0c0c0" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                        <input className="search-input" type="text" placeholder="Fuzzy search..." value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button className="icon-btn"><Bell size={15} /></button>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>D</div>
                    </div>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                    <div className="mount-fade delay-1" style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.045em' }}>Workspace</h1>
                            <p style={{ color: '#a1a1aa', fontSize: '0.83rem' }}>Intelligently organize your files</p>
                        </div>
                        <label className="upload-btn">
                            {uploading ? <Loader2 size={15} className="spin" /> : <Plus size={15} />} Upload File
                            <input type="file" style={{ display: 'none' }} disabled={uploading} onChange={handleUpload} />
                        </label>
                    </div>

                    <div className="mount-fade delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
                        {[
                            { label: 'Total Files', value: stats.totalFiles, icon: FileText, suffix: '' },
                            { label: 'Storage Used', value: stats.storageUsed, icon: HardDrive, suffix: ' MB' },
                            { label: 'AI Insights', value: 12, icon: Zap, suffix: ' ready' },
                        ].map((s) => (
                            <div key={s.label} className="stat-card">
                                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={18} color="rgba(255,255,255,0.7)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</p>
                                    <p style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                        <AnimatedNumber value={s.value} suffix={s.suffix} />
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {activeTab === 'all' && (
                        <>
                            <div className="mount-fade delay-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{activeCategory}</h2>
                                    <span style={{ fontSize: '0.72rem', color: '#c0c0c0', background: '#f4f4f5', padding: '2px 8px', borderRadius: 6 }}>{filteredFiles.length}</span>
                                    {activeCategory !== 'All' && (
                                        <button onClick={handleSummarizeFolder} disabled={summarizingFolder} className="upload-btn" style={{ fontSize: '0.7rem', padding: '4px 11px' }}>
                                            <Sparkles size={10} /> {summarizingFolder ? 'Thinking...' : 'Summarize'}
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 2, background: 'rgba(0,0,0,0.05)', borderRadius: 9, padding: 3 }}>
                                    {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                                        <button key={v} onClick={() => setViewMode(v)} style={{ padding: '5px 10px', borderRadius: 7, border: 'none', background: viewMode === v ? '#fff' : 'transparent', color: viewMode === v ? '#09090b' : '#a1a1aa' }}><Icon size={14} /></button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(240px, 1fr))' : '1fr', gap: 14 }}>
                                {filteredFiles.map((f, idx) => (
                                    <FileCard key={f.id} file={f} idx={idx} viewMode={viewMode} isSelected={selectedFile?.id === f.id} isBlurred={f.is_pii && !privacyUnlocked[f.id]} getFileUrl={getFileUrl} togglePrivacy={togglePrivacy} handleDelete={handleDelete} setSelectedFile={setSelectedFile} fmtSize={fmtSize} fmtDate={fmtDate} ff={ff} />
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'insights' && (
                        <div className="mount-fade">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24, letterSpacing: '-0.03em' }}>Intelligence Center</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                                
                                {/* 🛡️ SECURITY AUDIT CARD */}
                                <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                            <ShieldAlert size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Security Audit</h3>
                                            <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Automated PII Screening</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 12 }}>
                                        <span style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{files.filter(f => f.is_pii).length}</span>
                                        <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600, paddingBottom: 6 }}>Sensitive Files</span>
                                    </div>
                                    <div style={{ height: 6, background: '#f4f4f5', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
                                        <div style={{ height: '100%', background: '#ef4444', width: `${(files.filter(f => f.is_pii).length / Math.max(files.length, 1)) * 100}%` }} />
                                    </div>
                                    <p style={{ fontSize: '0.78rem', color: '#71717a', lineHeight: 1.5 }}>
                                        {files.filter(f => f.is_pii).length > 0 
                                            ? `We detected sensitive information in ${Math.round((files.filter(f => f.is_pii).length / files.length) * 100)}% of your library. These files are automatically blurred for your protection.`
                                            : "No sensitive information detected. Your workspace is currently compliant with basic privacy standards."}
                                    </p>
                                </div>

                                {/* 🧠 WORKSPACE PULSE */}
                                <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                            <Brain size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Workspace Pulse</h3>
                                            <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Semantic Composition</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {categories.filter(c => c !== 'All').slice(0, 3).map(cat => {
                                            const count = files.filter(f => f.category === cat).length;
                                            return (
                                                <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: '0.82rem', color: '#52525b', fontWeight: 500 }}>{cat}</span>
                                                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{count} file{count !== 1 ? 's' : ''}</span>
                                                </div>
                                            );
                                        })}
                                        {categories.length <= 1 && <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Upload more files to see distribution...</p>}
                                    </div>
                                </div>

                                {/* ⚡ MODEL HEALTH */}
                                <div style={{ background: '#0a0a0a', padding: 24, borderRadius: 20, color: '#fff' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Neural Gateway</h3>
                                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Hugging Face Inference</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active & Primed</span>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Mono', monospace", padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        MODE: BGE-Small-v1.5<br/>
                                        DIM: 384 (Semantic)<br/>
                                        STATUS: Ready for Smart Search
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {activeTab === 'recent' && (
                        <div className="mount-fade">
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recently Accessed</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                                {files.slice(0, 8).map((f, idx) => (
                                    <FileCard key={f.id} file={f} idx={idx} viewMode="grid" isSelected={selectedFile?.id === f.id} isBlurred={f.is_pii && !privacyUnlocked[f.id]} getFileUrl={getFileUrl} togglePrivacy={togglePrivacy} handleDelete={handleDelete} setSelectedFile={setSelectedFile} fmtSize={fmtSize} fmtDate={fmtDate} ff={ff} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="mount-fade">
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Smart Search</h2>
                            <form onSubmit={handleSmartSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                                <input className="search-input" placeholder="Ask conceptually..." value={smartQuery} onChange={e => setSmartQuery(e.target.value)} />
                                <button type="submit" className="upload-btn">{smartLoading ? <Loader2 size={16} className="spin" /> : <Search size={16} />} Search</button>
                            </form>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                                {smartResults.map((f, idx) => (
                                    <div key={f.id} style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 20, background: '#10b981', color: '#fff', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4 }}>{Math.round(f.similarity * 100)}% Match</div>
                                        <FileCard file={f} idx={idx} viewMode="grid" isSelected={selectedFile?.id === f.id} isBlurred={f.is_pii && !privacyUnlocked[f.id]} getFileUrl={getFileUrl} togglePrivacy={togglePrivacy} handleDelete={handleDelete} setSelectedFile={setSelectedFile} fmtSize={fmtSize} fmtDate={fmtDate} ff={ff} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {selectedFile && (
                <aside style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#fff', borderLeft: '1px solid rgba(0,0,0,0.07)', animation: 'drawer-in 0.28s' }}>
                    <div style={{ padding: '18px 18px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
                        <div>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>AI Assistant</h3>
                            <p style={{ fontSize: '0.68rem', color: '#a1a1aa' }}>{selectedFile.title}</p>
                        </div>
                        <button className="icon-btn" onClick={() => setSelectedFile(null)}><X size={16} /></button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ background: '#f7f7f7', borderRadius: 12, padding: '12px 14px' }}>
                            <p style={{ fontSize: '0.8rem' }}>{selectedFile.summary || 'No summary available.'}</p>
                        </div>
                        {chatHistory.map((m, i) => <div key={i} className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>{m.content}</div>)}
                        {chatLoading && <div className="dot-bounce">AI is typing...</div>}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleChat} style={{ padding: '14px 16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        <div style={{ position: 'relative' }}>
                            <input value={chatQuery} onChange={e => setChatQuery(e.target.value)} placeholder="Ask about this document..." className="search-input" />
                            <button type="submit" disabled={chatLoading} className="icon-btn" style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)' }}><Send size={15} /></button>
                        </div>
                    </form>
                </aside>
            )}

            {alert && (
                <div className="alert-anim" style={{
                    position: 'fixed', top: 24, right: 24, zIndex: 1000,
                    background: alert.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${alert.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 0, 0, 0.08)'}`,
                    padding: '16px 20px', borderRadius: 14,
                    boxShadow: '0 12px 32px -8px rgba(0,0,0,0.15)',
                    display: 'flex', alignItems: 'center', gap: 14,
                    minWidth: 320, maxWidth: 420,
                    color: alert.type === 'error' ? '#fff' : '#09090b',
                    fontFamily: ff
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: alert.type === 'error' ? 'rgba(255,255,255,0.2)' : (alert.secured ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: alert.type === 'error' ? '#fff' : (alert.secured ? '#ef4444' : '#10b981')
                    }}>
                        {alert.type === 'error' ? <ShieldAlert size={18} /> : (alert.secured ? <ShieldAlert size={18} /> : <Cloud size={18} />)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 2, letterSpacing: '-0.01em' }}>
                            {alert.type === 'error' ? 'Upload Failed' : (alert.secured ? 'Secured & Uploaded' : 'Upload Successful')}
                        </p>
                        <p style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 500, lineHeight: 1.4 }}>
                            {alert.message || (alert.secured ? `"${alert.name}" was secured due to sensitive info.` : `"${alert.name}" is now available in your workspace.`)}
                        </p>
                    </div>
                    <button onClick={() => setAlert(null)} style={{ background: 'none', border: 'none', color: 'inherit', opacity: 0.5, cursor: 'pointer', padding: 4 }}>
                        <X size={16} />
                    </button>
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, height: 3,
                        background: alert.type === 'error' ? 'rgba(255,255,255,0.3)' : (alert.secured ? '#ef4444' : '#10b981'),
                        width: '100%', borderRadius: '0 0 14px 14px',
                        animation: 'progress 4s linear forwards'
                    }} />
                    <style>{`
                        @keyframes progress { from { width: 100%; } to { width: 0%; } }
                    `}</style>
                </div>
            )}
        </div>
    );
}