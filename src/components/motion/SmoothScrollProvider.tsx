"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

/**
 * Mounts Lenis smooth scrolling for the whole document.
 * Honours prefers-reduced-motion: when set, native scrolling is left untouched.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduce]);

  return <>{children}</>;
}
