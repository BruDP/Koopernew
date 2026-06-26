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
