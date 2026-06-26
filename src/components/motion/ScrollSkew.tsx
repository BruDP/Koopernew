"use client";

import { motion, useScroll, useVelocity, useTransform, useSpring, useReducedMotion } from "motion/react";
import { velocityToSkew } from "@/lib/motion";

export function ScrollSkew({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 400, damping: 50, mass: 0.5 });
  const skew = useTransform(smooth, (v) => velocityToSkew(v));

  if (reduce) return <>{children}</>;

  return (
    <motion.div style={{ skewY: skew }} className="will-change-transform">
      {children}
    </motion.div>
  );
}
