import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import productsData from "../../../data/products.json";
import { Reveal } from "@/components/motion/Reveal";
import { ProductGallery } from "@/components/ProductGallery";
import { KineticButton } from "@/components/ui/KineticButton";

export function generateStaticParams() {
  return productsData.map((product) => ({ sku: product.sku }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const product = productsData.find((p) => p.sku === sku);
  return {
    title: product ? `${product.title} | Kooper` : "Prodotto | Kooper",
    description: product?.description?.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

const categorySlug = (name: string) => name.toLowerCase().replace(/ /g, "-");

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = productsData.find((p) => p.sku === sku);
  if (!product) notFound();

  const related = productsData
    .filter((p) => p.subCategory === product.subCategory && p.sku !== product.sku)
    .slice(0, 4);

  const onSale = product.specialPrice && product.specialPrice < product.price;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
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

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-24">
        {/* Gallery */}
        <Reveal y={16}>
          <ProductGallery images={product.images} title={product.title} />
        </Reveal>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <Reveal y={14}>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {product.brand === "KooperX" ? (
                <span className="rounded bg-foreground text-background px-2 py-0.5 tracking-[0.18em]">Kooper X</span>
              ) : (
                <span className="rounded bg-muted px-2 py-0.5">{product.brand}</span>
              )}
              <span>SKU {product.sku}</span>
            </div>
          </Reveal>

          <Reveal y={22} delay={0.05}>
            <h1 className="font-display mt-4 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              {product.title}
            </h1>
          </Reveal>

          <Reveal y={18} delay={0.1}>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold tabular-nums">€{product.specialPrice || product.price}</span>
              {onSale && (
                <>
                  <span className="text-xl text-muted-foreground line-through tabular-nums">€{product.price}</span>
                  <span className="rounded-full bg-accent text-accent-foreground text-xs font-bold px-3 py-1 font-mono uppercase tracking-wider">
                    Promo
                  </span>
                </>
              )}
            </div>
          </Reveal>

          {product.description && (
            <Reveal y={18} delay={0.14}>
              <div
                className="prose prose-sm dark:prose-invert mt-7 max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </Reveal>
          )}

          {product.features && (
            <Reveal y={16} delay={0.18}>
              <details className="group mt-7 rounded-2xl border border-border bg-muted/40 overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 font-medium text-foreground list-none">
                  Specifiche tecniche
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <div
                  className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.features }}
                />
              </details>
            </Reveal>
          )}

          <Reveal y={16} delay={0.22}>
            <div className="mt-9">
              <KineticButton href={product.link} external>Acquista su Satur.it</KineticButton>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                Venduto e spedito da Satur.it
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border pt-14">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Potrebbe interessarti anche</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((rel, i) => (
              <Reveal key={rel.sku} delay={i * 0.05}>
                <Link
                  href={`/prodotto/${rel.sku}`}
                  data-cursor="product"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card overflow-hidden transition-colors hover:border-brand/40"
                >
                  <div className="relative aspect-square bg-white border-b border-border">
                    {rel.images[0] && (
                      <Image
                        src={rel.images[0]}
                        alt={rel.title}
                        fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-brand transition-colors">
                      {rel.title}
                    </h3>
                    <div className="font-bold tabular-nums">€{rel.specialPrice || rel.price}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
