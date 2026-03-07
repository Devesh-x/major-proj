import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Cloud, LayoutGrid, List, Search, Upload, Bell,
    FileText, Image as ImageIcon, File, ShieldAlert, Trash2, Download,
    Brain, FolderOpen, Clock, SearchCode, Settings, LogOut,
    MessageSquare, Send, X, Loader2, Plus, Sparkles, ChevronRight
} from 'lucide-react';

const NAV = [
    { path: '/dashboard', icon: LayoutGrid, label: 'All Files' },
    { path: '#insights', icon: Brain, label: 'AI Insights' },
    { path: '#recent', icon: Clock, label: 'Recent' },
    { path: '#search', icon: SearchCode, label: 'Smart Search' },
    { path: '/profile', icon: Settings, label: 'Settings' },
];

function FileIcon({ type }) {
    if (type?.startsWith('image')) return <ImageIcon size={20} color="#09090b" />;
    if (type?.includes('pdf')) return <FileText size={20} color="#09090b" />;
    return <File size={20} color="#71717a" />;
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

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem('sb-token');
            const res = await fetch('http://localhost:5000/api/search?query=&mode=fuzzy', {
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
            const res = await fetch('http://localhost:5000/api/summarize-category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ category: activeCategory })
            });
            const data = await res.json();
            setFolderSummary(data.folderSummary);
        } catch (err) { console.error('Summary failed', err); }
        finally { setSummarizingFolder(false); }
    };

    useEffect(() => { fetchFiles(); }, []);

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
                setAlert({ type: 'error', message: data.message || 'Duplicate detected' });
                setUploading(false);
                return;
            }
            const data = await res.json();
            setAlert({ type: 'success', name: file.name, metrics: data.metrics });
            fetchFiles();
        } catch (err) { console.error('Upload failed', err); }
        finally { setUploading(false); }
    };

    const togglePrivacy = fileId => {
        const pin = prompt('Enter Security Pin to Unlock (Demo: 1234):');
        if (pin === '1234') setPrivacyUnlocked(prev => ({ ...prev, [fileId]: true }));
        else if (pin !== null) window.alert('Identity Verification Failed.');
    };

    const handleDelete = async fileId => {
        if (!confirm('Are you sure you want to delete this file?')) return;
        try {
            const token = localStorage.getItem('sb-token');
            await fetch(`http://localhost:5000/api/delete-file/${fileId}`, {
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
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ fileId: selectedFile.id, query: chatQuery })
            });
            const data = await res.json();
            setChatHistory(p => [...p, { role: 'ai', content: data.answer }]);
        } catch {
            setChatHistory(p => [...p, { role: 'ai', content: "Sorry, I couldn't analyze that right now." }]);
        } finally { setChatLoading(false); }
    };

    const filteredFiles = files.filter(f =>
        (activeCategory === 'All' || f.category === activeCategory) &&
        (query === '' || f.title?.toLowerCase().includes(query.toLowerCase()) || f.summary?.toLowerCase().includes(query.toLowerCase()))
    );

    /* ── Shared styles ── */
    const ff = "'Inter', sans-serif";
    const sidebarW = 260;

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#fff', color: '#09090b', fontFamily: ff, overflow: 'hidden' }}>

            {/* ════════════════════ SIDEBAR ════════════════════ */}
            <aside style={{
                width: sidebarW, flexShrink: 0,
                background: '#fafafa',
                borderRight: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column',
            }}>
                {/* Brand */}
                <div style={{ padding: '28px 20px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                        <Cloud size={19} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#09090b', letterSpacing: '-0.03em' }}>CloudSense</span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
                    {/* Smart Folders */}
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '8px 8px 8px', paddingTop: 8 }}>Smart Folders</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '9px 12px', borderRadius: 10, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                                    background: activeCategory === cat ? '#09090b' : 'transparent',
                                    color: activeCategory === cat ? '#fff' : '#52525b',
                                    fontWeight: activeCategory === cat ? 600 : 500,
                                    transition: '0.15s', textAlign: 'left', letterSpacing: '-0.01em', width: '100%',
                                }}
                                onMouseEnter={e => { if (activeCategory !== cat) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
                                onMouseLeave={e => { if (activeCategory !== cat) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <FolderOpen size={16} /> {cat}
                            </button>
                        ))}
                    </div>

                    {/* Library nav */}
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 8px 8px' }}>Library</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {NAV.map(({ path, icon: Icon, label }) => {
                            const isActive = location.pathname === path;
                            return (
                                <Link key={label} to={path} style={{
                                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10,
                                    fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, textDecoration: 'none',
                                    color: isActive ? '#09090b' : '#52525b',
                                    background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                                    transition: 'all 0.15s', letterSpacing: '-0.01em',
                                }}>
                                    <Icon size={16} /> {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* User row */}
                <div style={{ padding: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#09090b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>D</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#09090b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>Devesh</p>
                        <p style={{ fontSize: '0.72rem', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>devesh@email.com</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('sb-token'); navigate('/'); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', padding: 6, borderRadius: 6, transition: 'color 0.15s, background 0.15s', display: 'flex' }}
                        title="Log out"
                        onMouseEnter={e => { e.currentTarget.style.color = '#09090b'; e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* ════════════════════ MAIN ════════════════════ */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff', minWidth: 0 }}>

                {/* Top bar */}
                <header style={{ height: 68, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
                    <div style={{ position: 'relative', width: 360 }}>
                        <Search size={16} color="#a1a1aa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 14px 10px 40px',
                                borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)',
                                background: '#fafafa', color: '#09090b', fontSize: '0.875rem',
                                fontFamily: ff, letterSpacing: '-0.01em',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button style={{ width: 38, height: 38, borderRadius: 10, background: 'transparent', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#f4f4f5'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                            <Bell size={17} color="#71717a" />
                        </button>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#09090b', color: '#fff', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, letterSpacing: '-0.01em' }}>D</div>
                    </div>
                </header>

                {/* Scrollable content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

                    {/* Page title + upload */}
                    <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.04em', marginBottom: 2 }}>Workspace</h2>
                            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 400, letterSpacing: '-0.01em' }}>Intelligently organize your documents</p>
                        </div>
                        <label
                            className="btn-primary"
                            style={{ padding: '11px 22px', borderRadius: 12, fontSize: '0.875rem', fontWeight: 600, letterSpacing: '-0.01em', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                            {uploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} />}
                            {uploading ? 'Processing…' : 'Upload File'}
                            <input type="file" style={{ display: 'none' }} disabled={uploading} onChange={handleUpload} />
                        </label>
                    </div>

                    {/* Stat cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                        {[
                            { label: 'Total Files', value: stats.totalFiles, icon: FileText },
                            { label: 'Storage Used', value: `${stats.storageUsed} MB`, icon: Cloud },
                            { label: 'AI Insights', value: '12 ready', icon: Sparkles },
                        ].map(stat => (
                            <div key={stat.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 18, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <stat.icon size={20} color="#09090b" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{stat.label}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Alert banner */}
                    {alert && (
                        <div style={{ marginBottom: 24, background: '#fff', border: `1px solid ${alert.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 14, padding: '14px 18px', position: 'relative' }}>
                            <button onClick={() => setAlert(null)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex' }}>
                                <X size={15} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: alert.metrics ? 10 : 0 }}>
                                <Brain size={16} color={alert.type === 'error' ? '#ef4444' : '#09090b'} />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: alert.type === 'error' ? '#ef4444' : '#09090b', letterSpacing: '-0.01em' }}>
                                    {alert.type === 'error' ? alert.message : `AI Processing complete — "${alert.name}"`}
                                </span>
                            </div>
                            {alert.metrics && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                                    {[['Hashing', 'hash'], ['Analysis', 'analysis'], ['Vectors', 'embedding'], ['Storage', 'storage']].map(([label, key]) => (
                                        <div key={key} style={{ background: '#fafafa', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.04)' }}>
                                            <p style={{ fontSize: '0.6rem', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3, letterSpacing: '0.06em' }}>{label}</p>
                                            <p style={{ fontSize: '0.92rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em' }}>{alert.metrics.stages[key]}ms</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Filter row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#09090b', letterSpacing: '-0.02em' }}>{activeCategory} Files</h1>
                            <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 500 }}>({filteredFiles.length})</span>
                            {activeCategory !== 'All' && (
                                <button onClick={handleSummarizeFolder} disabled={summarizingFolder}
                                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: '#09090b', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.01em' }}>
                                    <Sparkles size={11} />{summarizingFolder ? 'Thinking…' : 'AI Summary'}
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 2, background: 'rgba(0,0,0,0.04)', borderRadius: 8, padding: 3 }}>
                            {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                                <button key={v} onClick={() => setViewMode(v)}
                                    style={{ padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: viewMode === v ? '#fff' : 'transparent', color: viewMode === v ? '#09090b' : '#a1a1aa', display: 'flex', boxShadow: viewMode === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: '0.15s' }}>
                                    <Icon size={15} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Folder summary box */}
                    {folderSummary && (
                        <div style={{ marginBottom: 20, background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: '18px 20px', position: 'relative' }}>
                            <button onClick={() => setFolderSummary(null)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex' }}>
                                <X size={14} />
                            </button>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#09090b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Intelligence Insight</p>
                            <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: '#52525b', fontWeight: 400, letterSpacing: '-0.01em' }}>{folderSummary}</p>
                        </div>
                    )}

                    {/* Files grid / list */}
                    {filteredFiles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#a1a1aa' }}>
                            <File size={40} color="#d4d4d8" style={{ margin: '0 auto 16px' }} />
                            <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#71717a' }}>No files yet</p>
                            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>Upload your first file to get started</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr',
                            gap: viewMode === 'grid' ? 16 : 8,
                        }}>
                            {filteredFiles.map(f => {
                                const isBlurred = f.is_pii && !privacyUnlocked[f.id];
                                const isSelected = selectedFile?.id === f.id;

                                if (viewMode === 'list') {
                                    return (
                                        <div key={f.id} onClick={() => setSelectedFile(f)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
                                                borderRadius: 12, border: `1px solid ${isSelected ? '#09090b' : 'rgba(0,0,0,0.06)'}`,
                                                background: isSelected ? 'rgba(0,0,0,0.02)' : '#fff',
                                                cursor: 'pointer', transition: '0.15s', position: 'relative', overflow: 'hidden',
                                            }}
                                        >
                                            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <FileIcon type={f.type} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#09090b', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</p>
                                                <p style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: 2 }}>{fmtSize(f.size)} · {fmtDate(f.created_at)}</p>
                                            </div>
                                            {f.is_pii && <ShieldAlert size={15} color="#ef4444" />}
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <button style={{ background: 'none', border: 'none', color: '#a1a1aa', padding: 6, cursor: 'pointer', borderRadius: 6, display: 'flex', transition: '0.15s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.color = '#09090b'; e.currentTarget.style.background = '#f4f4f5'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'transparent'; }}>
                                                    <Download size={15} />
                                                </button>
                                                <button onClick={ev => { ev.stopPropagation(); handleDelete(f.id); }}
                                                    style={{ background: 'none', border: 'none', color: '#a1a1aa', padding: 6, cursor: 'pointer', borderRadius: 6, display: 'flex', transition: '0.15s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'transparent'; }}>
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }

                                // Grid card
                                return (
                                    <div key={f.id} onClick={() => setSelectedFile(f)}
                                        style={{
                                            background: '#fff',
                                            border: `1px solid ${isSelected ? '#09090b' : f.is_pii ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.06)'}`,
                                            borderRadius: 20, padding: '22px', cursor: 'pointer',
                                            transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden',
                                            boxShadow: isSelected ? '0 0 0 2px #09090b' : 'none',
                                        }}
                                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.boxShadow = '0 4px 16px -4px rgba(0,0,0,0.1)'; }}
                                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        {/* PII blur overlay */}
                                        {isBlurred && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                                <ShieldAlert size={24} color="#ef4444" />
                                                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secured</p>
                                                <button onClick={ev => { ev.stopPropagation(); togglePrivacy(f.id); }}
                                                    style={{ padding: '7px 16px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em' }}>
                                                    Unlock
                                                </button>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.04)' }}>
                                                <FileIcon type={f.type} />
                                            </div>
                                            <div style={{ display: 'flex', gap: 2 }}>
                                                <button style={{ background: 'none', border: 'none', color: '#a1a1aa', padding: 5, cursor: 'pointer', borderRadius: 6, display: 'flex', transition: '0.15s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.color = '#09090b'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; }}>
                                                    <Download size={14} />
                                                </button>
                                                <button onClick={ev => { ev.stopPropagation(); handleDelete(f.id); }}
                                                    style={{ background: 'none', border: 'none', color: '#a1a1aa', padding: 5, cursor: 'pointer', borderRadius: 6, display: 'flex', transition: '0.15s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#09090b', marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.02em' }}>{f.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: '#71717a', lineHeight: 1.55, height: 40, overflow: 'hidden', marginBottom: 14, fontWeight: 400, letterSpacing: '-0.005em' }}>{f.summary}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: 12 }}>
                                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                {f.tags?.slice(0, 2).map(t => (
                                                    <span key={t} style={{ fontSize: '0.62rem', padding: '3px 9px', background: '#f4f4f5', borderRadius: 6, color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t}</span>
                                                ))}
                                            </div>
                                            <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 500 }}>{fmtSize(f.size)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* ════════════════════ CHAT DRAWER ════════════════════ */}
            {selectedFile && (
                <aside style={{
                    width: 360, flexShrink: 0,
                    display: 'flex', flexDirection: 'column',
                    background: '#fff', borderLeft: '1px solid rgba(0,0,0,0.06)',
                }}>
                    {/* Drawer header */}
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MessageSquare size={16} color="#fff" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#09090b', letterSpacing: '-0.02em' }}>CloudSense Assistant</h3>
                                <p style={{ fontSize: '0.72rem', color: '#a1a1aa', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 200, letterSpacing: '-0.01em' }}>{selectedFile.title}</p>
                            </div>
                        </div>
                        <button onClick={() => { setSelectedFile(null); setChatHistory([]); }}
                            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', transition: '0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#09090b'; e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'transparent'; }}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat messages */}
                    <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* File summary card */}
                        <div style={{ background: '#fafafa', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                            <p style={{ fontSize: '0.62rem', fontWeight: 700, color: '#09090b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>AI Summary</p>
                            <p style={{ fontSize: '0.82rem', color: '#52525b', lineHeight: 1.6, fontWeight: 400 }}>{selectedFile.summary}</p>
                        </div>

                        {chatHistory.map((m, i) => (
                            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                <div style={{
                                    padding: '10px 14px', borderRadius: 14,
                                    background: m.role === 'user' ? '#09090b' : '#f4f4f5',
                                    color: m.role === 'user' ? '#fff' : '#09090b',
                                    fontSize: '0.85rem', lineHeight: 1.55, fontWeight: m.role === 'user' ? 500 : 400,
                                    letterSpacing: '-0.005em',
                                }}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {chatLoading && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 5, padding: '10px 14px', background: '#f4f4f5', borderRadius: 14 }}>
                                {[0, 0.2, 0.4].map((delay, i) => (
                                    <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#09090b', animation: `bounce 1s infinite ${delay}s`, opacity: 0.6 - i * 0.15 }} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat input */}
                    <form onSubmit={handleChat} style={{ padding: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', background: '#fafafa' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                value={chatQuery}
                                onChange={e => setChatQuery(e.target.value)}
                                placeholder="Ask anything about this document..."
                                style={{ width: '100%', padding: '12px 46px 12px 16px', borderRadius: 12, fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', color: '#09090b', fontFamily: ff, letterSpacing: '-0.01em' }}
                            />
                            <button type="submit" disabled={chatLoading}
                                style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: 8, background: '#09090b', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.15s' }}
                            >
                                <Send size={13} />
                            </button>
                        </div>
                    </form>
                </aside>
            )}
        </div>
    );
}
