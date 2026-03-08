import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT = {
    zinc: "#3f3f46",
    indigo: "#4f46e5",
    purple: "#7c3aed",
    amber: "#d97706",
    blue: "#2563eb",
};

function CreativePricing({
    tag = "Simple Pricing",
    title = "Cloud storage with an AI brain",
    description = "Intelligent, private, and beautifully simple — starting at $0",
    tiers,
}) {
    return (
        <section
            id="pricing"
            className="w-full bg-white pt-24 pb-20 border-t-2 border-zinc-100 flex flex-col items-center"
        >
            <div className="w-full max-w-5xl mx-auto px-8 flex flex-col items-center">

                {/* ─── Header ─────────────────────────────────────────── */}
                <div className="text-center mb-16 flex flex-col items-center gap-3">
                    <p
                        className="text-indigo-500 font-bold text-[10px] tracking-[0.3em] uppercase"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        {tag}
                    </p>
                    <h2
                        className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        {title}
                    </h2>
                    <p
                        className="text-zinc-500 text-base font-medium leading-relaxed max-w-sm"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        {description}
                    </p>
                </div>

                {/* ─── Cards ──────────────────────────────────────────── */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-7">
                    {tiers.map((tier, index) => {
                        const isPopular = tier.popular;
                        const color = ACCENT[tier.color] ?? ACCENT.indigo;
                        const tilt = ["rotate-[-0.3deg]", "rotate-[0.4deg]", "rotate-[-0.2deg]"][index] ?? "";

                        return (
                            <div key={tier.name} className={cn("relative group", tilt)}>

                                {/* offset shadow */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-zinc-900 translate-x-[7px] translate-y-[7px] transition-transform duration-500 group-hover:translate-x-[11px] group-hover:translate-y-[11px]" />

                                {/* card */}
                                <div className="relative rounded-3xl border-2 border-zinc-900 bg-white flex flex-col items-center text-center px-8 pt-10 pb-8 gap-0 transition-transform duration-500 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]">

                                    {/* ── Popular badge ── */}
                                    {isPopular && (
                                        <span
                                            className="absolute -top-4 right-6 rotate-3 inline-block bg-amber-400 text-zinc-900 font-black text-[9px] px-3 py-1.5 rounded-full border-2 border-zinc-900 uppercase tracking-widest shadow-sm"
                                            style={{ fontFamily: "'Syne', sans-serif" }}
                                        >
                                            Popular
                                        </span>
                                    )}

                                    {/* ── Name ── */}
                                    <h3
                                        className="text-2xl font-black text-zinc-900 tracking-tight leading-none mb-2"
                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                    >
                                        {tier.name}
                                    </h3>

                                    {/* ── Description ── */}
                                    <p
                                        className="text-zinc-400 text-[13px] font-medium leading-snug max-w-[180px] mb-7"
                                        style={{ fontFamily: "'Inter', sans-serif" }}
                                    >
                                        {tier.description}
                                    </p>

                                    {/* ── Divider ── */}
                                    <div className="w-full h-px bg-zinc-100 mb-7" />

                                    {/* ── Price ── */}
                                    <div className="flex flex-col items-center mb-9">
                                        <div className="flex items-baseline gap-1">
                                            <span
                                                className="text-5xl font-black tracking-tighter text-zinc-900 leading-none"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                {tier.price === 0 ? "Free" : `$${tier.price}`}
                                            </span>
                                            {tier.price > 0 && (
                                                <span
                                                    className="text-zinc-400 text-sm font-semibold"
                                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                                >
                                                    /mo
                                                </span>
                                            )}
                                        </div>
                                        {tier.price === 0 && (
                                            <span
                                                className="mt-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                ● Free Forever
                                            </span>
                                        )}
                                    </div>

                                    {/* ── Features ── */}
                                    <ul
                                        className="w-full flex flex-col gap-5 text-left mb-10"
                                        style={{ fontFamily: "'Inter', sans-serif" }}
                                    >
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <div
                                                    className="mt-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
                                                    style={{ background: `${color}18`, border: `1.5px solid ${color}50` }}
                                                >
                                                    <Check className="w-2.5 h-2.5" style={{ color }} strokeWidth={3} />
                                                </div>
                                                <span className="text-[13px] text-zinc-600 font-semibold leading-snug">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* ── CTA ── */}
                                    <button
                                        className={cn(
                                            "px-10 py-2.5 rounded-xl border-2 border-zinc-900 font-black text-[13px] transition-all duration-300",
                                            "shadow-[3px_3px_0_0_#18181b] hover:shadow-[5px_5px_0_0_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5",
                                            isPopular
                                                ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
                                                : "bg-white text-zinc-900 hover:bg-zinc-900 hover:text-white"
                                        )}
                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                    >
                                        {tier.price === 0 ? "Start for Free" : "Get Started"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ─── Footer ─────────────────────────────────────────── */}
                <p
                    className="mt-10 text-zinc-400 text-[11px] font-medium"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    No credit card required · Cancel anytime
                </p>
            </div>
        </section>
    );
}

export { CreativePricing };
