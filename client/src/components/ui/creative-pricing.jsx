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
            className="w-full bg-white overflow-hidden py-32 md:py-48 border-t border-zinc-100 flex flex-col items-center relative"
            id="pricing"
        >
            {/* Display font applied specifically to headings and prices */}

            {/* Section container with max-width and centering */}
            <div className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center relative z-10">

                {/* Decorative emoji - top-left */}
                <div className="absolute top-0 left-[-8%] text-5xl select-none pointer-events-none opacity-20 hidden xl:block" aria-hidden>⭐</div>
                {/* Decorative emoji - top-right */}
                <div className="absolute top-10 right-[-8%] text-4xl select-none pointer-events-none opacity-20 hidden xl:block" aria-hidden>✨</div>

                {/* Header */}
                <div className="text-center mb-24 md:mb-40 max-w-3xl flex flex-col items-center px-4 relative z-20">
                    <p className="text-indigo-600 font-bold text-sm mb-6 tracking-[0.25em] uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {tag}
                    </p>
                    <div className="relative inline-block">
                        <h2 className="text-4xl md:text-7xl font-extrabold text-zinc-900 tracking-tight leading-[1.2]" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {title}
                        </h2>
                        {/* Underline accent */}
                        <div className="mx-auto mt-6 w-56 h-3 bg-indigo-500/10 rounded-full blur-xl" />
                    </div>
                    <p className="mt-10 text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-2xl px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {description}
                    </p>
                </div>

                {/* Cards grid - centered flex container */}
                <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-12 lg:gap-16">
                    {tiers.map((tier, index) => {
                        const isPopular = tier.popular;
                        const iconColor = COLOR_MAP[tier.color] ?? COLOR_MAP.indigo;
                        const rotations = ["rotate-[-0.5deg]", "rotate-[0.5deg]", "rotate-[-1deg]"];
                        const rot = rotations[index] ?? "";

                        return (
                            <div
                                key={tier.name}
                                className={cn(
                                    "relative group transition-all duration-500 w-full md:w-1/3 h-auto",
                                    rot
                                )}
                            >
                                {/* Offset shadow layer */}
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-[3rem] border-2 border-zinc-900 bg-zinc-900",
                                        "transition-all duration-500",
                                        "translate-x-[12px] translate-y-[12px]",
                                        "group-hover:translate-x-[16px] group-hover:translate-y-[16px]"
                                    )}
                                />

                                {/* Card body */}
                                <div
                                    className={cn(
                                        "relative h-full rounded-[3rem] border-2 border-zinc-900 pt-20 pb-16 px-8 lg:px-12 flex flex-col items-center text-center",
                                        "transition-all duration-500",
                                        "group-hover:translate-x-[-6px] group-hover:translate-y-[-6px]",
                                        "bg-white text-zinc-900 shadow-2xl shadow-zinc-100"
                                    )}
                                >
                                    {/* Popular badge */}
                                    {isPopular && (
                                        <div className="absolute top-[-25px] -right-4 rotate-12 z-20">
                                            <span
                                                className="inline-block bg-amber-400 text-zinc-900 font-black text-[11px] px-8 py-3.5 rounded-full border-2 border-zinc-900 shadow-2xl uppercase tracking-[0.2em] whitespace-nowrap"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                Popular choice
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div
                                        className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 border-zinc-50 shadow-xl shadow-zinc-200/40 mb-10 bg-white shrink-0 transform transition-transform duration-500 group-hover:scale-110"
                                        style={{ color: iconColor }}
                                    >
                                        <div className="w-10 h-10 flex items-center justify-center rounded-2xl" style={{ backgroundColor: `${iconColor}10` }}>
                                            {tier.icon}
                                        </div>
                                    </div>

                                    {/* Plan name */}
                                    <h3 className="text-4xl font-black text-zinc-900 leading-none tracking-tight mb-4 shrink-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                                        {tier.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-zinc-500 text-sm md:text-base font-medium leading-relaxed mb-10 shrink-0 max-w-[240px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {tier.description}
                                    </p>

                                    {/* Price section */}
                                    <div className="mb-12 shrink-0 flex flex-col items-center">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl lg:text-6xl font-black tracking-tighter leading-none text-zinc-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                                                {tier.price === 0 ? "Free" : `$${tier.price}`}
                                            </span>
                                            {tier.price > 0 && (
                                                <span className="text-zinc-400 text-lg font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>/mo</span>
                                            )}
                                        </div>
                                        {tier.price === 0 && (
                                            <div className="flex items-center gap-2 mt-4 py-1.5 px-5 lg:px-6 bg-emerald-50 rounded-full border border-emerald-100">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-emerald-700 text-[10px] lg:text-[11px] uppercase tracking-[0.2em] font-black" style={{ fontFamily: "'Syne', sans-serif" }}>Free Forever</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features list - Using Inter for max legibility and font-bold for polish */}
                                    <div className="w-full mb-12 flex-grow flex justify-center">
                                        <ul className="space-y-4 text-left inline-block" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            {tier.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-4 group/item">
                                                    <div
                                                        className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-100 bg-zinc-50 shadow-sm shrink-0 transition-colors group-hover/item:border-zinc-200"
                                                    >
                                                        <Check className="w-3 h-3" style={{ color: iconColor }} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-zinc-700 text-[0.95rem] font-bold leading-tight tracking-tight">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="w-full mt-auto shrink-0">
                                        <button
                                            className={cn(
                                                "w-full h-16 font-black text-lg rounded-[1.5rem]",
                                                "border-2 border-zinc-900",
                                                "transition-all duration-300",
                                                "shadow-[6px_6px_0px_0px] shadow-zinc-900",
                                                "hover:shadow-[10px_10px_0px_0px]",
                                                "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                                                isPopular
                                                    ? "bg-amber-400 text-zinc-900 hover:bg-amber-300 active:bg-amber-400"
                                                    : "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-900"
                                            )}
                                            style={{ fontFamily: "'Syne', sans-serif" }}
                                        >
                                            {tier.price === 0 ? "Start for Free" : "Get Started"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom note */}
                <p className="text-center text-zinc-400 text-xs sm:text-sm mt-32 font-medium max-w-lg px-6 leading-loose opacity-70" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Prices include all applicable taxes. Pay monthly, cancel anytime. No credit card required to start on our free tier.
                </p>
            </div>
        </section>
    );
}

export { CreativePricing };
