# Kooper – Mobile-First Redesign + Apple-Style Gallery Spec
**Date:** 2026-06-26
**Scope:** Objective #1 (mobile-first redesign) + Objective #2 (product gallery, Apple-style) of the agent handoff.
**Stack:** Next.js 16.2.9, React 19, Tailwind v4, motion/react v12, Lenis.
**Constraint:** Pages = Server Components; interactivity in `"use client"` wrappers only. Animate only `transform`/`opacity`/`clip-path`. `prefers-reduced-motion` always honoured. No new npm packages. No e-commerce (prices stay as-is, no cart).

---

## Part A — Mobile-First Redesign

### A1. Mobile navigation → full-height drawer

**Problem:** The current mobile menu (`Header.tsx` lines 159-185) is an inline block that expands below the header — no overlay, no animation, no scroll-lock, touch targets under 44px.

**Solution:** Extract a new `src/components/MobileNav.tsx` (`"use client"`). `Header.tsx` keeps the toggle button and renders `<MobileNav open={...} onClose={...} />`.

- **Panel:** slides in from the right, full height, `max-w-[20rem]` width, opaque background. Contains: Categorie list (all 7), then KooperX / Azienda / Assistenza links.
- **Overlay:** fixed full-screen scrim `bg-foreground/40 backdrop-blur-sm`, click closes.
- **Scroll-lock:** while open, stop Lenis (`lenis.stop()` via the existing SmoothScrollProvider's lenis instance OR add `data-lenis-prevent` + `overflow-hidden` on `<html>`). Use the simplest reliable approach: add a `lenis-stopped` class to `document.documentElement` (CSS already sets `overflow:hidden` for it) on open, remove on close.
- **Touch targets:** every link `min-h-[48px]` flex items-center.
- **Close triggers:** `X` button (top-right, `min-h-[44px] min-w-[44px]`), overlay click, `Escape` key, and route change (via `usePathname` effect).
- **Focus:** focus the close button on open; `Escape` closes. (Full focus-trap is optional — keep it simple: focus close button + Escape handler.)
- **Animation:** panel `x: "100%" → 0`, overlay `opacity: 0 → 1`, via `motion/react` with `AnimatePresence`. Links stagger in. Under `prefers-reduced-motion`: no slide/stagger, panel appears instantly (still functional).

### A2. Hero typography & layout (`src/app/page.tsx`)

- **Headline:** `text-4xl` (base) → `sm:text-5xl` → `md:text-6xl` → `xl:text-7xl`. (Currently starts at `text-5xl`.)
- **Lead paragraph:** `text-base` (base) → `md:text-xl`.
- **Stats `<dl>`:** keep three items but reduce gap on mobile (`gap-5 md:gap-8`) and drop the `border-l pl-8` on the smallest breakpoint — use `pl-0 sm:border-l sm:pl-8` so they don't collide under 360px. Stat numbers `text-xl md:text-2xl`.
- **Floating product image:** constrain on mobile — `max-w-[280px] sm:max-w-md lg:max-w-lg`, and reduce vertical weight so it doesn't dominate the first screen. Keep `animate-float` (reduced-motion already disables it via globals.css).
- **Section vertical padding:** `py-12` (base) → `md:py-24`/`md:py-28` where currently fixed large.

### A3. Touch targets ≥44px (audit + fix)

- Header search button: ensure `min-h-[44px] min-w-[44px]` (currently `p-2` ≈ 36px).
- Header mobile toggle: `min-h-[44px] min-w-[44px]`.
- `CategoryProducts` filter chips: `min-h-[40px]` (chips are acceptable slightly under 44 if spacing is generous, but bump padding to `py-2`).
- `CategoryProducts` sort `<select>`: `min-h-[44px]`.
- Gallery thumbnails / dot indicators: dots `min-h-[44px]` hit area (visual dot smaller, hit area padded).

### A4. CategoryProducts controls on mobile (`src/components/CategoryProducts.tsx`)

- Controls bar: on mobile stack vertically — chips row scrolls horizontally (`flex overflow-x-auto hide-scrollbar`), the result-count + sort `<select>` move to a full-width row below (`w-full sm:w-auto`, `sm:ml-auto`).
- On `sm+` restore the current single-row layout.

---

## Part B — Apple-Style Product Gallery

**Problem:** Current `ProductGallery.tsx` shows a main image + thumbnail strip with a fade on thumbnail click. No swipe on mobile, no zoom, no fullscreen. ~Most products have multiple real images.

**Solution:** Rewrite `src/components/ProductGallery.tsx` and add `src/components/Lightbox.tsx`. Both `"use client"`.

### B1. Gallery — responsive behaviour

**Mobile (`< md`):**
- Full-width main image area, swipeable. Implement with a `motion.div` flex track and horizontal **drag** (`drag="x"`, `dragConstraints`, `dragElastic`) that snaps to the nearest image on release (snap = set `active` index, animate track `x` to `-active * width`).
- **Pill indicators** below the image: one pill per image, active pill wider/accent-coloured. Tapping a pill jumps to that image. Hit area `min-h-[44px]`.
- No thumbnail strip on mobile.
- Tap the main image → open Lightbox at the current index.

**Desktop (`>= md`):**
- Vertical thumbnail strip (left), main image (right) — same layout as today.
- Click main image → open Lightbox at current index.
- Thumbnail click sets active image (existing behaviour), with the dialed-down fade.

### B2. Lightbox (`src/components/Lightbox.tsx`)

- Fullscreen fixed overlay, dark background (`bg-background/95` or near-black), scroll-locked (same Lenis-stop mechanism as MobileNav).
- Shows the active image large, `object-contain`.
- **Zoom:** tap (or double-tap) toggles zoom in/out; when zoomed, drag to pan. Desktop: scroll/click toggles zoom. Keep zoom to a single 1× ↔ 2.5× toggle with pan — not continuous pinch (YAGNI; toggle-zoom matches Apple's tap-to-zoom feel without gesture-library complexity).
- **Navigation:** swipe left/right (mobile) or `←`/`→` keys (desktop) move between images; `Esc` closes; close `X` button top-right (`min-h-[44px]`).
- **Counter:** "3 / 7" indicator.
- Transitions via `motion/react` spring; reduced-motion → instant.
- Renders only when open (conditional mount). When closed, no overlay in DOM.

### B3. Shared scroll-lock helper

Both MobileNav and Lightbox need body scroll-lock. Extract `src/lib/useScrollLock.ts` — a small hook that toggles the `lenis-stopped` class on `document.documentElement` (and a fallback `overflow-hidden`) while active, cleaning up on unmount. Single source of truth, used by both.

---

## Architecture & boundaries

- `Header.tsx` (`"use client"`) — shrinks: keeps logo, desktop nav, search/menu buttons, delegates mobile menu to `MobileNav`.
- `MobileNav.tsx` (`"use client"`, new) — drawer panel + overlay + scroll-lock + close logic.
- `ProductGallery.tsx` (`"use client"`, rewritten) — responsive swipe/thumbnail gallery, opens Lightbox.
- `Lightbox.tsx` (`"use client"`, new) — fullscreen zoomable viewer.
- `useScrollLock.ts` (new) — shared scroll-lock hook.
- `page.tsx`, `prodotto/[sku]/page.tsx`, `categoria/[slug]/page.tsx` — remain Server Components; only Tailwind class changes for responsive layout.

---

## Out of scope

- Pricing/e-commerce changes (prices stay)
- i18n
- Pinch-to-zoom gesture (toggle-zoom instead — YAGNI)
- Desktop nav redesign (mega-menu stays as-is)
- Search dialog redesign (works on mobile already)

---

## Testing / verification

- `npx tsc --noEmit` → 0 errors
- `npm run build` → 507 SSG pages, 0 errors
- Manual (preview at 390px width): drawer opens/closes, scroll locks behind it, links ≥44px; hero fits without horizontal scroll; gallery swipes + pills work; lightbox opens, zooms, navigates, closes; reduced-motion mode disables animations but all controls still work.
- No unit tests for visual components; `useScrollLock` is DOM-side-effect only (no unit test — verified via manual/preview).

## Implementation order

1. `useScrollLock` hook (foundation for 2 & 5)
2. `MobileNav` drawer + Header refactor
3. Hero + spacing responsive pass (`page.tsx`)
4. Touch-target audit + `CategoryProducts` mobile controls
5. `Lightbox` component
6. `ProductGallery` rewrite (swipe + pills + thumbnails + opens Lightbox)
