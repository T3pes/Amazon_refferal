import { getProduct } from "@/lib/catalog";
import { renderOg, OG_SIZE } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `Prodotto consigliato da ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ asin: string }> }) {
  const { asin } = await params;
  const { catalog, product } = await getProduct(asin);
  if (!product) return renderOg({ kicker: SITE.name, title: SITE.tagline });
  const category = catalog.categories.find((c) => c.slug === product.category);
  return renderOg({
    kicker: product.featured ? "Uno dei miei preferiti" : (category?.name ?? "Consigliato"),
    star: !!product.featured,
    title: product.name,
    subtitle: product.note || undefined,
  });
}
