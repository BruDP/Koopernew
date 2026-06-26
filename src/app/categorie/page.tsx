import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getCategorySummaries } from "@/lib/catalog";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticCard } from "@/components/motion/MagneticCard";

export const metadata: Metadata = {
  title: "Categorie | Kooper",
  description: "Sfoglia tutte le categorie del catalogo Kooper: elettrodomestici, arredo, cucina, outdoor e molto altro.",
};

export default function CategoriePage() {
  const categories = getCategorySummaries();
  const totalProducts = categories.reduce((s, c) => s + c.count, 0);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
      <header className="mb-12 md:mb-16 max-w-3xl">
        <Reveal y={16}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">/ Catalogo</span>
        </Reveal>
        <Reveal y={24} delay={0.05}>
          <h1 className="font-display mt-4 text-4xl md:text-6xl font-bold tracking-tight">
            Tutto il mondo Kooper.
          </h1>
        </Reveal>
        <Reveal y={20} delay={0.12}>
          <p className="mt-5 text-lg text-muted-foreground">
            {categories.length} categorie, {totalProducts} prodotti. Trova il punto di partenza giusto per la tua casa.
          </p>
        </Reveal>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {categories.map((cat, i) => (
          <Reveal key={cat.slug} delay={Math.min(i, 4) * 0.06}>
            <MagneticCard strength={0.1} className="h-full">
              <Link
                href={`/categoria/${cat.slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-7 md:p-8 transition-colors hover:border-brand/40 min-h-[15rem]"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={220}
                    height={220}
                    className="pointer-events-none absolute -right-6 -bottom-6 w-44 md:w-56 object-contain opacity-90 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2"
                  />
                )}
                <div className="relative">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5">{cat.meta.code}</span>
                    <span className="tabular-nums">{cat.count} prodotti</span>
                  </div>
                  <h2 className="font-display mt-4 text-2xl md:text-3xl font-bold text-foreground max-w-[70%]">
                    {cat.name}
                  </h2>
                  {cat.meta.blurb && (
                    <p className="mt-2 text-sm text-muted-foreground max-w-[60%]">{cat.meta.blurb}</p>
                  )}
                </div>

                <div className="relative mt-8 flex flex-wrap items-center gap-2">
                  {cat.subcategories.slice(0, 4).map((sub) => (
                    <span
                      key={sub.slug}
                      className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground capitalize"
                    >
                      {sub.name.toLowerCase()}
                    </span>
                  ))}
                  <span className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </MagneticCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
