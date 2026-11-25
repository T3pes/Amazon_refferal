import "server-only";
import { cacheLife } from "next/cache";
import { buildAffiliateUrl } from "./affiliate";
import { getItems } from "./creators-api";
import { fetchCatalogFromSupabase } from "./supabase";
import { CATEGORIES, SEED_PRODUCTS } from "@/data/seed";
import type { Category, Product } from "./types";

export type Catalog = { categories: Category[]; products: Product[]; updatedAt: string };

/**
 * Catalogo completo. Cache di 1 ora: è il limite Amazon per i prezzi (Offers).
 */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("hours");

  const source = (await fetchCatalogFromSupabase()) ?? { categories: CATEGORIES, products: SEED_PRODUCTS };
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

  return { categories: source.categories, products, updatedAt: new Date().toISOString() };
}

export async function getProduct(asin: string) {
  const catalog = await getCatalog();
  const product = catalog.products.find((p) => p.asin === asin) ?? null;
  return { catalog, product };
}
