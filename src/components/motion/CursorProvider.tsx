"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { SPRING } from "@/lib/motion";

type CursorState = "default" | "link" | "cta" | "product";
const LABELS: Record<CursorState, string> = { default: "", link: "", cta: "Scopri", product: "Sfoglia" };

export function CursorProvider() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, SPRING.cursor);
  const ry = useSpring(y, SPRING.cursor);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-kinetic");

    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-cursor]");
      setState(((el?.getAttribute("data-cursor")) as CursorState) || "default");
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("cursor-kinetic");
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  const isActive = state === "cta" || state === "product";
  const label = LABELS[state];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <motion.div
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        className="absolute h-2 w-2 rounded-full bg-foreground"
      />
      <motion.div
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isActive ? 64 : 36,
          height: isActive ? 64 : 36,
          backgroundColor: state === "cta" ? "var(--accent)" : "rgba(0,0,0,0)",
          borderColor: state === "cta" ? "var(--accent)" : "var(--foreground)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute flex items-center justify-center rounded-full border"
      >
        {label && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent-foreground">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
