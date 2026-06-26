import type { Metadata } from "next";
import { notFound } from "next/navigation";
import productsData from "../../../data/products.json";
import categoriesData from "../../../data/categories.json";
import { CATEGORY_META } from "@/lib/catalog";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildBreadcrumbList } from "@/lib/jsonld";
import { CategoryProducts } from "@/components/CategoryProducts";

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

      <CategoryProducts products={categoryProducts} />
    </div>
  );
}
