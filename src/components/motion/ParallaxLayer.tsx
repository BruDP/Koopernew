"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

type ParallaxLayerProps = {
  children: React.ReactNode;
  className?: string;
  /** total travel in px across the scroll range (positive = moves up on scroll) */
  distance?: number;
};

/** Translates its content vertically as it passes through the viewport. */
export function ParallaxLayer({ children, className, distance = 80 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
