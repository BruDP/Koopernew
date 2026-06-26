"use client";

import { PageShutter } from "@/components/motion/PageShutter";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageShutter>{children}</PageShutter>;
}
