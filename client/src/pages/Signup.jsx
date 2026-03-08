import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cloud, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from "@/components/ui/button";

const PERKS = ['1 GB free storage', 'AI auto-tagging', 'Semantic search', 'PII protection'];

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', bio: '', email: '', password: '' });
    const { name, bio, email, password } = form;
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

            if (error) {
                // Local testing bypass
                if (import.meta.env.VITE_SUPABASE_URL.includes('localhost')) {
                    console.warn("Signup failed, but entering Local Mode bypass...");
                    localStorage.setItem('sb-token', 'local-dummy-token');
                    setLoading(false);
                    navigate('/dashboard');
                    return;
                }
                throw error;
            }

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
        <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Outfit, sans-serif' }}>
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01)_0%,transparent_70%)] pointer-events-none" />

            <div style={{ width: '100%', maxWidth: 480, background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 32, padding: 48, position: 'relative', zIndex: 10, boxShadow: '0 20px 48px -12px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div onClick={() => navigate('/')} style={{ width: 52, height: 52, borderRadius: 16, background: '#000', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <Cloud size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#000', letterSpacing: '-0.02em', marginBottom: 8 }}>Join CloudSense</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Start your journey with intelligent storage.</p>
                </div>
                {error && (
                    <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.85rem' }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                        {/* Name */}
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#000', marginBottom: 8, marginLeft: 4 }}>Full Name</label>
                            <input name="name" value={name} onChange={handleChange} placeholder="Devesh" required
                                style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', background: '#fafafa', color: '#000', fontSize: '0.95rem' }} />
                        </div>
                        {/* Profession */}
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#000', marginBottom: 8, marginLeft: 4 }}>Profession</label>
                            <input name="bio" value={bio} onChange={handleChange} placeholder="Student"
                                style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', background: '#fafafa', color: '#000', fontSize: '0.95rem' }} />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#000', marginBottom: 8, marginLeft: 4 }}>Email Address</label>
                        <input name="email" type="email" value={email} onChange={handleChange} placeholder="name@company.com" required
                            style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', background: '#fafafa', color: '#000', fontSize: '0.95rem' }} />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 32 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#000', marginBottom: 8, marginLeft: 4 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input name="password" type={show ? 'text' : 'password'} value={password} onChange={handleChange} placeholder="Create a strong password" required
                                style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', background: '#fafafa', color: '#000', fontSize: '0.95rem', paddingRight: 44 }} />
                            <button type="button" onClick={() => setShow(p => !p)}
                                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {/* Strength bar */}
                        <div style={{ marginTop: 8, height: 4, borderRadius: 4, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${strength * 25}%`, background: strengthColor, borderRadius: 4, transition: 'all 0.3s' }} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary"
                        style={{ width: '100%', padding: '16px', borderRadius: 16, fontSize: '1rem', fontWeight: 800, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.78rem', marginTop: 14 }}>
                    By signing up you agree to our Terms &amp; Privacy Policy.
                </p>
                <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.9rem', color: '#64748b' }}>
                    Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#000', fontWeight: 800, cursor: 'pointer' }}>Log in here</span>
                </p>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
