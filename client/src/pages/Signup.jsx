import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cloud, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

const PERKS = ['1 GB free storage', 'AI auto-tagging', 'Semantic search', 'PII protection'];

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setError('');
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        full_name: form.name,
                    }
                }
            });

            if (error) throw error;

            if (data.session) {
                localStorage.setItem('sb-token', data.session.access_token);
                navigate('/dashboard');
            } else {
                setError('Check your email for the confirmation link!');
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const strength = form.password.length === 0 ? 0 : form.password.length < 4 ? 1 : form.password.length < 6 ? 2 : form.password.length < 10 ? 3 : 4;
    const strengthColor = ['transparent', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][strength];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#050b18', fontFamily: 'Inter, sans-serif', color: '#f1f5f9' }}>

            {/* ── Left branding panel ── */}
            <div style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 48px', background: 'linear-gradient(160deg,#0d1626 0%,#050b18 100%)', borderRight: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '20%', left: -80, width: 320, height: 320, background: 'rgba(139,92,246,0.15)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Cloud size={18} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>Nebula</span>
                </div>

                <div style={{ position: 'relative' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 24 }}>
                        Start storing smarter<br />
                        <span style={{ background: 'linear-gradient(90deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>for free.</span>
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {PERKS.map(p => (
                            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: '#94a3b8' }}>
                                <CheckCircle size={17} color="#22c55e" style={{ flexShrink: 0 }} /> {p}
                            </div>
                        ))}
                    </div>
                </div>

                <p style={{ color: '#334155', fontSize: '0.8rem', position: 'relative' }}>No credit card required.</p>
            </div>

            {/* ── Right form panel ── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 6 }}>Create your account</h1>
                    <p style={{ color: '#64748b', marginBottom: 32, fontSize: '0.9rem' }}>Free forever. No credit card needed.</p>

                    {error && (
                        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '0.85rem' }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input type="text" name="name" placeholder="Your name"
                                    style={{ paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}
                                    value={form.name} onChange={handleChange} required />
                            </div>
                        </div>

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
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input type={show ? 'text' : 'password'} name="password" placeholder="Min. 6 characters"
                                    style={{ paddingLeft: 42, paddingRight: 44, paddingTop: 12, paddingBottom: 12 }}
                                    value={form.password} onChange={handleChange} required />
                                <button type="button" onClick={() => setShow(p => !p)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {/* Strength bar */}
                            <div style={{ marginTop: 8, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${strength * 25}%`, background: strengthColor, borderRadius: 4, transition: 'all 0.3s' }} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary"
                            style={{ width: '100%', padding: '13px', borderRadius: 12 }}>
                            {loading
                                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                : <><span>Create Account</span><ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', color: '#334155', fontSize: '0.78rem', marginTop: 14 }}>
                        By signing up you agree to our Terms &amp; Privacy Policy.
                    </p>
                    <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', marginTop: 20 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
