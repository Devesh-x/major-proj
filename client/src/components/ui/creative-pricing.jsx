import React from "react";
import { Check, Cloud, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// Color map - explicit to avoid Tailwind purging dynamic classes
const COLOR_MAP = {
    zinc: "#71717a",
    indigo: "#818cf8",
    purple: "#a78bfa",
    amber: "#fbbf24",
    blue: "#60a5fa",
};

function CreativePricing({
    tag = "Simple Pricing",
    title = "Cloud storage that actually thinks",
    description = "AI-powered, private, and blazing-fast — starting free",
    tiers,
}) {
    return (
        <div
            className="w-full bg-white"
            style={{ fontFamily: "'Syne', 'Inter', sans-serif" }}
        >
            {/* Section wrapper */}
            <div className="relative w-full max-w-6xl mx-auto px-6 py-28" id="pricing">

                {/* Decorative emoji - top-left */}
                <span className="absolute top-10 left-6 text-5xl select-none pointer-events-none opacity-80" aria-hidden>⭐</span>
                {/* Decorative emoji - top-right */}
                <span className="absolute top-10 right-6 text-4xl select-none pointer-events-none opacity-80" aria-hidden>✨</span>

                {/* Header */}
                <div className="text-center mb-20">
                    <p className="text-indigo-500 font-semibold text-base mb-4 tracking-wide">
                        {tag}
                    </p>
                    <div className="relative inline-block">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                            {title}
                        </h2>
                        {/* Underline accent */}
                        <div className="mx-auto mt-3 w-40 h-1.5 bg-indigo-400/40 rounded-full blur-sm" />
                    </div>
                    <p className="mt-5 text-lg text-zinc-500 font-medium">
                        {description}
                    </p>
                </div>

                {/* Cards grid */}
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
                    {tiers.map((tier, index) => {
                        const isPopular = tier.popular;
                        const iconColor = COLOR_MAP[tier.color] ?? COLOR_MAP.indigo;
                        const rotations = ["rotate-[-1deg]", "rotate-[1deg]", "rotate-[-1.5deg]"];
                        const rot = rotations[index] ?? "";

                        return (
                            <div
                                key={tier.name}
                                className={cn(
                                    "relative group transition-all duration-300 w-full md:w-1/3 min-h-[580px]",
                                    rot
                                )}
                            >
                                {/* Offset shadow layer */}
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-2xl border-2 border-zinc-900 bg-zinc-900",
                                        "transition-all duration-300",
                                        "translate-x-[6px] translate-y-[6px]",
                                        "group-hover:translate-x-[10px] group-hover:translate-y-[10px]"
                                    )}
                                />

                                {/* Card */}
                                <div
                                    className={cn(
                                        "relative h-full rounded-2xl border-2 border-zinc-900 p-10 flex flex-col",
                                        "transition-all duration-300",
                                        "group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]",
                                        "bg-zinc-900 text-white"
                                    )}
                                >
                                    {/* Popular badge */}
                                    {isPopular && (
                                        <div className="absolute -top-5 -right-4 rotate-12 z-20">
                                            <span
                                                className="inline-block bg-amber-400 text-zinc-900 font-bold text-sm px-5 py-2 rounded-full border-2 border-zinc-900 shadow-md"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                Popular!
                                            </span>
                                        </div>
                                    )}

                                    {/* Top padding to account for badge if needed, though p-10 is plenty */}

                                    {/* Icon */}
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-zinc-700 mb-6 bg-zinc-800/50"
                                        style={{ color: iconColor }}
                                    >
                                        {tier.icon}
                                    </div>

                                    {/* Plan name & description */}
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-bold text-white leading-tight tracking-tight mb-2">
                                            {tier.name}
                                        </h3>
                                        <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                                            {tier.description}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-8 font-extrabold">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-6xl tracking-tighter leading-none">
                                                {typeof tier.price === "number"
                                                    ? tier.price === 0 ? "Free" : `$${tier.price}`
                                                    : tier.price}
                                            </span>
                                            {typeof tier.price === "number" && tier.price > 0 && (
                                                <span className="text-zinc-500 text-base font-semibold">/month</span>
                                            )}
                                        </div>
                                        {tier.price === 0 && (
                                            <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">Forever</p>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-4 mb-10 flex-grow">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-4">
                                                <div
                                                    className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-zinc-700 shrink-0 mt-0.5"
                                                    style={{ color: iconColor }}
                                                >
                                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                                </div>
                                                <span className="text-zinc-300 text-base font-medium">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <div className="mt-auto">
                                        <button
                                            className={cn(
                                                "w-full h-14 font-bold text-lg rounded-2xl",
                                                "border-2 border-zinc-700",
                                                "transition-all duration-300",
                                                "shadow-[6px_6px_0px_0px] shadow-zinc-800",
                                                "hover:shadow-[8px_8px_0px_0px]",
                                                "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                                                isPopular
                                                    ? "bg-amber-400 text-zinc-900 border-amber-500 shadow-amber-600/30 hover:bg-amber-300"
                                                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                                            )}
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer note */}
                <p className="text-center text-zinc-400 text-sm mt-14">
                    All plans include end-to-end encryption. Cancel or upgrade anytime.
                </p>
            </div>
        </div>
    );
}

export { CreativePricing };
