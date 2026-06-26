"use client";

import { useReducedMotion } from "motion/react";

export function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const content = [...items, ...items]; // duplicated for seamless -50% loop

  return (
    <div className="group relative overflow-hidden border-y border-border bg-muted/30 py-4">
      <div
        className={`flex w-max items-center gap-8 ${
          reduce ? "" : "animate-[marquee_30s_linear_infinite] group-hover:[animation-duration:12s]"
        }`}
      >
        {content.map((label, i) => (
          <span key={i} className="flex items-center gap-8 font-mono text-sm uppercase tracking-wider text-muted-foreground">
            {label} <span className="text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
