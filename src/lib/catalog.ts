import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

export type Product = (typeof productsData)[number];
export type RawCategory = (typeof categoriesData)[number];

/** Editorial metadata for the real catalog categories (catalog-index motif). */
export const CATEGORY_META: Record<string, { code: string; blurb: string }> = {
  "elettronica-ed-elettrodomestici": {
    code: "EL",
    blurb: "Dalla cucina alla cura della casa: i dispositivi che usi ogni giorno.",
  },
  natale: { code: "NT", blurb: "Luci, decorazioni e atmosfera per le feste." },
  promozioni: { code: "PR", blurb: "Le offerte del momento, a tempo limitato." },
  "arredo-casa": { code: "AR", blurb: "Illuminazione, tessile e complementi d'arredo." },
  "tavola-e-cucina": { code: "CU", blurb: "Strumenti e accessori per chi ama cucinare." },
  "accessori-e-tempo-libero": { code: "AT", blurb: "Fitness e benessere per la tua routine." },
  outdoor: { code: "OUT", blurb: "Mare, camping e avventure all'aria aperta." },
};

export function firstImageFor(categoryName: string): string | null {
  const p = productsData.find((x) => x.category === categoryName && x.images[0]);
  return p?.images[0] ?? null;
}

export type CategorySummary = RawCategory & {
  count: number;
  image: string | null;
  meta: { code: string; blurb: string };
};

/** All categories enriched with product count, a representative image and meta, sorted by size. */
export function getCategorySummaries(): CategorySummary[] {
  return categoriesData
    .map((c) => ({
      ...c,
      count: productsData.filter((p) => p.category === c.name).length,
      image: firstImageFor(c.name),
      meta: CATEGORY_META[c.slug] ?? { code: "KP", blurb: "" },
    }))
    .sort((a, b) => b.count - a.count);
}
