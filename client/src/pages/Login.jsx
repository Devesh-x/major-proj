import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cloud, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from "@/components/ui/button";

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

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });

            if (error) {
                // Local testing bypass
                if (import.meta.env.VITE_SUPABASE_URL.includes('localhost')) {
                    console.warn("Auth failed, but entering Local Mode bypass...");
                    localStorage.setItem('sb-token', 'local-dummy-token');
                    setLoading(false);
                    navigate('/dashboard');
                    return;
                }
                throw error;
            }

            localStorage.setItem('sb-token', data.session.access_token);
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Outfit, sans-serif' }}>
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01)_0%,transparent_70%)] pointer-events-none" />

            <div style={{ width: '100%', maxWidth: 440, background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 32, padding: 48, position: 'relative', zIndex: 10, boxShadow: '0 20px 48px -12px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div onClick={() => navigate('/')} style={{ width: 52, height: 52, borderRadius: 16, background: '#000', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <Cloud size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#000', letterSpacing: '-0.02em', marginBottom: 8 }}>Welcome Back</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Login to access your intelligent vault.</p>
                </div>

                {error && (
                    <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.85rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#000', marginBottom: 8, marginLeft: 4 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@company.com" required
                                style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', background: '#fafafa', color: '#000', fontSize: '0.95rem' }} />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, marginLeft: 4 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#000' }}>Password</label>
                            <a href="#" style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'none' }}>Forgot?</a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                            <input type={show ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required
                                style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', background: '#fafafa', color: '#000', fontSize: '0.95rem' }} />
                            <button type="button" onClick={() => setShow(p => !p)}
                                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ width: '100%', padding: '16px', borderRadius: 16, fontSize: '1rem', fontWeight: 800, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={20} /></>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.9rem', color: '#64748b' }}>
                    Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: '#000', fontWeight: 800, cursor: 'pointer' }}>Sign up free</span>
                </p>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
