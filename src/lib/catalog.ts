import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { buildAffiliateUrl } from "./affiliate";
import { getItems } from "./creators-api";
import { fetchCatalogFromSupabase, fetchGuidesFromSupabase } from "./supabase";
import { isGuideLive, productsForGuide } from "./guides";
import { CATEGORIES, SEED_PRODUCTS } from "@/data/seed";
import { SEED_GUIDES } from "@/data/guides-seed";
import type { Category, Guide, Product } from "./types";

export type GuideWithProducts = Guide & { products: Product[] };
export type Catalog = { categories: Category[]; products: Product[]; guides: GuideWithProducts[]; updatedAt: string };

/**
 * Catalogo completo. Cache di 1 ora: è il limite Amazon per i prezzi (Offers).
 */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  const [fromDb, guidesFromDb] = await Promise.all([fetchCatalogFromSupabase(), fetchGuidesFromSupabase()]);
  const source = fromDb ?? { categories: CATEGORIES, products: SEED_PRODUCTS };
  const live = await getItems(source.products.map((p) => p.asin));

  const products: Product[] = source.products.map((p) => {
    const l = live.get(p.asin) ?? null;
    return {
      ...p,
      imageUrl: l?.imageUrl ?? p.imageUrl ?? null,
      live: l,
      // Il link dell'API va usato così com'è (Amazon vieta di modificarlo)
      url: l?.detailPageUrl ?? buildAffiliateUrl(p.asin),
    };
  });

  // Mostra solo le categorie che hanno almeno un prodotto
  const used = new Set(products.map((p) => p.category));
  const categories = source.categories.filter((c) => used.has(c.slug));

  // Guide: solo quelle ancora in data e con almeno un prodotto visibile.
  // La cache dura al massimo un giorno, quindi una guida scaduta sparisce entro il giorno dopo.
  const guides = (guidesFromDb ?? SEED_GUIDES)
    .filter((g) => isGuideLive(g))
    .map((g) => ({ ...g, products: productsForGuide(g, products) }))
    .filter((g) => g.products.length > 0);

  return { categories, products, guides, updatedAt: new Date().toISOString() };
}

export async function getProduct(asin: string) {
  const catalog = await getCatalog();
  const product = catalog.products.find((p) => p.asin === asin) ?? null;
  return { catalog, product };
}

export async function getGuide(slug: string) {
  const catalog = await getCatalog();
  return { catalog, guide: catalog.guides.find((g) => g.slug === slug) ?? null };
}
