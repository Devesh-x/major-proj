import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cloud, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        localStorage.setItem('sb-token', 'mock-token');
        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#050b18', fontFamily: 'Inter, sans-serif', color: '#f1f5f9' }}>

            {/* ── Left branding panel ── */}
            <div style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 48px', background: 'linear-gradient(160deg,#0d1626 0%,#050b18 100%)', borderRight: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
                {/* Glow */}
                <div style={{ position: 'absolute', top: '40%', right: -100, width: 360, height: 360, background: 'rgba(59,130,246,0.15)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Cloud size={18} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>Nebula</span>
                </div>

                {/* Middle text */}
                <div style={{ position: 'relative' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
                        Your files,<br />
                        <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>intelligently</span><br />
                        organized.
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        Powered by Gemini AI — automatic tagging, semantic search, and PII protection.
                    </p>
                </div>

                {/* Feature pills */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative' }}>
                    {['Auto-Tagging', 'Semantic Search', 'PII Guard'].map(f => (
                        <span key={f} style={{ padding: '7px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#94a3b8' }}>{f}</span>
                    ))}
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 6 }}>Welcome back</h1>
                    <p style={{ color: '#64748b', marginBottom: 32, fontSize: '0.9rem' }}>Sign in to access your cloud storage.</p>

                    {error && (
                        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '0.85rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input type="email" name="email" placeholder="you@example.com"
                                    style={{ paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}
                                    value={form.email} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>Password</label>
                                <button type="button" style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.78rem', cursor: 'pointer' }}>Forgot password?</button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input type={show ? 'text' : 'password'} name="password" placeholder="••••••••"
                                    style={{ paddingLeft: 42, paddingRight: 44, paddingTop: 12, paddingBottom: 12 }}
                                    value={form.password} onChange={handleChange} required />
                                <button type="button" onClick={() => setShow(p => !p)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary"
                            style={{ width: '100%', padding: '13px', borderRadius: 12 }}>
                            {loading
                                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                : <><span>Sign In</span><ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', marginTop: 28 }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
