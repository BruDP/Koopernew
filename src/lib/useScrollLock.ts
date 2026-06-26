"use client";

import { useEffect } from "react";

/**
 * Locks page scroll while `active` is true. Toggles the `lenis-stopped`
 * class (globals.css sets overflow:hidden on `.lenis.lenis-stopped`) and
 * sets an inline overflow fallback for non-Lenis environments. Reverts on
 * deactivate or unmount.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.classList.add("lenis-stopped");
    html.style.overflow = "hidden";
    return () => {
      html.classList.remove("lenis-stopped");
      html.style.overflow = prevOverflow;
    };
  }, [active]);
}
