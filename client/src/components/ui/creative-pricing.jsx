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
            className="w-full bg-white overflow-hidden py-10 md:py-14 border-t border-zinc-100 flex flex-col items-center relative"
            id="pricing"
        >
            {/* Section container with max-width and centering */}
            <div className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center relative z-10">

                {/* Decorative ornaments - Subtle */}
                <div className="absolute top-0 left-0 text-3xl select-none pointer-events-none opacity-5 hidden xl:block animate-pulse" aria-hidden>⭐</div>
                <div className="absolute top-5 right-0 text-2xl select-none pointer-events-none opacity-5 hidden xl:block animate-pulse" aria-hidden>✨</div>

                {/* Header - Compact */}
                <div className="text-center mb-10 md:mb-14 max-w-2xl flex flex-col items-center px-4 relative z-20">
                    <p className="text-indigo-600 font-bold text-[10px] mb-2 tracking-[0.2em] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {tag}
                    </p>
                    <div className="relative inline-block">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {title}
                        </h2>
                        {/* Underline accent */}
                        <div className="mx-auto mt-2 w-20 h-1.5 bg-indigo-500/10 rounded-full blur-lg" />
                    </div>
                    <p className="mt-3 text-sm md:text-base text-zinc-500 font-medium leading-relaxed max-w-lg px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {description}
                    </p>
                </div>

                {/* Cards grid - centered flex container */}
                <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-6 lg:gap-8">
                    {tiers.map((tier, index) => {
                        const isPopular = tier.popular;
                        const iconColor = COLOR_MAP[tier.color] ?? COLOR_MAP.indigo;
                        const rotations = ["rotate-[-0.2deg]", "rotate-[0.2deg]", "rotate-[-0.3deg]"];
                        const rot = rotations[index] ?? "";

                        return (
                            <div
                                key={tier.name}
                                className={cn(
                                    "relative group transition-all duration-500 w-full md:w-1/3 min-h-[480px] lg:min-h-[540px]",
                                    rot
                                )}
                            >
                                {/* Offset shadow layer */}
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-[2.2rem] border-2 border-zinc-900 bg-zinc-900/5 transition-all duration-500",
                                        "translate-x-[5px] translate-y-[5px] group-hover:translate-x-[8px] group-hover:translate-y-[8px]"
                                    )}
                                />

                                {/* Card body */}
                                <div
                                    className={cn(
                                        "relative h-full rounded-[2.2rem] border-2 border-zinc-900 pt-16 pb-12 px-6 lg:px-8 flex flex-col items-center text-center transition-all duration-500",
                                        "bg-white text-zinc-900 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]"
                                    )}
                                >
                                    {/* Popular badge - Integrated inside card padding */}
                                    {isPopular && (
                                        <div className="absolute top-4 -right-2 rotate-6 z-20">
                                            <span
                                                className="inline-block bg-amber-400 text-zinc-900 font-black text-[9px] px-3.5 py-1.5 rounded-full border-2 border-zinc-900 shadow-md uppercase tracking-[0.1em] whitespace-nowrap"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                Popular choice
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon - Increased bottom margin */}
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-zinc-50 shadow-md mb-8 bg-white shrink-0 transform transition-transform group-hover:scale-110"
                                        style={{ color: iconColor }}
                                    >
                                        <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${iconColor}10` }}>
                                            {tier.icon}
                                        </div>
                                    </div>

                                    {/* Plan name - Increased bottom margin */}
                                    <h3 className="text-2xl lg:text-3xl font-black text-zinc-900 leading-none tracking-tight mb-4 shrink-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                                        {tier.name}
                                    </h3>

                                    {/* Description - Increased bottom margin */}
                                    <p className="text-zinc-500 text-[13px] font-medium leading-snug mb-8 shrink-0 max-w-[190px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {tier.description}
                                    </p>

                                    {/* Price section - Better distribution */}
                                    <div className="mb-10 shrink-0 flex flex-col items-center">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-4xl lg:text-5xl font-black tracking-tighter leading-none text-zinc-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                                                {tier.price === 0 ? "Free" : `$${tier.price}`}
                                            </span>
                                            {tier.price > 0 && (
                                                <span className="text-zinc-400 text-xs font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>/mo</span>
                                            )}
                                        </div>
                                        {tier.price === 0 && (
                                            <div className="flex items-center gap-1 mt-2 py-0.5 px-3 bg-emerald-50 rounded-full border border-emerald-100">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                <span className="text-emerald-700 text-[8px] uppercase tracking-[0.1em] font-black" style={{ fontFamily: "'Syne', sans-serif" }}>Free Forever</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features list - Spread out more */}
                                    <div className="w-full mb-10 flex-grow flex justify-center items-center">
                                        <ul className="space-y-3.5 text-left inline-block" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            {tier.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded-full flex items-center justify-center border-2 border-zinc-100 bg-zinc-50 shrink-0">
                                                        <Check className="w-2.5 h-2.5" style={{ color: iconColor }} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-zinc-700 text-[0.8rem] lg:text-[0.85rem] font-bold leading-tight tracking-tight">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA Button - Narrower and smaller weight */}
                                    <div className="w-full mt-auto shrink-0 px-4">
                                        <button
                                            className={cn(
                                                "w-full h-10 font-black text-xs lg:text-[13px] rounded-xl border-2 border-zinc-900 transition-all duration-300 shadow-[3px_3px_0px_0px] shadow-zinc-900 hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-1px] hover:translate-y-[-1px] mx-auto",
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
                <p className="text-center text-zinc-400 text-[10px] mt-8 font-medium max-w-sm px-6 leading-relaxed opacity-50" style={{ fontFamily: "'Inter', sans-serif" }}>
                    No credit card required. Cancel anytime.
                </p>
            </div>
        </section>
    );
}

export { CreativePricing };
