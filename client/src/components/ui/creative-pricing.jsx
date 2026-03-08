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
            className="w-full bg-white overflow-hidden py-56 border-t border-zinc-100 flex flex-col items-center relative"
            id="pricing"
            style={{ fontFamily: "'Syne', 'Inter', sans-serif" }}
        >
            {/* Section container with max-width and centering */}
            <div className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center relative z-10">

                {/* Decorative emoji - top-left */}
                <div className="absolute top-0 left-[-8%] text-5xl select-none pointer-events-none opacity-20 hidden xl:block" aria-hidden>⭐</div>
                {/* Decorative emoji - top-right */}
                <div className="absolute top-10 right-[-8%] text-4xl select-none pointer-events-none opacity-20 hidden xl:block" aria-hidden>✨</div>

                {/* Header - Huge margin to clear any absolute positioning */}
                <div className="text-center mb-72 max-w-3xl flex flex-col items-center px-4 relative z-20">
                    <p className="text-indigo-600 font-bold text-sm mb-6 tracking-[0.25em] uppercase">
                        {tag}
                    </p>
                    <div className="relative inline-block">
                        <h2 className="text-4xl md:text-7xl font-extrabold text-zinc-900 tracking-tight leading-[1.2]">
                            {title}
                        </h2>
                        {/* Underline accent */}
                        <div className="mx-auto mt-6 w-56 h-3 bg-indigo-500/10 rounded-full blur-xl" />
                    </div>
                    <p className="mt-12 text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-2xl px-6">
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
                                    "relative group transition-all duration-500 w-full md:w-1/3 min-h-[820px]",
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
                                        "relative h-full rounded-[3rem] border-2 border-zinc-900 pt-32 pb-16 px-8 lg:px-12 mb-2 flex flex-col items-center text-center",
                                        "transition-all duration-500",
                                        "group-hover:translate-x-[-6px] group-hover:translate-y-[-6px]",
                                        "bg-white text-zinc-900 shadow-2xl shadow-zinc-100"
                                    )}
                                >
                                    {/* Popular badge - increased clearance */}
                                    {isPopular && (
                                        <div className="absolute top-[-40px] -right-4 rotate-12 z-20">
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
                                        className="w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 border-zinc-50 shadow-2xl shadow-zinc-200/40 mb-16 bg-white shrink-0 transform transition-transform duration-500 group-hover:scale-110"
                                        style={{ color: iconColor }}
                                    >
                                        <div className="w-12 h-12 flex items-center justify-center rounded-2xl" style={{ backgroundColor: `${iconColor}10` }}>
                                            {tier.icon}
                                        </div>
                                    </div>

                                    {/* Plan name */}
                                    <h3 className="text-4xl font-black text-zinc-900 leading-none tracking-tight mb-6 shrink-0">
                                        {tier.name}
                                    </h3>

                                    {/* Description - added fixed margin bottom */}
                                    <p className="text-zinc-500 text-base font-medium leading-relaxed mb-20 shrink-0 max-w-[240px]">
                                        {tier.description}
                                    </p>

                                    {/* Price section - MASSIVE clearance from description */}
                                    <div className="mb-20 shrink-0 flex flex-col items-center">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl lg:text-7xl font-black tracking-tighter leading-none text-zinc-900">
                                                {tier.price === 0 ? "Free" : `$${tier.price}`}
                                            </span>
                                            {tier.price > 0 && (
                                                <span className="text-zinc-400 text-xl font-bold tracking-tight">/mo</span>
                                            )}
                                        </div>
                                        {tier.price === 0 && (
                                            <div className="flex items-center gap-2 mt-8 py-1.5 px-5 bg-emerald-50 rounded-full border border-emerald-100">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-emerald-700 text-[10px] uppercase tracking-[0.2em] font-black">Free Forever</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features list - centered container */}
                                    <div className="w-full mb-16 flex-grow flex justify-center">
                                        <ul className="space-y-6 text-left inline-block">
                                            {tier.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-4 group/item">
                                                    <div
                                                        className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-zinc-100 bg-zinc-50 shadow-sm shrink-0 mt-0.5 transition-colors group-hover/item:border-zinc-200"
                                                    >
                                                        <Check className="w-4 h-4" style={{ color: iconColor }} strokeWidth={4} />
                                                    </div>
                                                    <span className="text-zinc-600 text-[1rem] font-medium leading-[1.3] pt-0.5">
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
                                                "w-full h-16 font-black text-lg lg:text-xl rounded-[1.5rem]",
                                                "border-2 border-zinc-900",
                                                "transition-all duration-300",
                                                "shadow-[8px_8px_0px_0px] shadow-zinc-900",
                                                "hover:shadow-[10px_10px_0px_0px]",
                                                "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                                                isPopular
                                                    ? "bg-amber-400 text-zinc-900 hover:bg-amber-300 active:bg-amber-400"
                                                    : "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-900"
                                            )}
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
                <p className="text-center text-zinc-400 text-sm mt-40 font-medium max-w-lg px-6 leading-loose opacity-70">
                    Prices include all applicable taxes. Pay monthly, cancel anytime. No credit card required to start on our free tier.
                </p>
            </div>
        </section>
    );
}

export { CreativePricing };
