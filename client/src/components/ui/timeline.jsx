import React, { useEffect, useRef, useState } from "react";
import {
    useMotionValueEvent,
    useScroll,
    useTransform,
    motion,
} from "framer-motion";
import { Upload, Brain, Search, Shield, Zap, CheckCircle } from "lucide-react";

/* ── CloudSense feature timeline data ── */
const TIMELINE_DATA = [
    {
        title: "Upload",
        content: (
            <div>
                <p style={{ color: "#52525b", fontSize: "0.9rem", fontWeight: 400, lineHeight: 1.7, marginBottom: 20 }}>
                    Drop any file — PDF, image, document — and CloudSense immediately begins processing it through
                    our intelligent automation pipeline.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                    {[
                        "Intelligent content hashing",
                        "Duplicate guard prevents redundant uploads",
                        "Secure cloud storage",
                        "File type auto-detected and routed for analysis",
                    ].map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <CheckCircle size={15} color="#09090b" />
                            <span style={{ fontSize: "0.85rem", color: "#52525b", lineHeight: 1.5 }}>{item}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <img
                        src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80"
                        alt="File upload interface"
                        style={{ borderRadius: 12, objectFit: "cover", height: 160, width: "100%", border: "1px solid rgba(0,0,0,0.06)" }}
                    />
                    <img
                        src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80"
                        alt="Cloud storage"
                        style={{ borderRadius: 12, objectFit: "cover", height: 160, width: "100%", border: "1px solid rgba(0,0,0,0.06)" }}
                    />
                </div>
            </div>
        ),
    },
    {
        title: "AI Analysis",
        content: (
            <div>
                <p style={{ color: "#52525b", fontSize: "0.9rem", fontWeight: 400, lineHeight: 1.7, marginBottom: 20 }}>
                    The moment a file lands, our AI reads it end-to-end — generating a smart summary, extracting
                    semantic tags, assigning a category, and <strong style={{ color: "#09090b" }}>detecting sensitive data</strong> in milliseconds.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                    {[
                        "Automatic title, summary & category generation",
                        "Semantic tag extraction — no manual labelling",
                        "PII detection with 94%+ accuracy",
                        "Confidence scores for every classification",
                    ].map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <CheckCircle size={15} color="#09090b" />
                            <span style={{ fontSize: "0.85rem", color: "#52525b", lineHeight: 1.5 }}>{item}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <img
                        src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80"
                        alt="AI processing"
                        style={{ borderRadius: 12, objectFit: "cover", height: 160, width: "100%", border: "1px solid rgba(0,0,0,0.06)" }}
                    />
                    <img
                        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80"
                        alt="Neural network"
                        style={{ borderRadius: 12, objectFit: "cover", height: 160, width: "100%", border: "1px solid rgba(0,0,0,0.06)" }}
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Semantic Search",
        content: (
            <div>
                <p style={{ color: "#52525b", fontSize: "0.9rem", fontWeight: 400, lineHeight: 1.7, marginBottom: 20 }}>
                    Every file is indexed into a <strong style={{ color: "#09090b" }}>conceptual space</strong> using our semantic model.
                    Search by meaning — not keywords — and find exactly what you need in under 22ms.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                    {[
                        "Ask 'travel documents' → finds your passport",
                        "Fuzzy + semantic hybrid search modes",
                        "Advanced semantic indexing for instant recall",
                        "Results ranked by relevance, not just filename",
                    ].map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <CheckCircle size={15} color="#09090b" />
                            <span style={{ fontSize: "0.85rem", color: "#52525b", lineHeight: 1.5 }}>{item}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <img
                        src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80"
                        alt="Search interface"
                        style={{ borderRadius: 12, objectFit: "cover", height: 160, width: "100%", border: "1px solid rgba(0,0,0,0.06)" }}
                    />
                    <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
                        alt="Data analytics"
                        style={{ borderRadius: 12, objectFit: "cover", height: 160, width: "100%", border: "1px solid rgba(0,0,0,0.06)" }}
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Private & Secure",
        content: (
            <div>
                <p style={{ color: "#52525b", fontSize: "0.9rem", fontWeight: 400, lineHeight: 1.7, marginBottom: 20 }}>
                    Sensitive files flagged with PII are automatically locked behind a <strong style={{ color: "#09090b" }}>biometric/PIN gate</strong>.
                    Your identity data stays yours — zero-knowledge architecture by default.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                    {[
                        "Sensitive files blurred and protected in dashboard",
                        "Row-level security and authentication",
                        "Private AI context — no data leakage",
                        "Signed access URLs expire automatically",
                    ].map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <CheckCircle size={15} color="#09090b" />
                            <span style={{ fontSize: "0.85rem", color: "#52525b", lineHeight: 1.5 }}>{item}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <img
                        src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80"
                        alt="Security lock"
                        style={{ borderRadius: 12, objectFit: "cover", height: 160, width: "100%", border: "1px solid rgba(0,0,0,0.06)" }}
                    />
                    <img
                        src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80"
                        alt="Encrypted data"
                        style={{ borderRadius: 12, objectFit: "cover", height: 160, width: "100%", border: "1px solid rgba(0,0,0,0.06)" }}
                    />
                </div>
            </div>
        ),
    },
];

/* ── Timeline component ── */
export const Timeline = ({ data }) => {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.getBoundingClientRect().height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", background: "#fff", fontFamily: "'Inter', sans-serif", position: "relative" }}
        >
            {/* Section header */}
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "96px 40px 0" }}>
                <span
                    className="pill"
                    style={{ marginBottom: 20, display: "inline-flex" }}
                >
                    How It Works
                </span>
                <h2 style={{
                    fontSize: "clamp(2rem, 5vw, 3.2rem)",
                    fontWeight: 900,
                    color: "#09090b",
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    maxWidth: 560,
                    marginBottom: 14,
                }}>
                    From upload to insight — in seconds.
                </h2>
                <p style={{ color: "#71717a", fontSize: "1rem", maxWidth: 480, lineHeight: 1.65, fontWeight: 400 }}>
                    A four-stage AI pipeline processes every file you upload — automatically, privately, instantly.
                </p>
            </div>

            {/* Timeline entries */}
            <div ref={ref} style={{ position: "relative", maxWidth: 1120, margin: "0 auto", padding: "0 40px 80px" }}>
                {data.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            paddingTop: index === 0 ? 56 : 96,
                            gap: 64,  /* increased gap to avoid overlap */
                        }}
                    >
                        {/* Left: sticky dot + title */}
                        <div style={{
                            position: "sticky",
                            top: 140,
                            alignSelf: "flex-start",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            maxWidth: 320,  /* increased width for title container */
                            width: "100%",
                            zIndex: 40,
                        }}>
                            {/* Timeline dot */}
                            <div style={{
                                width: 40, height: 40,
                                borderRadius: "50%",
                                background: "#fff",
                                border: "1px solid rgba(0,0,0,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            }}>
                                <div style={{
                                    width: 14, height: 14,
                                    borderRadius: "50%",
                                    background: "#09090b",
                                }} />
                            </div>

                            {/* Title */}
                            <h3 style={{
                                paddingLeft: 20,
                                fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)",
                                fontWeight: 900,
                                color: "#09090b",
                                letterSpacing: "-0.03em",
                                lineHeight: 1.1,
                                whiteSpace: "normal",
                                maxWidth: 220,
                            }}>
                                {item.title}
                            </h3>
                        </div>

                        {/* Right: content */}
                        <div style={{ flex: 1, paddingRight: 8 }}>
                            {item.content}
                        </div>
                    </div>
                ))}

                {/* Scroll-driven line */}
                <div
                    style={{
                        position: "absolute",
                        left: 59,    /* aligns with dot centre: 40px padding + 19px */
                        top: 0,
                        width: 2,
                        height: height,
                        background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 10%, rgba(0,0,0,0.08) 90%, transparent 100%)",
                        maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                        overflow: "hidden",
                    }}
                >
                    <motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                            width: 2,
                            position: "absolute",
                            inset: "0 auto auto 0",
                            background: "linear-gradient(to bottom, transparent 0%, #6366f1 20%, #3b82f6 80%, transparent 100%)",
                            borderRadius: 4,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

/* ── Default export (convenience wrapper with CloudSense data pre-loaded) ── */
export default function CloudSenseTimeline() {
    return <Timeline data={TIMELINE_DATA} />;
}
