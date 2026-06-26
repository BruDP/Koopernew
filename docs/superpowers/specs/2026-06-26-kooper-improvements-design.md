# Kooper – Improvements Spec
**Date:** 2026-06-26  
**Scope:** Objective #3 of the agent handoff — categoria filters, image placeholders, SEO structured data, breadcrumb component, motion dial-down.  
**Stack:** Next.js 16.2.9, React 19, Tailwind v4, motion/react v12, Lenis.  
**Constraint:** Pages = Server Components; interactivity in `"use client"` wrappers only. Animate only `transform`/`opacity`/`clip-path`. `prefers-reduced-motion` always honoured.

---

## 1. Category Filters + Sorting + Load-more

### Problem
`/categoria/[slug]` renders all products in a flat grid. "Elettronica ed elettrodomestici" has 297 products — all mounted as `<Image>` at once (DOM and network pressure) with no way to narrow down.

### Solution: `CategoryProducts` client wrapper

The page (`src/app/categoria/[slug]/page.tsx`) stays a Server Component. It passes the full product array to a new `src/components/CategoryProducts.tsx` (`"use client"`) which owns filter/sort/load-more state.

**UI controls**

- **Sub-category chips** — rendered only when the category has more than one sub-category. Active chip = accent border + light fill. Selecting a chip filters to that sub-category; a neutral "Tutti" chip resets. Multiple selection is NOT supported (keeps UX simple — YAGNI).
- **Promo chip** — rendered only when at least one product in the category has `specialPrice < price`. Toggle: shows only promo products.
- **Sort select** — `<select>` styled with brand tokens: Rilevanza (original order) | Prezzo ↑ | Prezzo ↓ | Promo prima.
- **Result count** — small muted label: "Showing X of Y".

**Load-more**
- Initial page size: 24 products.
- "Mostra altri" `KineticButton` (variant `outline`) appends the next 24. Button hidden when all products are shown.
- Reset page to 24 whenever filters or sort change.

**Reduced-motion**: the chip/select controls have no animation; load-more appending is instant (no stagger). The existing `Reveal` wrapper per card is already reduced-motion safe.

**Files touched**
- `src/components/CategoryProducts.tsx` — new
- `src/app/categoria/[slug]/page.tsx` — replace the grid section with `<CategoryProducts products={categoryProducts} />`

---

## 2. Image Placeholders (shimmer skeleton)

### Problem
Product images load from `https://www.satur.it` with no placeholder — they pop in. Visible on category grids (24+ images), related products strip, search dialog.

### Solution: `ProductImage` wrapper

New `src/components/ProductImage.tsx` (`"use client"`) wraps `next/image` with:
- Gray shimmer background while loading (`animate-pulse` via Tailwind).
- On `onLoad`: fade in via a `motion.div` opacity transition (`duration: 0.3, ease: flow`). Respects `prefers-reduced-motion` — shows immediately if reduced.
- Accepts the same props as the current usage (`src`, `alt`, `fill`, `sizes`, `className`).

**Files touched**
- `src/components/ProductImage.tsx` — new
- `src/app/categoria/[slug]/page.tsx` — swap `<Image>` in grid for `<ProductImage>`
- `src/app/prodotto/[sku]/page.tsx` — related products strip
- `src/components/Search.tsx` — search dialog thumbnails

The main `ProductGallery.tsx` already has AnimatePresence fade — no shimmer needed there (images are shown one at a time intentionally).

---

## 3. Structured Data (JSON-LD)

### Problem
Breadcrumbs exist visually but are not machine-readable. Product pages have no `Product` schema. Both are low-effort SEO wins for a catalog site.

### Solution: `src/lib/jsonld.ts` helpers

```ts
buildBreadcrumbList(items: { name: string; href: string }[]): object
buildProductSchema(product: Product): object  // schema.org/Product
```

Both return plain JS objects serialized via `<script type="application/ld+json">` in the page's `<head>` (via Next.js `metadata` or a server-side `<script>` tag in the component).

**`BreadcrumbList`** — injected in both `/categoria/[slug]` and `/prodotto/[sku]`.  
**`Product`** — injected in `/prodotto/[sku]` with: `name`, `description` (stripped of HTML), `image` (first image URL), `sku`, `brand`, `offers` (price, `priceCurrency: "EUR"`, `availability: InStock`).

**Files touched**
- `src/lib/jsonld.ts` — new
- `src/app/categoria/[slug]/page.tsx` — add `<script>` tag
- `src/app/prodotto/[sku]/page.tsx` — add two `<script>` tags

---

## 4. Breadcrumb Component

### Problem
Breadcrumb markup is duplicated verbatim in `/categoria/[slug]/page.tsx` and `/prodotto/[sku]/page.tsx`. Adding JSON-LD in item #3 would require duplicating the data in two more places.

### Solution: `src/components/Breadcrumb.tsx`

Server Component (no `"use client"` — no interactivity needed). Accepts:

```ts
type BreadcrumbItem = { label: string; href?: string }
```

Last item (no `href`) renders as the current page (non-linked, slightly darker). Renders the same `ChevronRight` separator already in use. Also returns the structured-data-friendly item list so the page can pass it to `buildBreadcrumbList`.

**Files touched**
- `src/components/Breadcrumb.tsx` — new
- `src/app/categoria/[slug]/page.tsx` — replace inline breadcrumb nav
- `src/app/prodotto/[sku]/page.tsx` — replace inline breadcrumb nav

---

## 5. Motion Dial-down

### Problem
Current motion feels slightly over-stated: `ScrollSkew` max ±2.5°, reveal `y` values up to 24px, durations up to 0.34 s, `SPRING.magnetic` is very bouncy. Feedback: "dial-down globally, keep all effects."

### Changes — `src/lib/motion.ts`
| Token | Before | After |
|---|---|---|
| `DUR.fast` | 0.18 | 0.15 |
| `DUR.base` | 0.26 | 0.22 |
| `DUR.slow` | 0.34 | 0.28 |
| `velocityToSkew` `max` default | 2.5° | 1.2° |
| `velocityToSkew` `factor` default | 0.002 | 0.0015 |

### Changes — `src/components/motion/Reveal.tsx`
Cap default `y` at 14 (reduce from any value > 14 hardcoded in callers → these are in page files so I'll audit).

### Changes — `src/components/motion/PageShutter.tsx`
Shorten the clip-reveal duration (currently uses `DUR.slow`, will automatically pick up the new 0.28 s).

All changes propagate automatically from the token file. The `Reveal` callers in page files use inline `y` numbers — audit during implementation to cap any value above 16.

---

## Out of scope (explicitly excluded)

- `/cerca` dedicated search page — modale funziona, YAGNI
- i18n
- Cart / checkout / pricing changes
- Product gallery (swipe/lightbox) — this is objective #2, separate session
- Mobile-first redesign — objective #1, separate session

---

## Implementation order

1. `Breadcrumb` component (foundation for #3)
2. `jsonld.ts` + inject in pages (uses Breadcrumb)
3. Motion dial-down (pure token changes, zero risk)
4. `ProductImage` shimmer (isolated component)
5. `CategoryProducts` filters + load-more (largest change, last)

Each step is independently deployable (`git push` → Vercel).
