"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE, DUR } from "@/lib/motion";

export function PageShutter({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)", y: 24 }}
      animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
      transition={{ duration: DUR.slow, ease: EASE.snap }}
      className="relative"
    >
      <motion.span
        aria-hidden
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: DUR.slow, ease: EASE.snap }}
        className="pointer-events-none absolute left-0 top-0 z-50 h-[3px] w-full origin-left bg-accent"
      />
      {children}
    </motion.div>
  );
}
