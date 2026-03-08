import React from "react";
import { Check, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

function CreativePricing({
    tag = "Pricing",
    title = "Simple, transparent pricing",
    description = "Start free. Scale when you need to. No surprises.",
    tiers,
}) {
    return (
        <section id="pricing" className="bg-white border-t border-zinc-100">
            <div className="max-w-6xl mx-auto px-6 py-28">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 mb-4">
                        {tag}
                    </span>
                    <h2 className="text-4xl md:text-[3.2rem] font-extrabold text-zinc-900 tracking-tight leading-[1.1] mb-5">
                        {title}
                    </h2>
                    <p className="text-lg text-zinc-500 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Tier grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {tiers.map((tier) => {
                        const isPopular = tier.popular;
                        return (
                            <div
                                key={tier.name}
                                className={cn(
                                    "relative flex flex-col rounded-2xl p-8 transition-shadow duration-300",
                                    isPopular
                                        ? "bg-zinc-900 text-white shadow-2xl shadow-zinc-900/30 ring-1 ring-zinc-900"
                                        : "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:shadow-lg hover:shadow-zinc-100"
                                )}
                            >
                                {/* Popular badge */}
                                {isPopular && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md shadow-indigo-600/40">
                                            <Zap size={9} fill="currentColor" />
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Plan header */}
                                <div className="mb-8">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center mb-5",
                                            isPopular ? "bg-white/10" : "bg-zinc-100"
                                        )}
                                        style={{ color: isPopular ? "#fff" : "#4f46e5" }}
                                    >
                                        {tier.icon}
                                    </div>
                                    <h3 className={cn("text-lg font-black tracking-tight mb-1", isPopular ? "text-white" : "text-zinc-900")}>
                                        {tier.name}
                                    </h3>
                                    <p className={cn("text-sm leading-relaxed", isPopular ? "text-zinc-400" : "text-zinc-500")}>
                                        {tier.description}
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="mb-8">
                                    <div className="flex items-end gap-1.5">
                                        <span className={cn("text-5xl font-black tracking-tighter leading-none", isPopular ? "text-white" : "text-zinc-900")}>
                                            {typeof tier.price === "number"
                                                ? tier.price === 0 ? "Free" : `$${tier.price}`
                                                : tier.price}
                                        </span>
                                        {typeof tier.price === "number" && tier.price > 0 && (
                                            <span className={cn("text-sm font-medium mb-1.5", isPopular ? "text-zinc-400" : "text-zinc-400")}>
                                                / month
                                            </span>
                                        )}
                                    </div>
                                    {tier.price === 0 && (
                                        <p className="text-xs mt-1.5 text-zinc-400">No credit card required</p>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className={cn("border-t mb-8", isPopular ? "border-white/10" : "border-zinc-100")} />

                                {/* Features */}
                                <ul className="space-y-4 mb-10 flex-1">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                                isPopular ? "bg-indigo-500/20" : "bg-indigo-50"
                                            )}>
                                                <Check
                                                    className="w-3 h-3"
                                                    style={{ color: isPopular ? "#a5b4fc" : "#4f46e5" }}
                                                    strokeWidth={3}
                                                />
                                            </div>
                                            <span className={cn("text-sm font-medium", isPopular ? "text-zinc-300" : "text-zinc-600")}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <button
                                    className={cn(
                                        "w-full rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2",
                                        "transition-all duration-200 group",
                                        isPopular
                                            ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
                                            : "bg-zinc-900 text-white hover:bg-zinc-700"
                                    )}
                                >
                                    {tier.price === 0 ? "Start for Free" : "Get Started"}
                                    <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer note */}
                <p className="text-center text-sm text-zinc-400 mt-12">
                    All plans include end-to-end encryption. Upgrade or cancel anytime.
                </p>
            </div>
        </section>
    );
}

export { CreativePricing };
