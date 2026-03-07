import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Cloud, User, Mail, Lock, Bell, Shield, Trash2, LogOut,
    LayoutGrid, Brain, Clock, SearchCode, Settings,
    Camera, CheckCircle, Eye, EyeOff, Loader2, Save
} from 'lucide-react';

const NAV = [
    { path: '/dashboard', icon: LayoutGrid, label: 'All Files' },
    { path: '#insights', icon: Brain, label: 'AI Insights' },
    { path: '#recent', icon: Clock, label: 'Recent' },
    { path: '#search', icon: SearchCode, label: 'Smart Search' },
    { path: '/profile', icon: Settings, label: 'Settings' },
];

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
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false); setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#000', marginBottom: 8, marginLeft: 4 };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#ffffff', color: '#000000', fontFamily: 'Outfit, sans-serif', overflow: 'hidden' }}>
            {/* ── Sidebar ── */}
            <aside style={{ width: 280, background: '#fafafa', borderRight: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div onClick={() => navigate('/dashboard')} style={{ width: 40, height: 40, borderRadius: 12, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <Cloud size={22} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#000', letterSpacing: '-0.02em' }}>Settings</span>
                </div>

                <nav style={{ flex: 1, padding: '0 12px' }}>
                    {[
                        { id: 'Account', label: 'Account', icon: User },
                        { id: 'Security', label: 'Security', icon: Shield },
                        { id: 'Notifications', label: 'Notifications', icon: Bell },
                        { id: 'Danger Zone', label: 'Danger Zone', icon: Trash2 },
                    ].map(item => (
                        <div key={item.id} onClick={() => setTab(item.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, cursor: 'pointer', marginBottom: 4, transition: 'all 0.2s',
                                background: tab === item.id ? '#000' : 'transparent',
                                color: tab === item.id ? '#fff' : '#64748b',
                                fontWeight: 600, fontSize: '0.9rem'
                            }} className="hover:bg-black/5">
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>{form.name[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.email}</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('sb-token'); navigate('/'); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 8 }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#ffffff', padding: '60px 80px' }}>
                <div style={{ maxWidth: 800 }}>
                    <div style={{ marginBottom: 48 }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#000', letterSpacing: '-0.04em', marginBottom: 8 }}>{tab}</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Manage your account preferences and security settings.</p>
                    </div>

                    {tab === 'Account' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 32, padding: 40 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
                                    <div style={{ width: 90, height: 90, borderRadius: 28, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900 }}>{form.name[0]}</div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button style={{ padding: '12px 24px', borderRadius: 16, background: '#000', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>Upload Photo</button>
                                        <button style={{ padding: '12px 24px', borderRadius: 16, background: '#fff', color: '#000', border: '1px solid rgba(0,0,0,0.1)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Remove</button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                    <div>
                                        <label style={labelStyle}>Full Name</label>
                                        <input name="name" value={form.name} onChange={handleChange}
                                            style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', background: '#fafafa', color: '#000', fontSize: '1rem', fontWeight: 500 }} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Email Address</label>
                                        <input name="email" value={form.email} onChange={handleChange}
                                            style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', background: '#fafafa', color: '#000', fontSize: '1rem', fontWeight: 500 }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>About You</label>
                                        <textarea name="bio" value={form.bio} onChange={handleChange} rows={5}
                                            style={{ width: '100%', padding: '16px 20px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', background: '#fafafa', color: '#000', fontSize: '1rem', fontWeight: 500, resize: 'none', lineHeight: 1.6 }} />
                                    </div>
                                </div>

                                <button onClick={handleSave} disabled={loading}
                                    style={{ marginTop: 32, padding: '18px 36px', borderRadius: 18, background: '#000', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: '1rem', transition: '0.2s' }}
                                    className="hover:scale-105 active:scale-95">
                                    {loading ? <Loader2 size={22} className="animate-spin" /> : saved ? <CheckCircle size={22} /> : <Save size={22} />}
                                    {saved ? 'Settings Saved' : loading ? 'Saving Changes…' : 'Save Profiles'}
                                </button>
                            </div>
                        </div>
                    )}

                    {tab === 'Security' && (
                        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 32, padding: 40 }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000', marginBottom: 32 }}>Update Security</h3>
                            {['Current', 'New', 'Confirm'].map(f => (
                                <div key={f} style={{ marginBottom: 24 }}>
                                    <label style={labelStyle}>{f} Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type={showPW ? 'text' : 'password'} name={f.toLowerCase()}
                                            placeholder="••••••••"
                                            style={{ width: '100%', padding: '16px 48px 16px 20px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', background: '#fafafa', color: '#000', fontSize: '1rem' }} />
                                        {f === 'Confirm' && (
                                            <button onClick={() => setShowPW(!showPW)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                                {showPW ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button style={{ marginTop: 12, padding: '16px 32px', borderRadius: 16, background: '#000', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '1rem' }}>Change Password</button>
                        </div>
                    )}

                    {tab === 'Notifications' && (
                        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 32, padding: 40 }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000', marginBottom: 32 }}>Privacy & Monitoring</h3>
                            {Object.keys(notifs).map(key => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <div style={{ flex: 1, paddingRight: 40 }}>
                                        <p style={{ fontWeight: 900, color: '#000', marginBottom: 6, fontSize: '1.1rem' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>Get real-time alerts and activity summaries directly to your inbox when analysis is complete.</p>
                                    </div>
                                    <button onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))}
                                        style={{ width: 56, height: 32, borderRadius: 20, background: notifs[key] ? '#000' : 'rgba(0,0,0,0.06)', position: 'relative', border: 'none', cursor: 'pointer', transition: '0.3s', flexShrink: 0 }}>
                                        <div style={{ position: 'absolute', top: 4, left: notifs[key] ? 28 : 4, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'Danger Zone' && (
                        <div style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)', borderRadius: 32, padding: 40 }}>
                            <h3 style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.5rem', marginBottom: 12 }}>Account Management</h3>
                            <p style={{ color: '#64748b', marginBottom: 32, fontSize: '1.1rem', lineHeight: 1.6 }}>Permanently remove your account and all associated documents from our cloud. This operation is non-reversible and all keys will be shredded.</p>
                            <button style={{ background: '#fff', border: '2px solid #ef4444', color: '#ef4444', padding: '16px 32px', borderRadius: 16, fontWeight: 900, cursor: 'pointer', fontSize: '1rem' }} className="hover:bg-red-50 transition-colors">Terminate Devesh's Account</button>
                        </div>
                    )}
                </div>
            </main>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
