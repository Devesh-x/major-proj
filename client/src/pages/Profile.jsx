import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Cloud, User, Mail, Lock, Bell, Shield, Trash2, LogOut,
    LayoutGrid, Brain, Clock, SearchCode, Settings,
    Camera, CheckCircle, Eye, EyeOff, Loader2,
} from 'lucide-react';

const NAV = [
    { path: '/dashboard', icon: LayoutGrid, label: 'All Files' },
    { path: '#insights', icon: Brain, label: 'AI Insights' },
    { path: '#recent', icon: Clock, label: 'Recent' },
    { path: '#search', icon: SearchCode, label: 'Smart Search' },
    { path: '/profile', icon: Settings, label: 'Settings' },
];

const SETTINGS_TABS = ['Account', 'Security', 'Notifications', 'Danger Zone'];

function FieldInput({ icon: Icon, type = 'text', name, value, onChange, placeholder, extraRight }) {
    return (
        <div style={{ position: 'relative' }}>
            <Icon size={15} color="#475569" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type={type} name={name} placeholder={placeholder}
                style={{ paddingLeft: 38, paddingRight: extraRight ? 40 : 14, paddingTop: 10, paddingBottom: 10 }}
                value={value} onChange={onChange} />
            {extraRight}
        </div>
    );
}

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState('Account');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPW, setShowPW] = useState(false);
    const [form, setForm] = useState({ name: 'Devesh', email: 'devesh@example.com', bio: 'B.Tech CSE Student' });
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
    const [notifs, setNotifs] = useState({ piiAlerts: true, uploadDone: true, weekly: false });

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    const handlePwChange = e => setPwForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setLoading(false); setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: 6 };
    const fieldWrap = { marginBottom: 16 };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#050b18', fontFamily: 'Inter, sans-serif', color: '#f1f5f9', overflow: 'hidden' }}>

            {/* ── Sidebar ── */}
            <aside style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.025)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Cloud size={16} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Nebula</span>
                </div>
                <nav style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
                    {NAV.map(({ path, icon: Icon, label }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link key={label} to={path} style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10,
                                fontSize: '0.855rem', fontWeight: 500, textDecoration: 'none',
                                color: isActive ? '#fff' : '#64748b',
                                background: isActive ? '#2563eb' : 'transparent',
                                boxShadow: isActive ? '0 2px 12px rgba(37,99,235,0.35)' : 'none',
                                transition: 'all 0.15s',
                            }}>
                                <Icon size={17} />{label}
                            </Link>
                        );
                    })}
                </nav>
                <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>D</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.name}</p>
                        <p style={{ fontSize: '0.72rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.email}</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('sb-token'); navigate('/'); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                        <LogOut size={15} />
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <header style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Profile &amp; Settings</h1>
                </header>

                {/* Body */}
                <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
                    <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', gap: 28 }}>

                        {/* Settings tabs */}
                        <div style={{ width: 160, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {SETTINGS_TABS.map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    style={{
                                        textAlign: 'left', padding: '9px 14px', borderRadius: 10, fontSize: '0.855rem', fontWeight: 500,
                                        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                        background: tab === t ? '#2563eb' : 'transparent',
                                        color: t === 'Danger Zone' ? (tab === t ? '#fff' : '#f87171') : (tab === t ? '#fff' : '#64748b'),
                                        transition: 'all 0.15s',
                                    }}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>

                            {/* ── Account ── */}
                            {tab === 'Account' && (
                                <div>
                                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24, marginBottom: 16 }}>
                                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Personal Information</h2>

                                        {/* Avatar row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                <div style={{ width: 68, height: 68, borderRadius: 16, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900 }}>
                                                    {form.name[0]?.toUpperCase()}
                                                </div>
                                                <button style={{ position: 'absolute', bottom: -6, right: -6, width: 24, height: 24, borderRadius: '50%', background: '#2563eb', border: '2px solid #050b18', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                    <Camera size={11} color="#fff" />
                                                </button>
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '1rem' }}>{form.name}</p>
                                                <p style={{ color: '#64748b', fontSize: '0.82rem' }}>{form.email}</p>
                                                <p style={{ color: '#334155', fontSize: '0.72rem', marginTop: 3 }}>B.Tech · Free Plan · 5.1 MB used</p>
                                            </div>
                                        </div>

                                        {/* Fields */}
                                        <div style={fieldWrap}>
                                            <label style={labelStyle}>Full Name</label>
                                            <FieldInput icon={User} name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
                                        </div>
                                        <div style={fieldWrap}>
                                            <label style={labelStyle}>Email</label>
                                            <FieldInput icon={Mail} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                                        </div>
                                        <div style={fieldWrap}>
                                            <label style={labelStyle}>Bio</label>
                                            <textarea name="bio" rows={2} placeholder="Short bio…"
                                                style={{ padding: '10px 14px', resize: 'none' }}
                                                value={form.bio} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <button onClick={handleSave} disabled={loading}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', opacity: loading ? 0.6 : 1 }}>
                                        {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle size={15} /> : null}
                                        {saved ? 'Saved!' : loading ? 'Saving…' : 'Save Changes'}
                                    </button>
                                </div>
                            )}

                            {/* ── Security ── */}
                            {tab === 'Security' && (
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24 }}>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Lock size={17} color="#60a5fa" /> Change Password
                                    </h2>
                                    {[{ name: 'current', label: 'Current Password' }, { name: 'next', label: 'New Password' }, { name: 'confirm', label: 'Confirm New Password' }].map(f => (
                                        <div key={f.name} style={fieldWrap}>
                                            <label style={labelStyle}>{f.label}</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={15} color="#475569" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                                <input type={showPW ? 'text' : 'password'} name={f.name} placeholder="••••••••"
                                                    style={{ paddingLeft: 38, paddingRight: f.name === 'confirm' ? 44 : 14, paddingTop: 10, paddingBottom: 10 }}
                                                    value={pwForm[f.name]} onChange={handlePwChange} />
                                                {f.name === 'confirm' && (
                                                    <button type="button" onClick={() => setShowPW(p => !p)}
                                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                                                        {showPW ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff' }}>
                                        Update Password
                                    </button>
                                </div>
                            )}

                            {/* ── Notifications ── */}
                            {tab === 'Notifications' && (
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24 }}>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Bell size={17} color="#a78bfa" /> Notification Preferences
                                    </h2>
                                    {[
                                        { key: 'piiAlerts', label: 'PII Detection Alerts', desc: 'Notify when a sensitive document is uploaded.' },
                                        { key: 'uploadDone', label: 'Upload Complete', desc: 'Notify when AI analysis finishes after upload.' },
                                        { key: 'weekly', label: 'Weekly Storage Summary', desc: 'Weekly report of your storage usage.' },
                                    ].map(({ key, label, desc }) => (
                                        <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 3 }}>{label}</p>
                                                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{desc}</p>
                                            </div>
                                            <button onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))}
                                                style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: notifs[key] ? '#2563eb' : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                                                <span style={{ position: 'absolute', top: 2, left: notifs[key] ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.4)', transition: 'left 0.2s' }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Danger Zone ── */}
                            {tab === 'Danger Zone' && (
                                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 18, padding: 24 }}>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: '#f87171', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Shield size={17} /> Danger Zone
                                    </h2>
                                    {[
                                        { title: 'Delete All Files', desc: 'Permanently delete all stored files. Cannot be undone.' },
                                        { title: 'Delete Account', desc: 'Permanently delete your account and all data. Irreversible.' },
                                    ].map(a => (
                                        <div key={a.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.14)', marginBottom: 12 }}>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 3 }}>{a.title}</p>
                                                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{a.desc}</p>
                                            </div>
                                            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.12)', color: '#f87171', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
