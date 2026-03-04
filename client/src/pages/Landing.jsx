import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Zap, Shield, Search, ArrowRight, CheckCircle, Brain, Lock } from 'lucide-react';

const FEATURES = [
    { icon: Brain, color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', title: 'Gemini AI Analysis', desc: 'Every file is automatically analyzed, tagged, and summarized using Google Gemini 1.5.' },
    { icon: Search, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', title: 'Semantic Search', desc: 'Find any file by meaning, not just file name. Ask "travel documents" and find your passport.' },
    { icon: Shield, color: '#f87171', bg: 'rgba(239,68,68,0.1)', title: 'PII Protection', desc: 'AI automatically detects sensitive ID proofs, passports, and confidential documents.' },
    { icon: Zap, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', title: 'Duplicate Guard', desc: 'Stops you from uploading the same file twice with SHA-256 content hashing.' },
];

const STATS = [
    { value: '94%', label: 'PII Detection Accuracy' },
    { value: '<22ms', label: 'Semantic Search Speed' },
    { value: '100%', label: 'Duplicate Detection' },
    { value: '1 GB', label: 'Free Storage' },
];

export default function Landing() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div style={{ background: '#050b18', minHeight: '100vh', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>

            {/* ── Navbar ── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 48px', height: 64,
                background: scrolled ? 'rgba(5,11,24,0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
                transition: 'all 0.3s',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Cloud size={17} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Nebula</span>
                </div>

                <div style={{ display: 'flex', gap: 32 }}>
                    <a href="#features" style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none' }}>Features</a>
                    <a href="#stats" style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none' }}>Stats</a>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button onClick={() => navigate('/login')}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' }}>
                        Sign In
                    </button>
                    <button onClick={() => navigate('/signup')} className="btn-primary"
                        style={{ padding: '8px 20px', borderRadius: 10 }}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 60px', position: 'relative', overflow: 'hidden' }}>
                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '20%', left: '20%', width: 500, height: 500, background: 'rgba(59,130,246,0.18)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 400, height: 400, background: 'rgba(139,92,246,0.18)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', maxWidth: 780, width: '100%' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, marginBottom: 28 }}>
                        <Zap size={13} color="#fbbf24" /> Powered by Gemini 1.5 AI
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24, color: '#f8fafc' }}>
                        Cloud Storage That{' '}
                        <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Understands
                        </span>{' '}
                        Your Files
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
                        Upload any document — AI automatically tags it, detects sensitive content, and makes it instantly searchable by meaning, not just name.
                    </p>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
                        <button onClick={() => navigate('/signup')} className="btn-primary"
                            style={{ padding: '14px 32px', borderRadius: 14, fontSize: '1rem' }}>
                            Start for Free <ArrowRight size={18} />
                        </button>
                        <button onClick={() => navigate('/dashboard')}
                            style={{ padding: '14px 32px', borderRadius: 14, fontSize: '1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                            View Dashboard
                        </button>
                    </div>

                    {/* Mock dashboard card */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, padding: 8, boxShadow: '0 0 60px rgba(59,130,246,0.12)' }}>
                        {/* Titlebar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
                            <span style={{ width: 10, height: 10, borderRadius: 99, background: '#ef4444' }} />
                            <span style={{ width: 10, height: 10, borderRadius: 99, background: '#f59e0b' }} />
                            <span style={{ width: 10, height: 10, borderRadius: 99, background: '#22c55e' }} />
                            <span style={{ marginLeft: 12, fontSize: '0.75rem', color: '#475569' }}>nebula.cloud/dashboard</span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, padding: '0 8px 8px' }}>
                            <div style={{ width: 130, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {['All Files', 'AI Insights', 'Recent', 'Trash'].map((item, i) => (
                                    <div key={item} style={{ padding: '7px 12px', borderRadius: 8, fontSize: '0.78rem', background: i === 0 ? '#2563eb' : 'transparent', color: i === 0 ? '#fff' : '#64748b' }}>{item}</div>
                                ))}
                            </div>
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                                {[
                                    { name: 'Passport.pdf', tag: '🛡️ PII', border: 'rgba(239,68,68,0.3)' },
                                    { name: 'Report_Q4.pdf', tag: '📊 Finance', border: 'rgba(59,130,246,0.2)' },
                                    { name: 'Resume_v3.docx', tag: '💼 Career', border: 'rgba(139,92,246,0.2)' },
                                    { name: 'Flight.pdf', tag: '✈️ Travel', border: 'rgba(6,182,212,0.2)' },
                                    { name: 'Invoice.pdf', tag: '💰 Finance', border: 'rgba(59,130,246,0.2)' },
                                    { name: 'Notes.txt', tag: '📝 General', border: 'rgba(255,255,255,0.08)' },
                                ].map(f => (
                                    <div key={f.name} style={{ padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${f.border}`, textAlign: 'left' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: 3 }}>{f.tag}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section id="stats" style={{ padding: '56px 48px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
                    {STATS.map(s => (
                        <div key={s.label}>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>{s.value}</div>
                            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 52 }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 12 }}>Everything AI-Powered</h2>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>No manual tagging. No guessing. Your files, intelligently organized.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
                    {FEATURES.map(f => (
                        <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 28px' }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                                <f.icon size={24} color={f.color} />
                            </div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.65, fontSize: '0.9rem' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ maxWidth: 620, margin: '0 auto', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24, padding: '52px 40px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(59,130,246,0.07),rgba(139,92,246,0.07))', pointerEvents: 'none' }} />
                    <Lock size={36} color="#60a5fa" style={{ marginBottom: 20 }} />
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 10 }}>Start Storing Smarter</h2>
                    <p style={{ color: '#64748b', marginBottom: 28 }}>1 GB free. No credit card. AI-powered from day one.</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 28 }}>
                        {['AI Auto-Tagging', 'PII Detection', 'Semantic Search', '1 GB Free'].map(item => (
                            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#cbd5e1' }}>
                                <CheckCircle size={15} color="#22c55e" /> {item}
                            </span>
                        ))}
                    </div>
                    <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '14px 36px', borderRadius: 14, fontSize: '1rem' }}>
                        Create Free Account <ArrowRight size={18} />
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#475569' }}>
                    <Cloud size={15} /> <strong style={{ color: '#64748b' }}>Nebula</strong> Cloud Storage
                </div>
                <p style={{ fontSize: '0.78rem', color: '#334155' }}>© 2026 Nebula · B.Tech Project</p>
            </footer>
        </div>
    );
}
