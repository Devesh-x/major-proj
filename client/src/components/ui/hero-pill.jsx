import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function HeroPill({
    href,
    label,
    icon: Icon,
    announcement,
    className,
    isExternal = false,
}) {
    return (
        <motion.a
            href={href}
            target={isExternal ? "_blank" : undefined}
            className={cn(
                "group flex w-fit items-center gap-1.5 rounded-full",
                "bg-zinc-50 ring-1 ring-zinc-200/60 p-1 pr-3",
                "no-underline transition-all duration-500",
                "hover:ring-zinc-300 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10",
                "cursor-pointer",
                className
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className={cn(
                "rounded-full bg-indigo-600",
                "flex items-center justify-center min-h-[24px] min-w-[24px]",
                announcement ? "px-2.5 py-1" : "p-1.5",
                "group-hover:scale-105 transition-transform duration-500"
            )}>
                {Icon && <Icon size={13} className="text-white" strokeWidth={2.5} />}
                {announcement && (
                    <span className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                        {announcement}
                    </span>
                )}
            </div>
            <span className="text-xs font-medium text-zinc-600 sm:text-sm whitespace-nowrap tracking-tight ml-1">
                {label}
            </span>
            <svg
                width="14"
                height="14"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-zinc-300 group-hover:text-indigo-600 transition-all duration-500 group-hover:translate-x-0.5"
            >
                <path
                    d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
                    fill="currentColor"
                />
            </svg>
        </motion.a>
    )
}
