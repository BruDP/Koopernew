import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import productsData from "../../../data/products.json";
import categoriesData from "../../../data/categories.json";
import { CATEGORY_META } from "@/lib/catalog";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildBreadcrumbList } from "@/lib/jsonld";

export function generateStaticParams() {
  return categoriesData.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoriesData.find((c) => c.slug === slug);
  return {
    title: category ? `${category.name} | Kooper` : "Categoria | Kooper",
    description: category
      ? `Scopri i prodotti Kooper della categoria ${category.name}.`
      : undefined,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoriesData.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryProducts = productsData.filter((p) => p.category === category.name);
  const meta = CATEGORY_META[category.slug] ?? { code: "KP", blurb: "" };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
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
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Categorie", href: "/categorie" },
        { label: category.name },
      ]} />

      {/* Header */}
      <header className="mb-12 md:mb-16 max-w-3xl">
        <Reveal y={14}>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5">{meta.code}</span>
            <span className="tabular-nums">{categoryProducts.length} prodotti</span>
          </div>
        </Reveal>
        <Reveal y={16} delay={0.05}>
          <h1 className="font-display mt-4 text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            {category.name}
          </h1>
        </Reveal>
        {meta.blurb && (
          <Reveal y={18} delay={0.12}>
            <p className="mt-4 text-lg text-muted-foreground">{meta.blurb}</p>
          </Reveal>
        )}
      </header>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categoryProducts.map((product, i) => (
          <Reveal key={product.sku} delay={Math.min(i % 8, 7) * 0.04}>
            <Link
              href={`/prodotto/${product.sku}`}
              data-cursor="product"
              className="group flex h-full flex-col rounded-2xl border border-border bg-card overflow-hidden transition-colors hover:border-brand/40"
            >
              <div className="relative aspect-square bg-white border-b border-border overflow-hidden">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="(max-width:1024px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
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
              <div className="flex flex-1 flex-col p-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  {product.subCategory}
                </span>
                <h2 className="text-sm font-medium leading-snug text-foreground line-clamp-2 mb-4 flex-1 group-hover:text-brand transition-colors">
                  {product.title}
                </h2>
                <div className="mt-auto flex items-baseline gap-2">
                  <span className="font-bold tabular-nums">€{product.specialPrice || product.price}</span>
                  {product.specialPrice && product.specialPrice < product.price && (
                    <span className="text-sm text-muted-foreground line-through tabular-nums">€{product.price}</span>
                  )}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {categoryProducts.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          Nessun prodotto trovato in questa categoria.
        </div>
      )}
    </div>
  );
}
