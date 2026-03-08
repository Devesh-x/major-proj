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
            className="w-full bg-white overflow-hidden py-32 border-t border-zinc-100 flex flex-col items-center relative"
            id="pricing"
            style={{ fontFamily: "'Syne', 'Inter', sans-serif" }}
        >
            {/* Section container with max-width and centering */}
            <div className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center relative z-10">

                {/* Decorative emoji - top-left */}
                <div className="absolute top-0 left-[-5%] text-5xl select-none pointer-events-none opacity-20 hidden xl:block" aria-hidden>⭐</div>
                {/* Decorative emoji - top-right */}
                <div className="absolute top-10 right-[-5%] text-4xl select-none pointer-events-none opacity-20 hidden xl:block" aria-hidden>✨</div>

                {/* Header */}
                <div className="text-center mb-24 max-w-3xl flex flex-col items-center">
                    <p className="text-indigo-600 font-bold text-sm mb-4 tracking-[0.2em] uppercase">
                        {tag}
                    </p>
                    <div className="relative inline-block">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.1]">
                            {title}
                        </h2>
                        {/* Underline accent */}
                        <div className="mx-auto mt-4 w-48 h-2 bg-indigo-500/10 rounded-full blur-sm" />
                    </div>
                    <p className="mt-8 text-xl text-zinc-500 font-medium leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Cards grid - centered flex container */}
                <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-8 lg:gap-10">
                    {tiers.map((tier, index) => {
                        const isPopular = tier.popular;
                        const iconColor = COLOR_MAP[tier.color] ?? COLOR_MAP.indigo;
                        const rotations = ["rotate-[-0.5deg]", "rotate-[0.5deg]", "rotate-[-1deg]"];
                        const rot = rotations[index] ?? "";

                        return (
                            <div
                                key={tier.name}
                                className={cn(
                                    "relative group transition-all duration-500 w-full md:w-1/3 min-h-[620px]",
                                    rot
                                )}
                            >
                                {/* Offset shadow layer */}
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-3xl border-2 border-zinc-900 bg-zinc-900",
                                        "transition-all duration-300",
                                        "translate-x-[8px] translate-y-[8px]",
                                        "group-hover:translate-x-[12px] group-hover:translate-y-[12px]"
                                    )}
                                />

                                {/* Card body */}
                                <div
                                    className={cn(
                                        "relative h-full rounded-3xl border-2 border-zinc-900 p-10 lg:p-12 flex flex-col",
                                        "transition-all duration-300",
                                        "group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]",
                                        "bg-white text-zinc-900"
                                    )}
                                >
                                    {/* Popular badge */}
                                    {isPopular && (
                                        <div className="absolute -top-5 -right-5 rotate-12 z-20">
                                            <span
                                                className="inline-block bg-amber-400 text-zinc-900 font-bold text-xs px-6 py-2 rounded-full border-2 border-zinc-900 shadow-xl uppercase tracking-widest"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                Popular choice
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-white shadow-xl shadow-zinc-200/50 mb-8 bg-white"
                                        style={{ color: iconColor, borderColor: `${iconColor}20` }}
                                    >
                                        <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${iconColor}10` }}>
                                            {tier.icon}
                                        </div>
                                    </div>

                                    {/* Plan name & description */}
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-black text-zinc-900 leading-tight tracking-tight mb-3">
                                            {tier.name}
                                        </h3>
                                        <p className="text-zinc-500 text-base font-medium leading-relaxed">
                                            {tier.description}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-10">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-black tracking-tighter leading-none text-zinc-900">
                                                {tier.price === 0 ? "Free" : `$${tier.price}`}
                                            </span>
                                            {tier.price > 0 && (
                                                <span className="text-zinc-400 text-lg font-bold tracking-tight">/mo</span>
                                            )}
                                        </div>
                                        {tier.price === 0 && (
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <span className="text-zinc-400 text-xs uppercase tracking-[0.1em] font-black">Free Forever</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features list */}
                                    <ul className="space-y-5 mb-12 flex-grow">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-4 group/item">
                                                <div
                                                    className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-zinc-100 bg-zinc-50 shrink-0 mt-0.5 transition-colors group-hover/item:border-zinc-200"
                                                >
                                                    <Check className="w-3.5 h-3.5" style={{ color: iconColor }} strokeWidth={4} />
                                                </div>
                                                <span className="text-zinc-600 text-sm lg:text-base font-medium leading-[1.3]">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <div className="mt-auto">
                                        <button
                                            className={cn(
                                                "w-full h-14 font-black text-lg rounded-2xl",
                                                "border-2 border-zinc-900",
                                                "transition-all duration-300",
                                                "shadow-[6px_6px_0px_0px] shadow-zinc-900",
                                                "hover:shadow-[8px_8px_0px_0px]",
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
                <p className="text-center text-zinc-400 text-sm mt-16 font-medium">
                    Prices include all taxes. Pay monthly, cancel anytime. No credit card needed for Starter.
                </p>
            </div>
        </section>
    );
}

export { CreativePricing };
