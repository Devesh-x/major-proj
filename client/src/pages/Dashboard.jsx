import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Cloud, LayoutGrid, List, Search, Upload, Bell,
    FileText, Image as ImageIcon, File, ShieldAlert, Trash2, Download,
    Brain, FolderOpen, Clock, SearchCode, Settings, LogOut,
} from 'lucide-react';

const MOCK_FILES = [
    { id: 1, name: 'Passport_Scan.pdf', type: 'application/pdf', size: 1200000, is_pii: true, tags: ['identity', 'travel'], title: 'Passport Document', summary: 'Government-issued international travel document.' },
    { id: 2, name: 'Q4_Report_2025.pdf', type: 'application/pdf', size: 800000, is_pii: false, tags: ['finance', 'report'], title: 'Q4 Financial Report', summary: 'Quarterly financial summary including revenue and expenses.' },
    { id: 3, name: 'Resume_v3.docx', type: 'application/docx', size: 450000, is_pii: false, tags: ['career', 'resume'], title: 'Software Dev Resume', summary: 'Updated resume with latest project experience.' },
    { id: 4, name: 'Flight_Ticket.pdf', type: 'application/pdf', size: 320000, is_pii: false, tags: ['travel', 'booking'], title: 'Flight Booking Confirmation', summary: 'Round-trip flight booking for March.' },
    { id: 5, name: 'Invoice_001.pdf', type: 'application/pdf', size: 210000, is_pii: false, tags: ['finance', 'invoice'], title: 'Service Invoice #001', summary: 'Invoice for freelance development services.' },
    { id: 6, name: 'Notes.txt', type: 'text/plain', size: 12000, is_pii: false, tags: ['general', 'notes'], title: 'Project Notes', summary: 'Random notes and ideas for the cloud project.' },
    { id: 7, name: 'Profile_Photo.jpg', type: 'image/jpeg', size: 2100000, is_pii: false, tags: ['image', 'personal'], title: 'Profile Photo', summary: 'Personal photograph.' },
    { id: 8, name: 'Aadhar_Card.pdf', type: 'application/pdf', size: 980000, is_pii: true, tags: ['identity', 'govt'], title: 'Aadhaar Card', summary: 'Indian government national ID document.' },
];

const NAV = [
    { path: '/dashboard', icon: LayoutGrid, label: 'All Files' },
    { path: '#insights', icon: Brain, label: 'AI Insights' },
    { path: '#recent', icon: Clock, label: 'Recent' },
    { path: '#search', icon: SearchCode, label: 'Smart Search' },
    { path: '/profile', icon: Settings, label: 'Settings' },
];

function FileIcon({ type }) {
    if (type.startsWith('image')) return <ImageIcon size={22} color="#a78bfa" />;
    if (type.includes('pdf')) return <FileText size={22} color="#f87171" />;
    return <File size={22} color="#94a3b8" />;
}

function fmtSize(b) {
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
}

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [files, setFiles] = useState(MOCK_FILES);
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState('fuzzy');
    const [viewMode, setViewMode] = useState('grid');
    const [alert, setAlert] = useState(null);
    const [upload, setUpload] = useState(false);

    const handleSearch = e => {
        e.preventDefault();
        if (!query.trim()) { setFiles(MOCK_FILES); return; }
        const q = query.toLowerCase();
        setFiles(MOCK_FILES.filter(f =>
            f.title.toLowerCase().includes(q) ||
            f.summary.toLowerCase().includes(q) ||
            f.tags.some(t => t.includes(q))
        ));
    };

    const handleUpload = async file => {
        if (!file) return;
        setUpload(true);
        await new Promise(r => setTimeout(r, 1400));
        const isPII = /passport|aadhar|id card/i.test(file.name);
        setAlert({ type: isPII ? 'pii' : 'ok', name: file.name });
        setUpload(false);
        setTimeout(() => setAlert(null), 5000);
    };

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

                {/* Storage bar */}
                <div style={{ margin: '14px 12px 6px', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginBottom: 8 }}>
                        <span>Storage</span><span style={{ color: '#94a3b8', fontWeight: 600 }}>5.1 / 1024 MB</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)' }}>
                        <div style={{ height: '100%', width: '1%', borderRadius: 3, background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)' }} />
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                            {mode === 'semantic' ? 'AI' : 'KEYWORD'}
                        </button>
                        <button type="submit" className="btn-primary" style={{ height: 36, padding: '0 16px', borderRadius: 8, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>Search</button>
                    </form>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', position: 'relative', display: 'flex' }}>
                            <Bell size={18} />
                            <span style={{ position: 'absolute', top: 0, right: 0, width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                        </button>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 16px', borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: upload ? 'not-allowed' : 'pointer', opacity: upload ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                            {upload
                                ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />Processing…</>
                                : <><Upload size={15} />Upload</>}
                            <input type="file" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files[0])} disabled={upload} />
                        </label>
                    </div>
                </header>

                {/* Page body */}
                <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

                    {/* Alert */}
                    {alert && (
                        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, background: alert.type === 'pii' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${alert.type === 'pii' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}` }}>
                            {alert.type === 'pii'
                                ? <ShieldAlert size={20} color="#f87171" style={{ flexShrink: 0 }} />
                                : <FolderOpen size={20} color="#4ade80" style={{ flexShrink: 0 }} />}
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: alert.type === 'pii' ? '#fca5a5' : '#86efac' }}>
                                    {alert.type === 'pii' ? '⚠️ Sensitive Document Detected' : '✓ File Uploaded & Analyzed'}
                                </p>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>"{alert.name}" {alert.type === 'pii' ? 'has been flagged as a sensitive document.' : 'was tagged by Gemini AI.'}</p>
                            </div>
                            <button onClick={() => setAlert(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '1rem' }}>✕</button>
                        </div>
                    )}

                    {/* Title row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                            <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>All Files</h1>
                            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: 2 }}>{files.length} files · sorted by recent</p>
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

                    {/* Files */}
                    {files.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280, color: '#334155', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 20 }}>
                            <FolderOpen size={44} style={{ marginBottom: 14, opacity: 0.3 }} />
                            <p style={{ fontWeight: 600 }}>No files found</p>
                            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>Try a different search or upload a file</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
                            {files.map(f => (
                                <div key={f.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${f.is_pii ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: '16px 14px', cursor: 'pointer', transition: 'border-color 0.15s', position: 'relative' }}>
                                    {f.is_pii && <ShieldAlert size={13} color="#f87171" style={{ position: 'absolute', top: 12, right: 12 }} />}
                                    <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                                        <FileIcon type={f.type} />
                                    </div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{f.title}</p>
                                    <p style={{ fontSize: '0.72rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic', marginBottom: 10 }}>{f.summary}</p>
                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                        {f.tags.slice(0, 2).map(t => (
                                            <span key={t} style={{ fontSize: '0.65rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.07)' }}>#{t}</span>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '0.68rem', color: '#334155', marginTop: 8 }}>{fmtSize(f.size)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {files.map(f => (
                                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, cursor: 'pointer' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <FileIcon type={f.type} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <p style={{ fontSize: '0.855rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</p>
                                            {f.is_pii && <ShieldAlert size={13} color="#f87171" style={{ flexShrink: 0 }} />}
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.summary}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                        {f.tags.slice(0, 2).map(t => (
                                            <span key={t} style={{ fontSize: '0.65rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' }}>#{t}</span>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '0.72rem', color: '#475569', minWidth: 60, textAlign: 'right', flexShrink: 0 }}>{fmtSize(f.size)}</p>
                                    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: 4, borderRadius: 6 }}><Download size={15} /></button>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: 4, borderRadius: 6 }}><Trash2 size={15} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
