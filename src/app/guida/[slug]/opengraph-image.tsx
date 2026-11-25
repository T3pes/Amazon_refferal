import { getGuide } from "@/lib/catalog";
import { renderOg, OG_SIZE } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `Guida di ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { guide } = await getGuide(slug);
  if (!guide) return renderOg({ kicker: SITE.name, title: SITE.tagline });
  const n = guide.products.length;
  return renderOg({ kicker: `Guida · ${n} ${n === 1 ? "prodotto scelto" : "prodotti scelti"}`, title: guide.title, subtitle: guide.intro || undefined });
}
