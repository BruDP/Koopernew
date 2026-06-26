/** Single source of truth for the site's motion language. */
export const EASE = {
  snap: [0.22, 1, 0.36, 1] as [number, number, number, number],
  flow: [0.16, 1, 0.3, 1] as [number, number, number, number],
  kick: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;

export const DUR = { fast: 0.15, base: 0.22, slow: 0.28 } as const;

export const SPRING = {
  cursor: { stiffness: 500, damping: 34, mass: 0.4 },
  magnetic: { stiffness: 200, damping: 16, mass: 0.1 },
} as const;

/** Maps a scroll velocity (px/s) to a clamped skew angle (deg). */
export function velocityToSkew(velocity: number, max = 1.2, factor = 0.0015): number {
  const raw = velocity * factor;
  return Math.max(-max, Math.min(max, raw));
}
