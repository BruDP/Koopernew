import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import productsData from "../data/products.json";
import categoriesData from "../data/categories.json";
import { getCategorySummaries, type Product, type CategorySummary } from "@/lib/catalog";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticCard } from "@/components/motion/MagneticCard";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Marquee } from "@/components/motion/Marquee";
import { CountUp } from "@/components/motion/CountUp";
import { KineticButton } from "@/components/ui/KineticButton";

export default function Home() {
  const heroProduct = productsData.find((p) => p.images[0]) as Product;
  const featuredProducts = productsData.filter((p) => p.images[0]).slice(0, 8);

  const categoriesByCount = getCategorySummaries();
  const [lead, ...rest] = categoriesByCount;
  const totalProducts = productsData.length;

  return (
    <div className="flex flex-col">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 catalog-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_75%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center py-16 md:py-24 lg:py-28">
            {/* Copy */}
            <div className="lg:col-span-6 xl:col-span-5">
              <Reveal y={16}>
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-px w-8 bg-accent" />
                  Catalogo Kooper — Ed. 2026
                </span>
              </Reveal>
              <Reveal y={28} delay={0.05}>
                <h1 className="font-display mt-6 text-5xl md:text-6xl xl:text-7xl font-bold leading-[0.98] tracking-tight text-foreground">
                  Tecnologia che<br />
                  <span className="text-brand">si sente a casa.</span>
                </h1>
              </Reveal>
              <Reveal y={20} delay={0.12}>
                <p className="mt-7 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md">
                  Piccoli elettrodomestici, arredo e idee smart per ogni stanza.
                  Progettati per durare, pensati per semplificarti la vita.
                </p>
              </Reveal>
              <Reveal y={20} delay={0.18}>
                <div className="mt-9 flex flex-col sm:flex-row gap-3">
                  <KineticButton href="/categorie">Esplora il catalogo</KineticButton>
                  <KineticButton href="/categoria/promozioni" variant="outline" withArrow={false}>
                    Vedi le promozioni
                  </KineticButton>
                </div>
              </Reveal>
              <Reveal y={16} delay={0.26}>
                <dl className="mt-12 flex gap-8 font-mono text-sm">
                  <div>
                    <dt className="text-2xl font-bold text-foreground tabular-nums"><CountUp to={totalProducts} /></dt>
                    <dd className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Prodotti</dd>
                  </div>
                  <div className="border-l border-border pl-8">
                    <dt className="text-2xl font-bold text-foreground tabular-nums"><CountUp to={categoriesData.length} /></dt>
                    <dd className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Categorie</dd>
                  </div>
                  <div className="border-l border-border pl-8">
                    <dt className="text-2xl font-bold text-foreground">Galileo</dt>
                    <dd className="text-xs uppercase tracking-wider text-muted-foreground mt-1">S.p.A.</dd>
                  </div>
                </dl>
              </Reveal>
            </div>

            {/* Floating product */}
            <div className="lg:col-span-6 xl:col-span-7 relative">
              <ParallaxLayer distance={60} className="relative">
                <div className="relative mx-auto aspect-[5/6] max-w-md lg:max-w-lg">
                  <div className="absolute -inset-6 rounded-[2.5rem] bg-brand/[0.04] blur-2xl" />
                  <div className="relative h-full w-full rounded-[2rem] border border-border bg-white shadow-[0_30px_80px_-30px_rgba(60,72,88,0.45)] overflow-hidden">
                    {heroProduct?.images?.[0] && (
                      <Image
                        src={heroProduct.images[0]}
                        alt={heroProduct.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 90vw, 50vw"
                        className="object-contain p-10 animate-float"
                      />
                    )}
                    <div className="absolute top-5 left-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      In evidenza
                    </div>
                    <Link
                      href={`/prodotto/${heroProduct?.sku}`}
                      data-cursor="product"
                      className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/80 backdrop-blur px-5 py-4 transition-colors hover:bg-background"
                    >
                      <div className="min-w-0">
                        <div className="font-mono text-[11px] text-muted-foreground">SKU {heroProduct?.sku}</div>
                        <div className="font-medium text-sm text-foreground truncate">{heroProduct?.title}</div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 shrink-0 text-foreground" />
                    </Link>
                  </div>
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={categoriesData.map((c) => c.name)} />

      {/* ───────────────────── CATEGORIE (BENTO) ───────────────────── */}
      <section className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">/ Categorie</span>
              <h2 className="font-display mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                Tutto per la casa, in ordine.
              </h2>
            </div>
            <Link href="/categorie" className="group inline-flex items-center gap-2 text-sm font-medium">
              Tutte le categorie
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Lead category */}
          <Reveal className="md:col-span-2 md:row-span-2">
            <CategoryCard cat={lead} large />
          </Reveal>
          {rest.slice(0, 4).map((cat, i) => (
            <Reveal key={cat.slug} delay={0.06 * (i + 1)}>
              <CategoryCard cat={cat} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────── I PIÙ SCELTI ───────────────────── */}
      <section className="py-20 md:py-24 border-y border-border bg-muted/40">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">/ Selezione</span>
                <h2 className="font-display mt-3 text-3xl md:text-5xl font-bold tracking-tight">I più scelti</h2>
              </div>
              <Link href="/categorie" className="hidden md:inline-flex items-center gap-2 text-sm font-medium group">
                Vedi tutti
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="flex overflow-x-auto pb-4 px-4 lg:px-8 snap-x gap-5 hide-scrollbar">
          {featuredProducts.map((product, i) => (
            <Reveal key={product.sku} delay={Math.min(i, 5) * 0.05} className="snap-start flex-none w-[260px] md:w-[300px]">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────── PERCHÉ KOOPER ───────────────────── */}
      <section className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-brand text-primary-foreground">
          <div className="absolute inset-0 catalog-grid opacity-[0.15] [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_70%)]" />
          <div className="relative p-8 md:p-14 lg:p-20">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-foreground/0">/</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">
                La qualità è una scelta. La facciamo ogni giorno.
              </h2>
            </Reveal>
            <div className="mt-12 grid sm:grid-cols-3 gap-8 md:gap-12">
              {[
                { code: "01", t: "Design che dura", d: "Linee pulite ed essenziali, pensate per restare attuali stagione dopo stagione." },
                { code: "02", t: "Affidabilità reale", d: "Materiali selezionati e test rigorosi: ogni prodotto è fatto per l'uso quotidiano." },
                { code: "03", t: "Innovazione utile", d: "Tecnologia intuitiva che risolve problemi veri, senza complicazioni inutili." },
              ].map((f, i) => (
                <Reveal key={f.code} delay={0.08 * i}>
                  <div className="border-t border-primary-foreground/15 pt-5">
                    <span className="font-mono text-sm text-accent">{f.code}</span>
                    <h3 className="font-display text-xl font-bold mt-3 mb-2">{f.t}</h3>
                    <p className="text-primary-foreground/70 leading-relaxed text-sm">{f.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <KineticButton href="/azienda" variant="light" className="mt-12">Scopri chi siamo</KineticButton>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── sub-components ───────────────────────── */

function CategoryCard({ cat, large = false }: { cat: CategorySummary; large?: boolean }) {
  return (
    <MagneticCard strength={0.12} className="h-full">
      <Link
        href={`/categoria/${cat.slug}`}
        data-cursor="product"
        className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-brand/40 ${
          large ? "aspect-square md:aspect-auto md:h-full md:min-h-[26rem]" : "aspect-[4/3]"
        }`}
      >
        {cat.image && (
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            sizes={large ? "(max-width:768px) 100vw, 66vw" : "(max-width:768px) 100vw, 33vw"}
            className="object-contain p-10 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card via-card/80 to-transparent" />
        <div className="relative p-6 md:p-7">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            <span className="rounded bg-muted px-1.5 py-0.5 group-hover:text-accent transition-colors">{cat.meta.code}</span>
            <span className="tabular-nums">{cat.count} prodotti</span>
          </div>
          <h3 className={`font-display font-bold text-foreground ${large ? "text-2xl md:text-3xl" : "text-lg"}`}>
            {cat.name}
          </h3>
          {large && cat.meta.blurb && (
            <p className="mt-2 text-muted-foreground max-w-md text-sm">{cat.meta.blurb}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            Sfoglia
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </MagneticCard>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/prodotto/${product.sku}`} data-cursor="product" className="group block">
      <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-2xl border border-border bg-white">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="300px"
            className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground bg-muted">No image</div>
        )}
        {product.specialPrice && product.specialPrice < product.price && (
          <span className="absolute top-3 left-3 rounded-full bg-accent text-accent-foreground text-[11px] font-bold px-2.5 py-1 font-mono uppercase tracking-wider">
            Promo
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{product.subCategory}</div>
        <h3 className="font-medium text-foreground leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-bold tabular-nums">€{product.specialPrice || product.price}</span>
          {product.specialPrice && product.specialPrice < product.price && (
            <span className="text-sm text-muted-foreground line-through tabular-nums">€{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
