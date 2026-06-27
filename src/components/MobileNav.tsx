"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import categoriesData from "../data/categories.json";
import { useScrollLock } from "@/lib/useScrollLock";

const STATIC_LINKS = [
  { href: "/kooperx", label: "KooperX" },
  { href: "/azienda", label: "Azienda" },
  { href: "/assistenza", label: "Assistenza" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  useScrollLock(open);

  // Close on route change
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Escape to close + focus close button on open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const linkClass =
    "flex items-center min-h-[48px] text-foreground text-lg font-medium transition-colors hover:text-brand";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 md:hidden" initial={false}>
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.aside
            className="absolute right-0 top-0 h-full w-full max-w-[20rem] bg-background border-l border-border shadow-2xl flex flex-col overflow-y-auto"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Menu
              </span>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Chiudi menu"
                className="grid place-items-center min-h-[44px] min-w-[44px] rounded-full hover:bg-muted text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col p-4">
              <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2">
                Categorie
              </span>
              <ul className="mb-4 border-b border-border pb-2">
                {categoriesData.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/categoria/${cat.slug}`} className={linkClass} onClick={onClose}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {STATIC_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass} onClick={onClose}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
