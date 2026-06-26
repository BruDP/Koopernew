# Kooper – Mobile-First Redesign + Apple-Style Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Kooper catalog mobile-first (full-height nav drawer, responsive hero, ≥44px touch targets, mobile-friendly category filters) and replace the product gallery with an Apple-style swipe-and-zoom gallery + fullscreen lightbox.

**Architecture:** Pages stay Server Components; all new interactivity lives in `"use client"` components (`MobileNav`, `ProductGallery`, `Lightbox`) and one shared hook (`useScrollLock`). Animations use `motion/react` (already a dependency) and only touch `transform`/`opacity`. Body scroll-lock for drawer and lightbox is centralized in `useScrollLock`, which toggles the `lenis-stopped` class that `globals.css` already wires to `overflow:hidden`.

**Tech Stack:** Next.js 16.2.9, React 19, Tailwind v4, motion/react v12, lucide-react, Lenis.

## Global Constraints

- Pages remain Server Components (`src/app/**`); interactivity isolated in `"use client"` components
- Animate only `transform` / `opacity` / `clip-path` — never layout-triggering properties
- Every animated component must respect `useReducedMotion()` — static, fully-functional fallback required
- All interactive touch targets ≥ 44px (`min-h-[44px]` / `min-w-[44px]`); nav drawer links `min-h-[48px]`
- No new npm packages
- Prices stay as-is — no cart/checkout/pricing changes
- Type-check: `npx tsc --noEmit` (from project root) → 0 errors
- Build: `npm run build` → 507 SSG pages, 0 errors
- After each task: `git add <explicit files> && git commit -m "..." && git push` (push auto-deploys to Vercel)

---

## File Map

| Status | Path | Responsibility |
|---|---|---|
| **new** | `src/lib/useScrollLock.ts` | Hook: lock body scroll while a `true` flag is active (drawer/lightbox) |
| **new** | `src/components/MobileNav.tsx` | Full-height mobile nav drawer + overlay + close logic |
| **modify** | `src/components/Header.tsx` | Remove inline mobile menu; render `<MobileNav>`; bump button hit areas |
| **modify** | `src/app/page.tsx` | Responsive hero typography, stats, floating image, section spacing |
| **modify** | `src/components/CategoryProducts.tsx` | Stack filter controls on mobile; ≥44px sort select |
| **new** | `src/components/Lightbox.tsx` | Fullscreen zoomable image viewer with nav |
| **modify** | `src/components/ProductGallery.tsx` | Rewrite: mobile swipe + pills, desktop thumbnails, opens Lightbox |

---

## Task 1: useScrollLock hook

**Files:**
- Create: `src/lib/useScrollLock.ts`

**Interfaces:**
- Produces: `export function useScrollLock(active: boolean): void` — while `active` is true, adds `lenis-stopped` class to `document.documentElement` and sets inline `overflow:hidden` as a fallback; reverts on `active=false` or unmount.

**Why no unit test:** This is a DOM-side-effect hook with no return value; it is verified via the components that consume it (manual/preview). Verification here is the type-check.

- [ ] **Step 1: Create `src/lib/useScrollLock.ts`**

```ts
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/useScrollLock.ts
git commit -m "feat: add useScrollLock hook for drawer/lightbox scroll lock"
git push
```

---

## Task 2: MobileNav drawer + Header refactor

**Files:**
- Create: `src/components/MobileNav.tsx`
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Consumes: `useScrollLock(active: boolean)` from `@/lib/useScrollLock`; `categoriesData` from `../data/categories.json`
- Produces: `export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element`

- [ ] **Step 1: Create `src/components/MobileNav.tsx`**

```tsx
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
```

- [ ] **Step 2: Refactor `src/components/Header.tsx` — remove inline mobile menu, render MobileNav**

Add import near the other imports:
```tsx
import { MobileNav } from "./MobileNav";
```

Remove the entire inline `{/* Mobile Menu */}` block (currently lines ~159-185 — the `{isMobileMenuOpen && (<div className="md:hidden ...">...</div>)}` block).

In its place (just before the closing `</header>` or right after it, inside the fragment), render:
```tsx
      <MobileNav open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
```

- [ ] **Step 3: Bump Header button hit areas to ≥44px**

In `Header.tsx`, the search button (currently `className="p-2 hover:bg-muted rounded-full transition-colors text-foreground"`) — change to:
```tsx
                className="grid place-items-center min-h-[44px] min-w-[44px] hover:bg-muted rounded-full transition-colors text-foreground"
```

The mobile toggle button (currently `className="md:hidden p-2 text-foreground"`) — change to:
```tsx
                className="md:hidden grid place-items-center min-h-[44px] min-w-[44px] text-foreground"
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `✓ Generating static pages (507/507)`, 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/MobileNav.tsx src/components/Header.tsx
git commit -m "feat: mobile nav drawer with overlay, scroll-lock, 44px targets"
git push
```

---

## Task 3: Responsive hero + section spacing (page.tsx)

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:** None new — Tailwind class changes only. No logic changes.

- [ ] **Step 1: Scale hero headline**

In `src/app/page.tsx`, the `<h1>` (currently `className="font-display mt-6 text-5xl md:text-6xl xl:text-7xl font-bold leading-[0.98] tracking-tight text-foreground"`) — change the size ramp to start smaller:
```tsx
                <h1 className="font-display mt-6 text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.02] sm:leading-[0.98] tracking-tight text-foreground">
```

- [ ] **Step 2: Scale hero lead paragraph**

The lead `<p>` (currently `className="mt-7 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md"`) — change to:
```tsx
                <p className="mt-6 text-base md:text-xl text-muted-foreground leading-relaxed max-w-md">
```

- [ ] **Step 3: Fix hero stats collision on small screens**

The stats `<dl>` (currently `className="mt-12 flex gap-8 font-mono text-sm"`) — change to:
```tsx
                <dl className="mt-10 flex gap-5 sm:gap-8 font-mono text-sm">
```

The second and third `<div>` inside it currently use `className="border-l border-border pl-8"`. Change BOTH to:
```tsx
                  <div className="border-l border-border pl-5 sm:pl-8">
```

The two `<dt>` stat numbers (currently `className="text-2xl font-bold text-foreground tabular-nums"`) — change BOTH to:
```tsx
                    <dt className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
```
(The "Galileo" `<dt>` is `className="text-2xl font-bold text-foreground"` — change it to `text-xl sm:text-2xl font-bold text-foreground` too.)

- [ ] **Step 4: Constrain the floating hero product image on mobile**

The floating image wrapper (currently `className="relative mx-auto aspect-[5/6] max-w-md lg:max-w-lg"`) — change to:
```tsx
                <div className="relative mx-auto aspect-[5/6] max-w-[280px] sm:max-w-md lg:max-w-lg">
```

- [ ] **Step 5: Reduce section vertical padding on mobile**

Three sections use large fixed/`md:` padding. Update each opening tag:

The "CATEGORIE (BENTO)" section (`className="container mx-auto px-4 lg:px-8 py-20 md:py-28"`) → `py-14 md:py-28`:
```tsx
      <section className="container mx-auto px-4 lg:px-8 py-14 md:py-28">
```

The "I PIÙ SCELTI" section (`className="py-20 md:py-24 border-y border-border bg-muted/40"`) → `py-14 md:py-24`:
```tsx
      <section className="py-14 md:py-24 border-y border-border bg-muted/40">
```

The "PERCHÉ KOOPER" section (`className="container mx-auto px-4 lg:px-8 py-20 md:py-28"`) → `py-14 md:py-28`:
```tsx
      <section className="container mx-auto px-4 lg:px-8 py-14 md:py-28">
```

- [ ] **Step 6: Type-check + build**

Run: `npx tsc --noEmit` → 0 errors.
Run: `npm run build` → 507 pages, 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: responsive hero typography, stats, and section spacing"
git push
```

---

## Task 4: Touch-target audit + CategoryProducts mobile controls

**Files:**
- Modify: `src/components/CategoryProducts.tsx`

**Interfaces:** None new. Class changes to the controls bar + chip/select sizing.

- [ ] **Step 1: Make the controls bar stack on mobile**

In `src/components/CategoryProducts.tsx`, the controls bar wrapper (currently `className="flex flex-wrap items-center gap-3 mb-8"`) — change to allow a clean mobile stack:
```tsx
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-8">
```

- [ ] **Step 2: Make the sub-category chip row scroll horizontally on mobile**

The chip container (currently `className="flex flex-wrap gap-2"`) — change to:
```tsx
            <div className="flex gap-2 overflow-x-auto hide-scrollbar sm:flex-wrap -mx-1 px-1">
```

- [ ] **Step 3: Make the sort row full-width on mobile**

The right-side group (currently `className="ml-auto flex items-center gap-3"`) — change to:
```tsx
          <div className="flex items-center justify-between gap-3 w-full sm:w-auto sm:ml-auto">
```

The sort `<select>` (currently `className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"`) — bump to ≥44px and a touch-friendly size:
```tsx
              className="min-h-[44px] rounded-lg border border-border bg-background px-3 text-sm text-foreground"
```

- [ ] **Step 4: Bump filter chip hit area**

The `FilterChip` button (currently `className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-colors ${...}`}`) — change the base padding to `px-4 py-2` and keep the rest:
```tsx
      className={`flex-none rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors ${
        active
          ? activeClass
          : "border-border text-muted-foreground hover:border-muted-foreground/40"
      }`}
```
(The `flex-none` prevents chips from squishing in the horizontal scroll row.)

- [ ] **Step 5: Type-check + build**

Run: `npx tsc --noEmit` → 0 errors.
Run: `npm run build` → 507 pages, 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/CategoryProducts.tsx
git commit -m "feat: mobile-friendly category controls + 44px touch targets"
git push
```

---

## Task 5: Lightbox component

**Files:**
- Create: `src/components/Lightbox.tsx`

**Interfaces:**
- Consumes: `useScrollLock(active: boolean)` from `@/lib/useScrollLock`
- Produces: `export function Lightbox({ images, index, title, onClose, onIndexChange }: { images: string[]; index: number; title: string; onClose: () => void; onIndexChange: (i: number) => void }): JSX.Element | null` — returns `null` when not needed; the PARENT controls mount/unmount (renders `<Lightbox>` only when open). The component itself always renders its overlay when mounted.

- [ ] **Step 1: Create `src/components/Lightbox.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollLock } from "@/lib/useScrollLock";

export function Lightbox({
  images,
  index,
  title,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const [zoomed, setZoomed] = useState(false);

  useScrollLock(true);

  const go = (dir: number) => {
    setZoomed(false);
    const next = (index + dir + images.length) % images.length;
    onIndexChange(next);
  };

  // Keyboard: Esc closes, arrows navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col bg-background/97 backdrop-blur-sm"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <span className="font-mono text-sm text-muted-foreground tabular-nums">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Chiudi"
          className="grid place-items-center min-h-[44px] min-w-[44px] rounded-full hover:bg-muted text-foreground"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Image stage */}
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          className="absolute inset-0 cursor-zoom-in"
          style={{ touchAction: zoomed ? "none" : "auto" }}
          drag={zoomed ? true : false}
          dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
          dragElastic={0.2}
          animate={reduce ? undefined : { scale: zoomed ? 2.4 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          onClick={() => setZoomed((z) => !z)}
        >
          <Image
            src={images[index]}
            alt={title}
            fill
            sizes="100vw"
            priority
            className="object-contain p-6 select-none pointer-events-none"
          />
        </motion.div>

        {/* Prev / Next (hidden when single image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Immagine precedente"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center min-h-[44px] min-w-[44px] rounded-full bg-background/70 border border-border text-foreground hover:bg-background"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Immagine successiva"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center min-h-[44px] min-w-[44px] rounded-full bg-background/70 border border-border text-foreground hover:bg-background"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Lightbox.tsx
git commit -m "feat: fullscreen lightbox with zoom, keyboard nav, scroll-lock"
git push
```

---

## Task 6: ProductGallery rewrite (swipe + pills + thumbnails + lightbox)

**Files:**
- Modify: `src/components/ProductGallery.tsx` (full rewrite)

**Interfaces:**
- Consumes: `Lightbox` from `@/components/Lightbox`
- Produces: unchanged public signature — `export function ProductGallery({ images, title }: { images: string[]; title: string }): JSX.Element` (the product page already calls it this way; do not change the call site)

- [ ] **Step 1: Rewrite `src/components/ProductGallery.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Lightbox } from "@/components/Lightbox";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reduce = useReducedMotion();
  const gallery = images.length ? images : [];

  if (gallery.length === 0) {
    return (
      <div className="aspect-square rounded-3xl border border-border bg-muted grid place-items-center text-muted-foreground">
        Immagine non disponibile
      </div>
    );
  }

  const clamp = (i: number) => (i + gallery.length) % gallery.length;

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Desktop thumbnails */}
      {gallery.length > 1 && (
        <div className="hidden md:flex md:flex-col gap-3">
          {gallery.slice(0, 6).map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`Immagine ${i + 1}`}
              aria-pressed={active === i}
              className={`relative h-16 w-16 flex-none overflow-hidden rounded-xl border bg-white transition-colors ${
                active === i ? "border-brand" : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1">
        {/* Main image — mobile: swipeable track; desktop: single active image */}
        <div className="relative aspect-square rounded-3xl border border-border bg-white overflow-hidden">
          {/* Mobile swipe track */}
          <motion.div
            className="flex h-full md:hidden"
            drag={gallery.length > 1 && !reduce ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) setActive((a) => clamp(a + 1));
              else if (info.offset.x > 60) setActive((a) => clamp(a - 1));
            }}
            animate={{ x: `-${active * 100}%` }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 36 }}
          >
            {gallery.map((img) => (
              <div
                key={img}
                className="relative h-full w-full flex-none"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={img}
                  alt={title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain p-10 pointer-events-none"
                />
              </div>
            ))}
          </motion.div>

          {/* Desktop single image (click → lightbox) */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Apri immagine a schermo intero"
            className="hidden md:block absolute inset-0 cursor-zoom-in"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={gallery[active]}
                  alt={title}
                  fill
                  priority
                  sizes="45vw"
                  className="object-contain p-10"
                />
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile pill indicators */}
        {gallery.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-2 mt-4 min-h-[44px]">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Vai all'immagine ${i + 1}`}
                aria-pressed={active === i}
                className="grid place-items-center min-h-[44px] min-w-[24px]"
              >
                <span
                  className={`block h-2 rounded-full transition-all ${
                    active === i ? "w-6 bg-accent" : "w-2 bg-border"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox (mounted only when open) */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={gallery}
            index={active}
            title={title}
            onClose={() => setLightboxOpen(false)}
            onIndexChange={setActive}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: `✓ Generating static pages (507/507)`, 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProductGallery.tsx
git commit -m "feat: Apple-style gallery — mobile swipe + pills, desktop thumbs, lightbox"
git push
```

---

## Verification Checklist (after all tasks)

- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npm run build` → 507 SSG pages, 0 build errors
- [ ] Preview at 390px width:
  - [ ] Tap menu icon → drawer slides in from right, overlay dims page, page scroll is locked
  - [ ] Drawer links are ≥48px tall; tapping a category navigates and closes the drawer
  - [ ] `Escape` and overlay-tap both close the drawer
  - [ ] Hero headline fits without horizontal scroll; 3 stats don't collide
  - [ ] Hero product image is compact, not full-height
  - [ ] Category page: filter chips scroll horizontally; sort select is full-width and ≥44px
  - [ ] Product page gallery: swipe left/right changes image; pills track the active image
  - [ ] Tap main image → lightbox opens fullscreen; tap zooms; arrows/swipe navigate; `Esc`/X closes; scroll locked
- [ ] Desktop (≥1024px):
  - [ ] Thumbnail strip still works; click main image → lightbox; arrow keys navigate lightbox
- [ ] OS "Reduce motion" on: drawer/gallery/lightbox appear instantly (no slide/spring), every control still works
