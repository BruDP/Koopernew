"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** vertical offset to travel from, in px */
  y?: number;
  delay?: number;
  /** render as an inline element (e.g. for words) */
  as?: "div" | "span" | "li";
};

/** Fade + rise into view once, on scroll. No-ops under reduced motion. */
export function Reveal({ children, className, y = 24, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE.flow, delay }}
    >
      {children}
    </MotionTag>
  );
}
