import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BackgroundCells } from "@/components/ui/background-ripple-effect";

const WORDS = ["intelligent.", "private.", "blazing-fast.", "automated.", "seamless."];

export function Hero() {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex(prev => (prev + 1) % WORDS.length);
        }, 2400);
        return () => clearInterval(id);
    }, []);

    return (
        /* BackgroundCells wraps the entire hero and renders the interactive grid behind content */
        <BackgroundCells
            style={{
                minHeight: "92vh",
                width: "100%",
                background: "#fff",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* All hero content — sits above the grid via z-index in BackgroundCells */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "92vh",
                padding: "100px 24px 80px",
                pointerEvents: "auto",   /* re-enable clicks for buttons */
                width: "100%",
            }}>

                {/* Pill badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    style={{ marginBottom: 40 }}
                >
                    <span className="pill">
                        <Sparkles size={11} />
                        Powered by Advanced AI
                    </span>
                </motion.div>

                {/* ── Two-line headline ── */}
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    style={{ textAlign: "center", lineHeight: 1.0 }}
                >
                    {/* Line 1 — Inter Black, strictly one line */}
                    <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "clamp(2.8rem, 7vw, 5.6rem)",
                        fontWeight: 900,
                        letterSpacing: "-0.045em",
                        color: "#09090b",
                        whiteSpace: "nowrap",
                        lineHeight: 1.05,
                        display: "block",
                    }}>
                        Storage that is
                    </div>

                    {/* Line 2 — Playfair Display italic, animated */}
                    <span style={{
                        display: "block",
                        position: "relative",
                        height: "calc(clamp(2.8rem, 7vw, 5.6rem) * 1.2)",
                        overflow: "hidden",
                        marginTop: "0.06em",
                    }}>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={index}
                                initial={{ y: "110%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "-110%", opacity: 0 }}
                                transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
                                style={{
                                    display: "block",
                                    position: "absolute",
                                    left: 0, right: 0,
                                    textAlign: "center",
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: "clamp(2.8rem, 7vw, 5.6rem)",
                                    fontWeight: 800,
                                    fontStyle: "italic",
                                    letterSpacing: "-0.02em",
                                    color: "#09090b",
                                    lineHeight: 1.15,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {WORDS[index]}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                </motion.div>

                {/* Sub-headline */}
                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.28 }}
                    style={{
                        marginTop: 32,
                        fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
                        color: "#71717a",
                        maxWidth: 520,
                        textAlign: "center",
                        lineHeight: 1.7,
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    CloudSense uses advanced AI to automatically tag, summarize, protect sensitive data,
                    and semantically search every file you upload — instantly.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.4 }}
                    style={{ marginTop: 40, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}
                >
                    <button
                        onClick={() => navigate("/signup")}
                        className="btn-primary"
                        style={{
                            padding: "14px 28px", borderRadius: 14,
                            fontSize: "0.9rem", fontWeight: 700, letterSpacing: "-0.01em",
                            display: "flex", alignItems: "center", gap: 8,
                            boxShadow: "0 4px 20px -4px rgba(0,0,0,0.22)",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        Get Started Free <ArrowRight size={16} />
                    </button>
                    <button
                        onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                        className="btn-ghost"
                        style={{
                            padding: "14px 22px", borderRadius: 14,
                            fontSize: "0.9rem", fontWeight: 500, letterSpacing: "-0.01em",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        See how it works
                    </button>
                </motion.div>

                {/* Social proof micro-stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.58 }}
                    style={{ marginTop: 60, display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}
                >
                    {[
                        { value: "94%", label: "PII Detection accuracy" },
                        { value: "<22ms", label: "Semantic search speed" },
                        { value: "100%", label: "Duplicate detection" },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#09090b", letterSpacing: "-0.04em", fontFamily: "'Inter', sans-serif" }}>{s.value}</div>
                            <div style={{ fontSize: "0.72rem", color: "#a1a1aa", fontWeight: 500, letterSpacing: "0.01em", marginTop: 3, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </BackgroundCells>
    );
}
