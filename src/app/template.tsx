"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE, DUR } from "@/lib/motion";

/**
 * App Router template — remounts on every navigation, so it gives each
 * route a subtle enter transition. Disabled under reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.slow, ease: EASE.flow }}
    >
      {children}
    </motion.div>
  );
}
