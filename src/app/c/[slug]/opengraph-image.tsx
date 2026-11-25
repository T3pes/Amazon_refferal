import { getCatalog } from "@/lib/catalog";
import { renderOg, OG_SIZE } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `Categoria del catalogo ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { categories, products } = await getCatalog();
  const c = categories.find((x) => x.slug === slug);
  if (!c) return renderOg({ kicker: SITE.name, title: SITE.tagline });
  const n = products.filter((p) => p.category === slug).length;
  return renderOg({ kicker: `${n} ${n === 1 ? "prodotto scelto" : "prodotti scelti"}`, title: c.name, subtitle: c.blurb });
}
