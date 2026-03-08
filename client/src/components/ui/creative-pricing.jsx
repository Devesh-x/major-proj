import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Colour map kept explicit so Tailwind doesn't purge dynamic classes
const COLOR_MAP = {
    zinc: { icon: "#3f3f46", bg: "#f4f4f5", ring: "#d4d4d8" },
    indigo: { icon: "#4f46e5", bg: "#eef2ff", ring: "#c7d2fe" },
    purple: { icon: "#7c3aed", bg: "#f5f3ff", ring: "#ddd6fe" },
    amber: { icon: "#d97706", bg: "#fffbeb", ring: "#fde68a" },
};

function TierCard({ tier, index }) {
    const colors = COLOR_MAP[tier.color] ?? COLOR_MAP.zinc;
    const isPopular = tier.popular;

    const rotations = ["rotate-[-0.6deg]", "rotate-[0.4deg]", "rotate-[-0.8deg]"];
    const rotation = rotations[index] ?? "";

    return (
        <div className={cn("relative group cursor-default", rotation, "transition-all duration-300 ease-out")}>
            {/* Offset shadow layer */}
            <div
                className={cn(
                    "absolute inset-0 rounded-2xl transition-all duration-300",
                    isPopular
                        ? "bg-zinc-900 translate-x-[6px] translate-y-[6px] group-hover:translate-x-[9px] group-hover:translate-y-[9px]"
                        : "bg-zinc-300 translate-x-[5px] translate-y-[5px] group-hover:translate-x-[8px] group-hover:translate-y-[8px]"
                )}
            />

            {/* Card body */}
            <div
                className={cn(
                    "relative border-2 border-zinc-900 rounded-2xl p-8 bg-white",
                    "transition-all duration-300",
                    "group-hover:translate-x-[-3px] group-hover:translate-y-[-3px]"
                )}
            >
                {/* Popular badge */}
                {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="bg-amber-400 text-zinc-900 text-[10px] font-black px-4 py-1 rounded-full border-2 border-zinc-900 uppercase tracking-widest shadow-sm whitespace-nowrap">
                            ✨ Most Popular
                        </span>
                    </div>
                )}

                {/* Icon + name + desc */}
                <div className="mb-6">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border-2"
                        style={{
                            backgroundColor: colors.bg,
                            borderColor: colors.ring,
                            color: colors.icon,
                        }}
                    >
                        {tier.icon}
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-none">
                        {tier.name}
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
                        {tier.description}
                    </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-end gap-1">
                        <span className="text-5xl font-black text-zinc-900 tracking-tighter leading-none">
                            {typeof tier.price === "number"
                                ? tier.price === 0 ? "Free" : `$${tier.price}`
                                : tier.price}
                        </span>
                        {typeof tier.price === "number" && tier.price > 0 && (
                            <span className="text-zinc-400 text-sm font-medium mb-1.5">/month</span>
                        )}
                    </div>
                    {tier.price === 0 && (
                        <p className="text-zinc-400 text-xs mt-1">No credit card required</p>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t-2 border-dashed border-zinc-200 mb-6" />

                {/* Features */}
                <ul className="space-y-3.5 mb-8">
                    {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                            <div
                                className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 border-2"
                                style={{ backgroundColor: colors.bg, borderColor: colors.ring }}
                            >
                                <Check className="w-2.5 h-2.5" style={{ color: colors.icon }} strokeWidth={3.5} />
                            </div>
                            <span className="text-sm font-medium text-zinc-700">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <button
                    className={cn(
                        "w-full h-12 rounded-xl text-sm font-bold border-2 border-zinc-900",
                        "flex items-center justify-center gap-2",
                        "transition-all duration-200",
                        "shadow-[3px_3px_0px_0px] shadow-zinc-900",
                        "hover:shadow-[5px_5px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]",
                        isPopular
                            ? "bg-zinc-900 text-white hover:bg-zinc-800"
                            : "bg-white text-zinc-900 hover:bg-zinc-50"
                    )}
                >
                    {tier.price === 0 ? "Start for Free" : "Get Started"}
                    <ArrowRight size={14} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

function CreativePricing({
    tag = "Simple Pricing",
    title = "Storage that scales with you",
    description = "From your first file to your ten-thousandth — CloudSense keeps it smart, secure, and searchable.",
    tiers,
}) {
    return (
        <section
            id="pricing"
            className="relative overflow-hidden"
            style={{ background: "linear-gradient(180deg, #fff 0%, #fafafa 100%)" }}
        >
            {/* Doodle decorations */}
            <div className="pointer-events-none select-none absolute inset-0 overflow-hidden" aria-hidden>
                <span className="absolute top-16 left-[6%] text-5xl opacity-10 rotate-12">✏️</span>
                <span className="absolute bottom-24 right-[5%] text-5xl opacity-10 -rotate-6">✎</span>
                <span className="absolute top-1/2 right-[8%] text-3xl opacity-10 rotate-45">★</span>
                <span className="absolute top-1/3 left-[3%] text-2xl opacity-10 -rotate-12">✦</span>
            </div>

            <div className="relative w-full max-w-6xl mx-auto px-4 py-28">

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                        {tag}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-[1.1] mb-4 rotate-[-0.5deg]">
                        {title}
                    </h2>
                    <p className="text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                    {tiers.map((tier, i) => (
                        <TierCard key={tier.name} tier={tier} index={i} />
                    ))}
                </div>

                {/* Bottom note */}
                <p className="text-center text-zinc-400 text-sm mt-14">
                    All plans include end-to-end encryption. Upgrade or downgrade anytime.
                </p>
            </div>
        </section>
    );
}

export { CreativePricing };

