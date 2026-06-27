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
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-8">
          {showSubFilters && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar sm:flex-wrap -mx-1 px-1">
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

          <div className="flex items-center justify-between gap-3 w-full sm:w-auto sm:ml-auto">
            <span className="font-mono text-xs text-muted-foreground">
              {filtered.length} prodott{filtered.length === 1 ? "o" : "i"}
            </span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as SortKey); resetShown(); }}
              className="min-h-[44px] rounded-lg border border-border bg-background px-3 text-sm text-foreground"
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
      className={`flex-none rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors ${
        active
          ? activeClass
          : "border-border text-muted-foreground hover:border-muted-foreground/40"
      }`}
    >
      {children}
    </button>
  );
}
