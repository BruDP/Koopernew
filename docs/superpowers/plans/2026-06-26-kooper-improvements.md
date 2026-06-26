# Kooper – Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add category filters + load-more, image shimmer placeholders, JSON-LD structured data, a reusable Breadcrumb component, and a global motion dial-down to the Kooper Next.js catalog.

**Architecture:** Server Components (pages) own data fetching and pass complete product arrays down; `"use client"` wrappers own all interactive state (filters, sort, load-more). JSON-LD is injected as `<script>` tags inside Server Component JSX. All filtering is pure in-memory — no dynamic routes or server round-trips.

**Tech Stack:** Next.js 16.2.9, React 19, Tailwind v4, motion/react v12, lucide-react, Node.js built-in `node:test` (unit tests — no Jest).

## Global Constraints

- Pages remain Server Components (`src/app/**`); interactivity is isolated in `"use client"` components
- Animate only `transform` / `opacity` / `clip-path` — never layout-triggering properties
- Every animated component must respect `useReducedMotion()` — static fallback required
- No new npm packages
- Run `node --test --experimental-strip-types src/lib/<file>.test.ts` for unit tests
- After each task commit: `git add <explicit files> && git commit -m "feat|fix|refactor: ..." && git push`

---

## File Map

| Status | Path | Responsibility |
|---|---|---|
| **new** | `src/components/Breadcrumb.tsx` | Reusable Server Component breadcrumb nav |
| **new** | `src/lib/jsonld.ts` | Pure helpers: `buildBreadcrumbList`, `buildProductSchema` |
| **new** | `src/lib/jsonld.test.ts` | Unit tests for jsonld.ts |
| **new** | `src/components/ProductImage.tsx` | Client wrapper: shimmer + fade-in on `onLoad` |
| **new** | `src/components/CategoryProducts.tsx` | Client wrapper: sub-cat chips, promo toggle, sort, load-more |
| **modify** | `src/lib/motion.ts` | Dial-down DUR tokens + velocityToSkew defaults |
| **modify** | `src/lib/motion.test.ts` | Update expected values to match new tokens |
| **modify** | `src/components/motion/Reveal.tsx` | Lower default y (24→14), lower duration (0.7→0.5) |
| **modify** | `src/app/prodotto/[sku]/page.tsx` | Use Breadcrumb, JSON-LD scripts, ProductImage, cap y={22}→y={16} |
| **modify** | `src/app/categoria/[slug]/page.tsx` | Use Breadcrumb, JSON-LD script, ProductImage, CategoryProducts, cap y={24}→y={16} |
| **modify** | `src/components/Search.tsx` | Use ProductImage for thumbnails |

---

## Task 1: Breadcrumb Component

**Files:**
- Create: `src/components/Breadcrumb.tsx`
- Modify: `src/app/prodotto/[sku]/page.tsx` (lines 44-52)
- Modify: `src/app/categoria/[slug]/page.tsx` (lines 40-47)

**Interfaces:**
- Produces: `export type BreadcrumbItem = { label: string; href?: string }` and `export function Breadcrumb({ items }: { items: BreadcrumbItem[] }): JSX.Element`
- Consumed by: Task 2 (`buildBreadcrumbList` mirrors this shape with `name`/`href`)

---

- [ ] **Step 1: Create `src/components/Breadcrumb.tsx`**

```tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground mb-8"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground line-clamp-1" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Replace inline breadcrumb in `src/app/prodotto/[sku]/page.tsx`**

Remove lines 44-52:
```tsx
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/categoria/${categorySlug(product.category)}`} className="hover:text-foreground transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground line-clamp-1">{product.title}</span>
      </nav>
```

Replace with:
```tsx
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: product.category, href: `/categoria/${categorySlug(product.category)}` },
        { label: product.title },
      ]} />
```

Add import at top of file (replace the `ChevronRight` import line if it becomes unused):
```tsx
import { Breadcrumb } from "@/components/Breadcrumb";
```

- [ ] **Step 3: Replace inline breadcrumb in `src/app/categoria/[slug]/page.tsx`**

Remove lines 40-47:
```tsx
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/categorie" className="hover:text-foreground transition-colors">Categorie</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{category.name}</span>
      </nav>
```

Replace with:
```tsx
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Categorie", href: "/categorie" },
        { label: category.name },
      ]} />
```

Add import:
```tsx
import { Breadcrumb } from "@/components/Breadcrumb";
```

Remove now-unused imports `ChevronRight` (and `Link` if no longer used elsewhere in the file — check first).

- [ ] **Step 4: Verify with type-check**

```
cd "C:\Users\deporzib\Desktop\KOOPERNEW\kooper-app"
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Breadcrumb.tsx src/app/prodotto/[sku]/page.tsx src/app/categoria/[slug]/page.tsx
git commit -m "feat: extract reusable Breadcrumb server component"
git push
```

---

## Task 2: JSON-LD Structured Data

**Files:**
- Create: `src/lib/jsonld.ts`
- Create: `src/lib/jsonld.test.ts`
- Modify: `src/app/prodotto/[sku]/page.tsx` (add two `<script>` tags)
- Modify: `src/app/categoria/[slug]/page.tsx` (add one `<script>` tag)

**Interfaces:**
- Consumes: `Product` type from `@/lib/catalog`; `BreadcrumbItem` from `@/components/Breadcrumb`
- Produces:
  - `buildBreadcrumbList(items: { name: string; href: string }[]): object`
  - `buildProductSchema(product: Product): object`

---

- [ ] **Step 1: Write failing tests in `src/lib/jsonld.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildBreadcrumbList, buildProductSchema } from "./jsonld.ts";

test("buildBreadcrumbList returns correct @type", () => {
  const result = buildBreadcrumbList([{ name: "Home", href: "/" }]);
  assert.equal((result as any)["@type"], "BreadcrumbList");
});

test("buildBreadcrumbList positions items starting at 1", () => {
  const result = buildBreadcrumbList([
    { name: "Home", href: "/" },
    { name: "Categorie", href: "/categorie" },
  ]) as any;
  assert.equal(result.itemListElement[0].position, 1);
  assert.equal(result.itemListElement[1].position, 2);
});

test("buildBreadcrumbList builds full item URL", () => {
  const result = buildBreadcrumbList([{ name: "Home", href: "/" }]) as any;
  assert.ok(result.itemListElement[0].item.startsWith("https://"));
});

test("buildProductSchema returns @type Product", () => {
  const fakeProduct = {
    sku: "TEST01",
    title: "Test Product",
    description: "<p>Nice product</p>",
    price: 99.99,
    specialPrice: undefined,
    images: ["https://example.com/img.jpg"],
    brand: "Kooper",
    link: "https://satur.it/test",
    category: "Elettronica",
    subCategory: "ELETTRODOMESTICI",
    color: "",
    material: "",
    features: "",
  };
  const result = buildProductSchema(fakeProduct as any) as any;
  assert.equal(result["@type"], "Product");
  assert.equal(result.sku, "TEST01");
});

test("buildProductSchema strips HTML from description", () => {
  const fakeProduct = {
    sku: "TEST01",
    title: "Test",
    description: "<p>Nice <b>product</b></p>",
    price: 10,
    specialPrice: undefined,
    images: [],
    brand: "Kooper",
    link: "",
    category: "",
    subCategory: "",
    color: "",
    material: "",
    features: "",
  };
  const result = buildProductSchema(fakeProduct as any) as any;
  assert.equal(result.description, "Nice product");
});

test("buildProductSchema uses specialPrice when present", () => {
  const fakeProduct = {
    sku: "X",
    title: "X",
    description: "",
    price: 100,
    specialPrice: 79,
    images: [],
    brand: "Kooper",
    link: "",
    category: "",
    subCategory: "",
    color: "",
    material: "",
    features: "",
  };
  const result = buildProductSchema(fakeProduct as any) as any;
  assert.equal(result.offers.price, 79);
});
```

- [ ] **Step 2: Run tests to verify they fail**

```
node --test --experimental-strip-types src/lib/jsonld.test.ts
```
Expected: `Error: Cannot find module './jsonld.ts'`

- [ ] **Step 3: Create `src/lib/jsonld.ts`**

```ts
import type { Product } from "./catalog";

const SITE_URL = "https://koopernew-h5bs.vercel.app";

export function buildBreadcrumbList(
  items: { name: string; href: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export function buildProductSchema(product: Product): object {
  const price = product.specialPrice ?? product.price;
  const description = product.description
    ? product.description.replace(/<[^>]+>/g, "").slice(0, 500)
    : "";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description,
    sku: product.sku,
    image: product.images[0] ?? "",
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: product.link,
    },
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```
node --test --experimental-strip-types src/lib/jsonld.test.ts
```
Expected: `✓ buildBreadcrumbList returns correct @type` (all 5 pass).

- [ ] **Step 5: Inject JSON-LD in `src/app/prodotto/[sku]/page.tsx`**

Add imports at top:
```tsx
import { buildBreadcrumbList, buildProductSchema } from "@/lib/jsonld";
```

Add the `categorySlug` helper already present in the file. Then, inside the component just before the return's opening `<div>`, add both scripts at the top of the returned JSX (after the outer `<div>` opens but before the `<Breadcrumb>`):

```tsx
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbList([
              { name: "Home", href: "/" },
              { name: product.category, href: `/categoria/${categorySlug(product.category)}` },
              { name: product.title, href: `/prodotto/${product.sku}` },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductSchema(product)) }}
      />
```

- [ ] **Step 6: Inject JSON-LD in `src/app/categoria/[slug]/page.tsx`**

Add import:
```tsx
import { buildBreadcrumbList } from "@/lib/jsonld";
```

Add script after the outer `<div>` opens and before `<Breadcrumb>`:
```tsx
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbList([
              { name: "Home", href: "/" },
              { name: "Categorie", href: "/categorie" },
              { name: category.name, href: `/categoria/${category.slug}` },
            ])
          ),
        }}
      />
```

- [ ] **Step 7: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/jsonld.ts src/lib/jsonld.test.ts src/app/prodotto/[sku]/page.tsx src/app/categoria/[slug]/page.tsx
git commit -m "feat: add JSON-LD BreadcrumbList and Product structured data"
git push
```

---

## Task 3: Motion Dial-Down

**Files:**
- Modify: `src/lib/motion.ts`
- Modify: `src/lib/motion.test.ts`
- Modify: `src/components/motion/Reveal.tsx`
- Modify: `src/app/prodotto/[sku]/page.tsx` (one caller: `y={22}` → `y={16}`)
- Modify: `src/app/categoria/[slug]/page.tsx` (one caller: `y={24}` → `y={16}`)

**Interfaces:**
- `velocityToSkew(velocity, max?, factor?)` — same signature, new defaults: `max=1.2`, `factor=0.0015`
- `DUR` — same shape, new values: `{ fast: 0.15, base: 0.22, slow: 0.28 }`

---

- [ ] **Step 1: Run existing tests to confirm baseline passes**

```
node --test --experimental-strip-types src/lib/motion.test.ts
```
Expected: all 5 tests pass (including `velocityToSkew(100000) === 2.5` and `DUR.slow === 0.34`).

- [ ] **Step 2: Update `src/lib/motion.ts`**

Replace the file contents:
```ts
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
```

- [ ] **Step 3: Update `src/lib/motion.test.ts` to match new defaults**

Replace the file contents:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { velocityToSkew, EASE, DUR } from "./motion.ts";

test("velocityToSkew clamps to +max", () => {
  assert.equal(velocityToSkew(100000), 1.2);
});
test("velocityToSkew clamps to -max", () => {
  assert.equal(velocityToSkew(-100000), -1.2);
});
test("velocityToSkew is ~0 at rest", () => {
  assert.equal(velocityToSkew(0), 0);
});
test("velocityToSkew scales linearly below clamp (explicit args)", () => {
  assert.equal(velocityToSkew(500, 2.5, 0.002), 1);
});
test("tokens are present", () => {
  assert.equal(EASE.snap.length, 4);
  assert.equal(DUR.slow, 0.28);
});
```

- [ ] **Step 4: Run tests to verify they pass**

```
node --test --experimental-strip-types src/lib/motion.test.ts
```
Expected: all 5 pass.

- [ ] **Step 5: Update `src/components/motion/Reveal.tsx`**

Change default `y` from 24 to 14, and `duration` from 0.7 to 0.5:
```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  as?: "div" | "span" | "li";
};

export function Reveal({ children, className, y = 14, delay = 0, as = "div" }: RevealProps) {
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
      transition={{ duration: 0.5, ease: EASE.flow, delay }}
    >
      {children}
    </MotionTag>
  );
}
```

- [ ] **Step 6: Cap high `y` values in `src/app/prodotto/[sku]/page.tsx`**

Find `<Reveal y={22}` and change to `<Reveal y={16}`:
```tsx
          <Reveal y={16} delay={0.05}>
```
(This is the h1 title reveal — the only caller above 18 in this file.)

- [ ] **Step 7: Cap high `y` values in `src/app/categoria/[slug]/page.tsx`**

Find `<Reveal y={24}` and change to `<Reveal y={16}`:
```tsx
        <Reveal y={16} delay={0.05}>
```
(This is the category h1 reveal.)

- [ ] **Step 8: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add src/lib/motion.ts src/lib/motion.test.ts src/components/motion/Reveal.tsx src/app/prodotto/[sku]/page.tsx src/app/categoria/[slug]/page.tsx
git commit -m "refactor(motion): global dial-down — DUR tokens, skew max 1.2°, Reveal y/duration reduced"
git push
```

---

## Task 4: ProductImage Shimmer

**Files:**
- Create: `src/components/ProductImage.tsx`
- Modify: `src/app/categoria/[slug]/page.tsx` (grid images)
- Modify: `src/app/prodotto/[sku]/page.tsx` (related products strip)
- Modify: `src/components/Search.tsx` (search dialog thumbnails)

**Interfaces:**
- Produces: `export function ProductImage(props: ProductImageProps): JSX.Element`
- Props: `{ src: string; alt: string; fill?: boolean; sizes?: string; className?: string; priority?: boolean }`
- The parent container must already be `position: relative` and `overflow-hidden` (all existing containers are).

---

- [ ] **Step 1: Create `src/components/ProductImage.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";

type ProductImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function ProductImage({ src, alt, fill, sizes, className, priority }: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      {!loaded && !reduce && (
        <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={`${className ?? ""} transition-opacity duration-300 ${loaded || reduce ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
```

- [ ] **Step 2: Swap images in the category grid in `src/app/categoria/[slug]/page.tsx`**

Add import:
```tsx
import { ProductImage } from "@/components/ProductImage";
```

Find the grid section (inside `CategoryProducts` — after Task 5 this will move there, but for now it's still in the page). Replace:
```tsx
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="(max-width:1024px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
```

With:
```tsx
                {product.images[0] ? (
                  <ProductImage
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="(max-width:1024px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
```

- [ ] **Step 3: Swap images in related products strip in `src/app/prodotto/[sku]/page.tsx`**

Add import:
```tsx
import { ProductImage } from "@/components/ProductImage";
```

In the related products section (around line 143), replace:
```tsx
                      <Image
                        src={rel.images[0]}
                        alt={rel.title}
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                      />
```

With:
```tsx
                      <ProductImage
                        src={rel.images[0]}
                        alt={rel.title}
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                      />
```

- [ ] **Step 4: Swap thumbnail in `src/components/Search.tsx`**

Add import (replace the existing `Image` import line or add alongside):
```tsx
import { ProductImage } from "@/components/ProductImage";
```

Find (around line 107-110):
```tsx
                        {product.images[0] && (
                          <Image src={product.images[0]} alt={product.title} fill className="object-contain p-1 group-hover:scale-110 transition-transform" />
                        )}
```

Replace with:
```tsx
                        {product.images[0] && (
                          <ProductImage src={product.images[0]} alt={product.title} fill className="object-contain p-1 group-hover:scale-110 transition-transform" />
                        )}
```

Note: the `<div>` wrapping this thumbnail already has `relative` and `overflow-hidden` — no changes needed to the container.

- [ ] **Step 5: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProductImage.tsx src/app/categoria/[slug]/page.tsx src/app/prodotto/[sku]/page.tsx src/components/Search.tsx
git commit -m "feat: add ProductImage shimmer/fade placeholder for remote images"
git push
```

---

## Task 5: CategoryProducts Filters + Sort + Load-more

**Files:**
- Create: `src/components/CategoryProducts.tsx`
- Modify: `src/app/categoria/[slug]/page.tsx` (replace grid with component)

**Interfaces:**
- Consumes: `Product` type from `@/lib/catalog`; `ProductImage` from `@/components/ProductImage`
- Produces: `export function CategoryProducts({ products }: { products: Product[] }): JSX.Element`
- Called by: `src/app/categoria/[slug]/page.tsx` with the already-filtered `categoryProducts` array

---

- [ ] **Step 1: Create `src/components/CategoryProducts.tsx`**

```tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import type { Product } from "@/lib/catalog";

const PAGE_SIZE = 24;
type SortKey = "relevance" | "price-asc" | "price-desc" | "promo-first";

const effectivePrice = (p: Product) => p.specialPrice ?? p.price;
const isPromo = (p: Product) => !!(p.specialPrice && p.specialPrice < p.price);

export function CategoryProducts({ products }: { products: Product[] }) {
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [promoOnly, setPromoOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [shown, setShown] = useState(PAGE_SIZE);

  const subCategories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const p of products) {
      if (p.subCategory && !seen.has(p.subCategory)) {
        seen.add(p.subCategory);
        list.push(p.subCategory);
      }
    }
    return list;
  }, [products]);

  const hasPromo = useMemo(() => products.some(isPromo), [products]);
  const showSubFilters = subCategories.length > 1;

  const resetShown = () => setShown(PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = products;
    if (activeSub) result = result.filter((p) => p.subCategory === activeSub);
    if (promoOnly) result = result.filter(isPromo);
    switch (sort) {
      case "price-asc":  return [...result].sort((a, b) => effectivePrice(a) - effectivePrice(b));
      case "price-desc": return [...result].sort((a, b) => effectivePrice(b) - effectivePrice(a));
      case "promo-first": return [...result].sort((a, b) => (isPromo(b) ? 1 : 0) - (isPromo(a) ? 1 : 0));
      default: return result;
    }
  }, [products, activeSub, promoOnly, sort]);

  const visible = filtered.slice(0, shown);
  const hasMore = shown < filtered.length;

  return (
    <div>
      {/* Controls bar */}
      {(showSubFilters || hasPromo) && (
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {showSubFilters && (
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={activeSub === null}
                onClick={() => { setActiveSub(null); resetShown(); }}
              >
                Tutti
              </FilterChip>
              {subCategories.map((sub) => (
                <FilterChip
                  key={sub}
                  active={activeSub === sub}
                  onClick={() => { setActiveSub(sub); resetShown(); }}
                >
                  {sub.toLowerCase()}
                </FilterChip>
              ))}
            </div>
          )}

          {hasPromo && (
            <FilterChip
              active={promoOnly}
              onClick={() => { setPromoOnly((v) => !v); resetShown(); }}
              accent
            >
              Solo promo
            </FilterChip>
          )}

          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {filtered.length} prodott{filtered.length === 1 ? "o" : "i"}
            </span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as SortKey); resetShown(); }}
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            >
              <option value="relevance">Rilevanza</option>
              <option value="price-asc">Prezzo ↑</option>
              <option value="price-desc">Prezzo ↓</option>
              <option value="promo-first">Promo prima</option>
            </select>
          </div>
        </div>
      )}

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          Nessun prodotto trovato con i filtri selezionati.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {visible.map((product) => (
            <Link
              key={product.sku}
              href={`/prodotto/${product.sku}`}
              data-cursor="product"
              className="group flex h-full flex-col rounded-2xl border border-border bg-card overflow-hidden transition-colors hover:border-brand/40"
            >
              <div className="relative aspect-square bg-white border-b border-border overflow-hidden">
                {product.images[0] ? (
                  <ProductImage
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="(max-width:1024px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-muted text-muted-foreground text-xs">
                    No image
                  </div>
                )}
                {isPromo(product) && (
                  <span className="absolute top-3 left-3 rounded-full bg-accent text-accent-foreground text-[11px] font-bold px-2.5 py-1 font-mono uppercase tracking-wider">
                    Promo
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  {product.subCategory}
                </span>
                <h2 className="flex-1 text-sm font-medium leading-snug line-clamp-2 mb-4 group-hover:text-brand transition-colors">
                  {product.title}
                </h2>
                <div className="mt-auto flex items-baseline gap-2">
                  <span className="font-bold tabular-nums">€{effectivePrice(product)}</span>
                  {isPromo(product) && (
                    <span className="text-sm text-muted-foreground line-through tabular-nums">
                      €{product.price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Load-more */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShown((s) => s + PAGE_SIZE)}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-border px-7 py-4 font-medium text-foreground transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
            <span className="relative z-10 transition-colors duration-200 group-hover:text-accent-foreground">
              Mostra altri ({filtered.length - shown} prodotti)
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── internal chip component ──────────────────────────────────────────────────

function FilterChip({
  children,
  active,
  onClick,
  accent = false,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  accent?: boolean;
}) {
  const activeClass = accent
    ? "bg-accent text-accent-foreground border-accent"
    : "bg-accent/10 text-accent border-accent/40";
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-colors ${
        active
          ? activeClass
          : "border-border text-muted-foreground hover:border-muted-foreground/40"
      }`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Wire `CategoryProducts` into `src/app/categoria/[slug]/page.tsx`**

Add import:
```tsx
import { CategoryProducts } from "@/components/CategoryProducts";
```

Replace the entire grid section (the `<div className="grid grid-cols-2 ...">...</div>` block and the empty-state paragraph below it) with:
```tsx
      <CategoryProducts products={categoryProducts} />
```

The `ProductImage` import added in Task 4 can be removed from this file if it's no longer used directly (it's now used inside `CategoryProducts`). The `Image` import from `next/image` should also be removed from this file if no longer used. Check and clean up unused imports.

- [ ] **Step 3: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Verify build succeeds**

```
cd "C:\Users\deporzib\Desktop\KOOPERNEW\kooper-app"
npm run build
```
Expected: `✓ Generating static pages (507/507)` — same page count as before (filters are client-side, route count unchanged).

- [ ] **Step 5: Commit**

```bash
git add src/components/CategoryProducts.tsx src/app/categoria/[slug]/page.tsx
git commit -m "feat: add sub-category filters, sort, and load-more to category pages"
git push
```

---

## Verification Checklist (after all tasks)

- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npm run build` → 507 SSG pages, 0 build errors
- [ ] `node --test --experimental-strip-types src/lib/motion.test.ts` → 5/5 pass
- [ ] `node --test --experimental-strip-types src/lib/jsonld.test.ts` → 5/5 pass
- [ ] Open `/categoria/elettronica-ed-elettrodomestici` → 24 products shown, chips visible, load-more present
- [ ] Toggle a sub-cat chip → grid updates instantly, count label updates, page resets to 24
- [ ] Toggle "Solo promo" → only promo products shown
- [ ] Change sort to "Prezzo ↑" → products re-order
- [ ] Click "Mostra altri" → 24 more products append
- [ ] Open a product page → breadcrumb visible, right-click → "View page source" → search `BreadcrumbList` → found; search `"@type":"Product"` → found
- [ ] Open DevTools → Network → reload a category page → satur.it images show shimmer before loading
- [ ] Scroll a category page quickly → scroll skew noticeably gentler than before
- [ ] Open category page with OS "Reduce motion" on → no shimmer, no skew, no Reveal animation; filters still work
