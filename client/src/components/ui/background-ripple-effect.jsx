import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

const CELL_SIZE = 40;
const COLS = 54;
const ROWS = 14;

/* ─────────────────────────────────────────────────────────
   Single Cell — hooks at top-level ✓
   - Glows on hover  (blue-tinted fill + inner glow)
   - Animated by click-wave from parent
───────────────────────────────────────────────────────── */
const Cell = ({ colIdx, rowIdx, clickedCell }) => {
    const controls = useAnimation();
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (!clickedCell) return;

        const dist = Math.sqrt(
            Math.pow(clickedCell[0] - colIdx, 2) +
            Math.pow(clickedCell[1] - rowIdx, 2)
        );

        // Each cell fires after a delay proportional to its distance
        const delay = dist * 0.055;
        const peak = Math.max(0, 0.85 - dist * 0.07);   // closer = brighter

        if (peak <= 0) return;

        controls.start({
            opacity: [0, peak, peak * 0.5, 0],
            scale: [1, 1.08, 1.04, 1],
            transition: { delay, duration: 0.55 + dist * 0.02, ease: "easeOut" },
        });
    }, [clickedCell]); // eslint-disable-line

    return (
        <div
            style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                border: "1px solid rgba(0,0,0,0.055)",
                position: "relative",
                background: "transparent",
                flexShrink: 0,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* ── Hover glow layer ── */}
            <motion.div
                animate={{
                    opacity: hovered ? 1 : 0,
                    scale: hovered ? 1 : 0.85,
                }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(99, 102, 241, 0.10)",   // soft indigo tint
                    boxShadow: hovered
                        ? "inset 0 0 0 1px rgba(99,102,241,0.22), 0 0 10px 1px rgba(99,102,241,0.10)"
                        : "none",
                    borderRadius: 1,
                    pointerEvents: "none",
                }}
            />

            {/* ── Click-wave layer ── */}
            <motion.div
                initial={{ opacity: 0, scale: 1 }}
                animate={controls}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(99, 102, 241, 0.18)",
                    borderRadius: 2,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   Grid
───────────────────────────────────────────────────────── */
const Grid = ({ clickedCell, onCellClick }) => (
    <div style={{ display: "flex", flexDirection: "row", userSelect: "none" }}>
        {Array.from({ length: COLS }, (_, c) => (
            <div key={c} style={{ display: "flex", flexDirection: "column" }}>
                {Array.from({ length: ROWS }, (_, r) => (
                    <Cell
                        key={`${c}-${r}`}
                        colIdx={c}
                        rowIdx={r}
                        clickedCell={clickedCell}
                    />
                ))}
            </div>
        ))}
    </div>
);

/* ─────────────────────────────────────────────────────────
   Core — mouse tracking, click handling, mask & fade
───────────────────────────────────────────────────────── */
const BackgroundCellCore = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [clickedCell, setClickedCell] = useState(null);
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleClick = (e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const col = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const row = Math.floor((e.clientY - rect.top) / CELL_SIZE);
        setClickedCell(null);                   // reset first so same cell re-triggers
        requestAnimationFrame(() => setClickedCell([col, row]));
    };

    const maskR = 220;  // radial reveal radius around cursor

    return (
        /* Wrapper: sits in the top portion, fades to transparent by ~55% down */
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                /* Grid covers top 60% of hero, gradient fades it out by 80% */
                height: "80%",
                overflow: "hidden",
                cursor: "crosshair",
                /* Fade the whole grid layer to transparent towards bottom */
                maskImage: "linear-gradient(to bottom, black 0%, black 38%, transparent 85%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 38%, transparent 85%)",
            }}
        >
            {/* ── Cursor-reveal layer (brighter cells under cursor) ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    pointerEvents: "none",
                    maskImage: `radial-gradient(${maskR}px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
                    WebkitMaskImage: `radial-gradient(${maskR}px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
                }}
            >
                {/* semi-brighter version of grid shown under cursor */}
                <div style={{ opacity: 1.0 }}>
                    <Grid clickedCell={clickedCell} onCellClick={() => { }} />
                </div>
            </div>

            {/* ── Base grid layer (always visible, very faint) ── */}
            <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.7, pointerEvents: "none" }}>
                <Grid clickedCell={clickedCell} onCellClick={() => { }} />
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   Public export
───────────────────────────────────────────────────────── */
export const BackgroundCells = ({ children, style, className }) => (
    <div
        className={className}
        style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            background: "#ffffff",
            ...style,
        }}
    >
        <BackgroundCellCore />
        {children && (
            <div style={{ position: "relative", zIndex: 10, pointerEvents: "none", width: "100%" }}>
                {children}
            </div>
        )}
    </div>
);
