import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT = {
    zinc: { bg: "#f4f4f5", border: "#d4d4d8", check: "#09090b" },
    dark: { bg: "#f4f4f5", border: "#d4d4d8", check: "#09090b" },
};

function CreativePricing({
    tag = "Simple Pricing",
    title = "Cloud storage with an AI brain",
    description = "Intelligent, private, and beautifully simple — starting at $0",
    tiers = [
        {
            name: "Starter",
            color: "zinc",
            description: "Perfect for students & casual users",
            price: 0,
            features: [
                "1GB Secure Storage",
                "Basic AI Auto-Tagging",
                "Keyword Search",
                "Community Support",
            ],
        },
        {
            name: "Pro",
            color: "dark",
            popular: true,
            description: "For professionals needing super-powers",
            price: 19,
            features: [
                "50GB Secure Storage",
                "Advanced Semantic Search",
                "PII Leak Protection",
                "Priority AI Processing",
            ],
        },
        {
            name: "Business",
            color: "zinc",
            description: "For teams with high-security needs",
            price: 99,
            features: [
                "Unlimited Smart Storage",
                "Custom AI Indexing",
                "Full API Access",
                "24/7 Dedicated Support",
            ],
        },
    ],
}) {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style>{`
        .cp-wrap * { box-sizing: border-box; }

        /* ── Header animations ── */
        .cp-header-tag {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .cp-header-title {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s;
        }
        .cp-header-desc {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
        }
        .cp-visible .cp-header-tag,
        .cp-visible .cp-header-title,
        .cp-visible .cp-header-desc {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Card animations ── */
        .cp-card {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.24s ease;
        }
        .cp-card:nth-child(1) { transition-delay: 0.15s; }
        .cp-card:nth-child(2) { transition-delay: 0.28s; }
        .cp-card:nth-child(3) { transition-delay: 0.41s; }

        .cp-visible .cp-card {
          opacity: 1;
          transform: translateY(0);
        }

        .cp-card:hover {
          transform: translateY(-7px) !important;
          box-shadow: 0 22px 44px -10px rgba(0,0,0,0.14) !important;
        }
        .cp-card.popular:hover {
          transform: translateY(-9px) !important;
          box-shadow: 0 28px 52px -10px rgba(0,0,0,0.22) !important;
        }

        /* ── Buttons ── */
        .cp-btn {
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.16s ease, color 0.16s ease,
                      transform 0.16s ease, box-shadow 0.16s ease;
          outline: none;
        }
        .cp-btn:hover  { transform: translateY(-1px); }
        .cp-btn:active { transform: translateY(0); }

        .cp-btn-default:hover {
          background: #09090b !important;
          color: #fff !important;
          border-color: #09090b !important;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
        }
        .cp-btn-popular:hover {
          background: #27272a !important;
          border-color: #27272a !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.28);
        }

        /* ── Features ── */
        .cp-feat {
          animation: cp-in 0.32s ease forwards;
          opacity: 0;
        }
        @keyframes cp-in {
          from { opacity: 0; transform: translateX(-5px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Footer ── */
        .cp-footer {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s;
        }
        .cp-visible .cp-footer {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

            <section
                id="pricing"
                ref={sectionRef}
                className={cn("cp-wrap", visible && "cp-visible")}
                style={{
                    width: "100%",
                    background: "#ffffff",
                    padding: "88px 32px 96px",
                    borderTop: "1px solid #e4e4e7",
                    fontFamily: "'Inter', sans-serif",
                    scrollMarginTop: "80px",
                }}
            >
                <div style={{ maxWidth: 1040, margin: "0 auto" }}>

                    {/* ── Header ── */}
                    <div style={{ textAlign: "center", marginBottom: 60 }}>
                        <span
                            className="cp-header-tag"
                            style={{
                                display: "inline-block",
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: "#09090b",
                                marginBottom: 16,
                                padding: "5px 14px",
                                background: "#f4f4f5",
                                borderRadius: 999,
                                border: "1px solid #d4d4d8",
                            }}
                        >
                            {tag}
                        </span>

                        <h2
                            className="cp-header-title"
                            style={{
                                display: "block",
                                fontSize: "clamp(1.85rem, 4vw, 2.75rem)",
                                fontWeight: 800,
                                color: "#09090b",
                                letterSpacing: "-0.03em",
                                lineHeight: 1.15,
                                margin: "0 0 14px",
                            }}
                        >
                            {title}
                        </h2>

                        <p
                            className="cp-header-desc"
                            style={{
                                fontSize: 15,
                                color: "#71717a",
                                fontWeight: 400,
                                maxWidth: 390,
                                margin: "0 auto",
                                lineHeight: 1.7,
                            }}
                        >
                            {description}
                        </p>
                    </div>

                    {/* ── Cards ── */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 20,
                        alignItems: "stretch",
                    }}>
                        {tiers.map((tier) => {
                            const accent = ACCENT[tier.color] ?? ACCENT.zinc;
                            const isPopular = !!tier.popular;

                            return (
                                <div
                                    key={tier.name}
                                    className={cn("cp-card", isPopular && "popular")}
                                    style={{
                                        position: "relative",
                                        borderRadius: 18,
                                        border: isPopular ? "2px solid #09090b" : "1.5px solid #e4e4e7",
                                        background: isPopular ? "#09090b" : "#ffffff",
                                        padding: "34px 26px 26px",
                                        display: "flex",
                                        flexDirection: "column",
                                        boxShadow: isPopular
                                            ? "0 10px 32px -6px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.08)"
                                            : "0 2px 8px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    {/* Popular badge */}
                                    {isPopular && (
                                        <div style={{
                                            position: "absolute",
                                            top: -13,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            background: "#ffffff",
                                            color: "#09090b",
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: "0.16em",
                                            textTransform: "uppercase",
                                            padding: "4px 16px",
                                            borderRadius: 999,
                                            whiteSpace: "nowrap",
                                            border: "1.5px solid #09090b",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                        }}>
                                            Most Popular
                                        </div>
                                    )}

                                    {/* Tier label */}
                                    <p style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: isPopular ? "#a1a1aa" : "#a1a1aa",
                                        margin: "0 0 6px",
                                    }}>
                                        {tier.name}
                                    </p>

                                    {/* Price */}
                                    <h3 style={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: isPopular ? "#ffffff" : "#09090b",
                                        margin: "0 0 6px",
                                        letterSpacing: "-0.025em",
                                        lineHeight: 1.2,
                                    }}>
                                        {tier.price === 0 ? "Free" : `$${tier.price}`}
                                        {tier.price > 0 && (
                                            <span style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: isPopular ? "#71717a" : "#a1a1aa",
                                                letterSpacing: 0,
                                            }}>
                                                {" "}/mo
                                            </span>
                                        )}
                                    </h3>

                                    {/* Description */}
                                    <p style={{
                                        fontSize: 13,
                                        color: isPopular ? "#71717a" : "#a1a1aa",
                                        fontWeight: 400,
                                        margin: "0 0 14px",
                                        lineHeight: 1.55,
                                        minHeight: 34,
                                    }}>
                                        {tier.description}
                                    </p>

                                    {/* Free forever badge */}
                                    {tier.price === 0 && (
                                        <span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 5,
                                            marginBottom: 16,
                                            fontSize: 10.5,
                                            fontWeight: 600,
                                            color: "#3f3f46",
                                            background: "#f4f4f5",
                                            border: "1px solid #d4d4d8",
                                            padding: "3px 10px",
                                            borderRadius: 999,
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                            width: "fit-content",
                                        }}>
                                            <span style={{ fontSize: 7 }}>●</span> Free forever
                                        </span>
                                    )}

                                    {/* Divider */}
                                    <div style={{
                                        height: 1,
                                        background: isPopular ? "#27272a" : "#f4f4f5",
                                        marginBottom: 20,
                                    }} />

                                    {/* Features */}
                                    <ul style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "0 0 24px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 10,
                                        flexGrow: 1,
                                    }}>
                                        {tier.features.map((feat, fi) => (
                                            <li
                                                key={feat}
                                                className="cp-feat"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 9,
                                                    animationDelay: `${fi * 50}ms`,
                                                }}
                                            >
                                                <div style={{
                                                    width: 19,
                                                    height: 19,
                                                    borderRadius: "50%",
                                                    background: isPopular ? "#1c1c1f" : accent.bg,
                                                    border: `1.5px solid ${isPopular ? "#3f3f46" : accent.border}`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}>
                                                    <Check
                                                        size={10}
                                                        color={isPopular ? "#ffffff" : accent.check}
                                                        strokeWidth={2.5}
                                                    />
                                                </div>
                                                <span style={{
                                                    fontSize: 13.5,
                                                    color: isPopular ? "#d4d4d8" : "#52525b",
                                                    fontWeight: 500,
                                                    lineHeight: 1.4,
                                                }}>
                                                    {feat}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        className={cn("cp-btn", isPopular ? "cp-btn-popular" : "cp-btn-default")}
                                        onClick={() => window.open("https://razorpay.com", "_blank")}
                                        style={{
                                            width: "100%",
                                            padding: "11px 20px",
                                            borderRadius: 10,
                                            border: isPopular ? "1.5px solid #ffffff" : "1.5px solid #d4d4d8",
                                            background: isPopular ? "#ffffff" : "#ffffff",
                                            color: isPopular ? "#09090b" : "#3f3f46",
                                            fontSize: 13.5,
                                            fontWeight: 600,
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        {tier.price === 0 ? "Start for Free" : "Get Started"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <p
                        className="cp-footer"
                        style={{
                            textAlign: "center",
                            marginTop: 36,
                            fontSize: 12,
                            color: "#a1a1aa",
                            fontWeight: 400,
                        }}
                    >
                        No credit card required · Cancel anytime · SSL encryption on all plans
                    </p>

                </div>
            </section>
        </>
    );
}

export { CreativePricing };