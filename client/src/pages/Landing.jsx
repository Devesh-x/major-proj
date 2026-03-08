import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Zap, Shield, Search, ArrowRight, CheckCircle, Brain, Lock, Menu, X } from 'lucide-react';
import { Hero } from "@/components/ui/animated-hero";
import CloudSenseTimeline from "@/components/ui/timeline";

const FEATURES = [
    {
        icon: Brain,
        title: 'AI Auto-Analysis',
        desc: 'Every file is automatically analyzed, tagged, and summarized using our advanced AI within seconds of upload.',
        tag: 'Intelligent AI',
    },
    {
        icon: Search,
        title: 'Semantic Search',
        desc: 'Find any file by meaning — not just by name. Ask "travel documents" and surface your passport instantly.',
        tag: 'NLP',
    },
    {
        icon: Shield,
        title: 'PII Protection',
        desc: 'AI automatically detects and secures sensitive identity documents, passports, and confidential files.',
        tag: 'Security',
    },
    {
        icon: Zap,
        title: 'Duplicate Guard',
        desc: 'Prevents uploading the same file twice using intelligent content hashing — storage stays clean, always.',
        tag: 'Smart Storage',
    },
];

const NAV_LINKS = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#' },
];

export default function Landing() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 32);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 72,
        background: scrolled ? 'rgba(255,255,255,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: '#09090b', fontFamily: "'Inter', sans-serif" }}>

            {/* ── Navbar ── */}
            <nav style={navStyle}>
                {/* Logo */}
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => navigate('/')}
                >
                    <div style={{
                        width: 34, height: 34, borderRadius: 10, background: '#09090b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                    }}>
                        <Cloud size={18} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#09090b', letterSpacing: '-0.03em' }}>CloudSense</span>
                </div>

                {/* Center links */}
                <div style={{ display: 'flex', gap: 4, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    {NAV_LINKS.map(l => (
                        <a
                            key={l.label}
                            href={l.href}
                            style={{
                                color: '#71717a', fontSize: '0.85rem', textDecoration: 'none',
                                fontWeight: 500, padding: '6px 14px', borderRadius: 8,
                                transition: 'color 0.15s, background 0.15s', letterSpacing: '-0.01em',
                            }}
                            onMouseEnter={e => { e.target.style.color = '#09090b'; e.target.style.background = 'rgba(0,0,0,0.04)'; }}
                            onMouseLeave={e => { e.target.style.color = '#71717a'; e.target.style.background = 'transparent'; }}
                        >
                            {l.label}
                        </a>
                    ))}
                </div>

                {/* Auth buttons */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'none', border: 'none', color: '#71717a',
                            fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                            padding: '8px 14px', borderRadius: 8, transition: 'color 0.15s, background 0.15s',
                            letterSpacing: '-0.01em',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#09090b'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="btn-primary"
                        style={{ padding: '9px 20px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, letterSpacing: '-0.01em' }}
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <Hero />

            {/* ── How It Works (Timeline) ── */}
            <section id="how-it-works">
                <CloudSenseTimeline />
            </section>


            {/* ── Features ── */}
            <section id="features" style={{ padding: '112px 40px', maxWidth: 1160, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <span className="pill" style={{ marginBottom: 20, display: 'inline-flex' }}>Core Features</span>
                    <h2 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 900, color: '#09090b', letterSpacing: '-0.04em', lineHeight: 1.1, maxWidth: 580, margin: '16px auto 0', textWrap: 'balance' }}>
                        Everything your files need, automated.
                    </h2>
                    <p style={{ color: '#71717a', fontSize: '1.05rem', maxWidth: 520, margin: '16px auto 0', lineHeight: 1.65, fontWeight: 400 }}>
                        No manual tagging. No guessing. Your files, intelligently organized from the moment they arrive.
                    </p>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
                    {FEATURES.map((f, i) => (
                        <div
                            key={f.title}
                            className="card"
                            style={{ padding: '40px', borderRadius: 24 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <f.icon size={24} color="#09090b" />
                                </div>
                                <span className="pill">{f.tag}</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#09090b', marginBottom: 10, letterSpacing: '-0.02em' }}>{f.title}</h3>
                            <p style={{ color: '#71717a', lineHeight: 1.65, fontSize: '0.9rem', fontWeight: 400 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding: '80px 24px', textAlign: 'center' }}>
                <div style={{
                    maxWidth: 680, margin: '0 auto',
                    background: '#09090b', color: '#fff',
                    borderRadius: 32, padding: '72px 40px',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Subtle top-right highlight */}
                    <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

                    <Lock size={36} color="rgba(255,255,255,0.7)" style={{ marginBottom: 20 }} />
                    <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                        Start storing smarter.
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 36, fontSize: '1rem', lineHeight: 1.6 }}>
                        1 GB free. No credit card. AI-powered from day one.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginBottom: 40 }}>
                        {['AI Auto-Tagging', 'PII Detection', 'Semantic Search', '1 GB Free'].map(item => (
                            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                                <CheckCircle size={15} color="rgba(255,255,255,0.4)" /> {item}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/signup')}
                        style={{
                            padding: '15px 36px', borderRadius: 14, fontSize: '0.95rem', fontWeight: 700,
                            background: '#fff', color: '#09090b', border: 'none', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            transition: 'all 0.2s', letterSpacing: '-0.01em',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; }}
                    >
                        Create Free Account <ArrowRight size={17} />
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{
                borderTop: '1px solid rgba(0,0,0,0.06)',
                padding: '32px 40px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#fff',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Cloud size={14} color="#fff" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#09090b', letterSpacing: '-0.02em' }}>CloudSense</span>
                    <span style={{ fontSize: '0.85rem', color: '#a1a1aa', marginLeft: 4 }}>Cloud Storage</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>© 2026 CloudSense</p>
            </footer>
        </div>
    );
}
