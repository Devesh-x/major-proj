import React from "react";
import { Check, Cloud, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// Color map - explicit for white-theme vibrancy
const COLOR_MAP = {
    zinc: "#3f3f46", // Darker zinc for contrast
    indigo: "#4f46e5", // Indigo-600
    purple: "#7c3aed", // Purple-600
    amber: "#d97706", // Amber-600
    blue: "#2563eb", // Blue-600
};

function CreativePricing({
    tag = "Simple Pricing",
    title = "Cloud storage with an AI brain",
    description = "Intelligent, private, and beautifully simple — starting at $0",
    tiers,
}) {
    return (
        <section
            className="w-full bg-white overflow-hidden py-64 border-t border-zinc-100 flex flex-col items-center relative"
            id="pricing"
        >
            {/* Section container with max-width and centering */}
            <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center relative z-10">

                {/* Decorative ornaments */}
                <div className="absolute top-0 left-[-4%] text-6xl select-none pointer-events-none opacity-20 hidden xl:block animate-bounce" aria-hidden>⭐</div>
                <div className="absolute top-20 right-[-4%] text-5xl select-none pointer-events-none opacity-20 hidden xl:block animate-pulse" aria-hidden>✨</div>

                {/* Header - Using padding instead of margin for guaranteed separation */}
                <div
                    className="text-center max-w-4xl flex flex-col items-center px-4 relative z-20"
                    style={{ paddingBottom: '320px' }}
                >
                    <p className="text-indigo-600 font-bold text-sm mb-6 tracking-[0.25em] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {tag}
                    </p>
                    <div className="relative inline-block mb-10">
                        <h2 className="text-5xl md:text-8xl font-black text-zinc-900 tracking-tighter leading-[1.1]" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {title}
                        </h2>
                        {/* Underline accent */}
                        <div className="mx-auto mt-10 w-72 h-4 bg-indigo-500/10 rounded-full blur-3xl" />
                    </div>
                    <p className="text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-3xl px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {description}
                    </p>
                </div>

                {/* Cards grid - centered flex container */}
                <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-16 lg:gap-24">
                    {tiers.map((tier, index) => {
                        const isPopular = tier.popular;
                        const iconColor = COLOR_MAP[tier.color] ?? COLOR_MAP.indigo;
                        const rotations = ["rotate-[-1deg]", "rotate-[1deg]", "rotate-[-1.5deg]"];
                        const rot = rotations[index] ?? "";

                        return (
                            <div
                                key={tier.name}
                                className={cn(
                                    "relative group transition-all duration-700 w-full md:w-1/3 min-h-[950px]",
                                    rot
                                )}
                            >
                                {/* Offset shadow layer */}
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-[4rem] border-2 border-zinc-900 bg-zinc-900/5 shadow-2xl",
                                        "transition-all duration-500",
                                        "translate-x-[20px] translate-y-[20px]",
                                        "group-hover:translate-x-[24px] group-hover:translate-y-[24px]"
                                    )}
                                />

                                {/* Card body */}
                                <div
                                    className={cn(
                                        "relative h-full rounded-[4rem] border-2 border-zinc-900 pt-36 pb-24 px-10 md:px-12 lg:px-16 flex flex-col items-center text-center",
                                        "transition-all duration-500 ease-out",
                                        "group-hover:translate-x-[-10px] group-hover:translate-y-[-10px]",
                                        "bg-white text-zinc-900 shadow-[0_0_80px_rgba(0,0,0,0.02)]"
                                    )}
                                >
                                    {/* Popular badge */}
                                    {isPopular && (
                                        <div className="absolute top-[-60px] -right-8 rotate-12 z-20">
                                            <span
                                                className="inline-block bg-amber-400 text-zinc-900 font-black text-[13px] px-12 py-6 rounded-full border-2 border-zinc-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] uppercase tracking-[0.3em] whitespace-nowrap"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                POPULAR CHOICE
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon container */}
                                    <div
                                        className="w-28 h-28 rounded-[3rem] flex items-center justify-center border-2 border-zinc-50 shadow-2xl shadow-zinc-200/40 mb-16 bg-white shrink-0 transform transition-transform duration-500 group-hover:scale-110"
                                        style={{ color: iconColor }}
                                    >
                                        <div className="w-16 h-16 flex items-center justify-center rounded-[2rem]" style={{ backgroundColor: `${iconColor}10` }}>
                                            {tier.icon}
                                        </div>
                                    </div>

                                    {/* Header info block */}
                                    <div className="mb-12 flex flex-col items-center gap-6">
                                        <h3 className="text-4xl md:text-5xl font-black text-zinc-900 leading-none tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                                            {tier.name}
                                        </h3>
                                        <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-[280px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            {tier.description}
                                        </p>
                                    </div>

                                    {/* Price section with massive gap top/bottom */}
                                    <div className="my-16 shrink-0 flex flex-col items-center relative">
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-7xl lg:text-9xl font-black tracking-tighter leading-none text-zinc-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                                                {tier.price === 0 ? "Free" : `$${tier.price}`}
                                            </span>
                                            {tier.price > 0 && (
                                                <span className="text-zinc-400 text-3xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>/mo</span>
                                            )}
                                        </div>
                                        {tier.price === 0 && (
                                            <div className="flex items-center gap-4 mt-10 py-3 px-8 bg-emerald-50 rounded-full border-2 border-emerald-100 shadow-sm transition-transform hover:scale-105">
                                                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                                <span className="text-emerald-700 text-[12px] lg:text-[13px] uppercase tracking-[0.3em] font-black" style={{ fontFamily: "'Syne', sans-serif" }}>Free Forever</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features list */}
                                    <div className="w-full mb-20 flex-grow flex justify-center items-center">
                                        <ul className="space-y-10 text-left inline-block" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            {tier.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-7 group/item">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-zinc-100 bg-zinc-50 shadow-sm shrink-0 transition-all duration-300 group-hover/item:border-zinc-400 group-hover/item:scale-110"
                                                    >
                                                        <Check className="w-5 h-5" style={{ color: iconColor }} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-zinc-700 text-[1.2rem] font-bold leading-snug tracking-tight">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="w-full mt-auto shrink-0 pt-10">
                                        <button
                                            className={cn(
                                                "w-full h-24 font-black text-2xl lg:text-3xl rounded-[2.5rem]",
                                                "border-2 border-zinc-900",
                                                "transition-all duration-500",
                                                "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
                                                "hover:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]",
                                                "hover:translate-x-[-5px] hover:translate-y-[-5px]",
                                                isPopular
                                                    ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
                                                    : "bg-white text-zinc-900 hover:bg-zinc-900 hover:text-white"
                                            )}
                                            style={{ fontFamily: "'Syne', sans-serif" }}
                                        >
                                            {tier.price === 0 ? "Start for Free" : "Get Started Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom note */}
                <p className="text-center text-zinc-400 text-base md:text-lg mt-56 font-medium max-w-3xl px-12 leading-loose opacity-50" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Prices include all applicable taxes. No hidden fees. AI analysis starts immediately. Pay monthly, cancel anytime. CloudSense is designed for your privacy and scale.
                </p>
            </div>
        </section>
    );
}

export { CreativePricing };
