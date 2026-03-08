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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((tier, index) => {
                        const isPopular = tier.popular;
                        const iconColor = COLOR_MAP[tier.color] ?? COLOR_MAP.indigo;
                        const rotations = ["rotate-[-1deg]", "rotate-[1deg]", "rotate-[-1.5deg]"];
                        const rot = rotations[index] ?? "";

                        return (
                            <div
                                key={tier.name}
                                className={cn(
                                    "relative group transition-all duration-300",
                                    rot
                                )}
                            >
                                {/* Offset shadow layer */}
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-2xl border-2 border-zinc-900 bg-zinc-900",
                                        "transition-all duration-300",
                                        "translate-x-[5px] translate-y-[5px]",
                                        "group-hover:translate-x-[9px] group-hover:translate-y-[9px]"
                                    )}
                                />

                                {/* Card */}
                                <div
                                    className={cn(
                                        "relative rounded-2xl border-2 border-zinc-900 p-7",
                                        "transition-all duration-300",
                                        "group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]",
                                        "bg-zinc-900"  // dark card — matches reference image
                                    )}
                                >
                                    {/* Popular badge */}
                                    {isPopular && (
                                        <div className="absolute -top-4 -right-3 rotate-12 z-10">
                                            <span
                                                className="inline-block bg-amber-400 text-zinc-900 font-bold text-sm px-4 py-1.5 rounded-full border-2 border-zinc-900 shadow-md"
                                                style={{ fontFamily: "'Syne', sans-serif" }}
                                            >
                                                Popular!
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-zinc-700 mb-5"
                                        style={{ color: iconColor }}
                                    >
                                        {tier.icon}
                                    </div>

                                    {/* Plan name & description */}
                                    <h3 className="text-2xl font-bold text-white leading-tight tracking-tight mb-1">
                                        {tier.name}
                                    </h3>
                                    <p className="text-zinc-400 text-sm font-medium mb-6">
                                        {tier.description}
                                    </p>

                                    {/* Price */}
                                    <div className="mb-6 flex items-end gap-1">
                                        <span className="text-5xl font-extrabold text-white tracking-tighter leading-none">
                                            {typeof tier.price === "number"
                                                ? tier.price === 0 ? "Free" : `$${tier.price}`
                                                : tier.price}
                                        </span>
                                        {typeof tier.price === "number" && tier.price > 0 && (
                                            <span className="text-zinc-400 text-sm font-semibold mb-1.5">/month</span>
                                        )}
                                        {tier.price === 0 && (
                                            <span className="text-zinc-400 text-sm font-semibold mb-1.5">forever</span>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3.5 mb-8">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-3">
                                                <div
                                                    className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-600 shrink-0"
                                                    style={{ color: iconColor }}
                                                >
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span className="text-zinc-200 text-[0.95rem] font-medium">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <button
                                        className={cn(
                                            "w-full h-12 font-bold text-base rounded-xl",
                                            "border-2 border-zinc-700",
                                            "transition-all duration-300",
                                            "shadow-[4px_4px_0px_0px] shadow-zinc-700",
                                            "hover:shadow-[6px_6px_0px_0px]",
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
