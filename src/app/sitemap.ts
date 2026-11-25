import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { abs } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products, guides, updatedAt } = await getCatalog();
  const lastModified = new Date(updatedAt);
  return [
    { url: abs("/"), lastModified, changeFrequency: "daily", priority: 1 },
    ...categories.map((c) => ({ url: abs(`/c/${c.slug}`), lastModified, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...guides.map((g) => ({ url: abs(`/guida/${g.slug}`), lastModified, changeFrequency: "daily" as const, priority: 0.9 })),
    ...products.map((p) => ({ url: abs(`/p/${p.asin}`), lastModified, changeFrequency: "weekly" as const, priority: p.featured ? 0.7 : 0.6 })),
    ...["/come-funziona", "/informativa-affiliazione", "/privacy"].map((path) => ({ url: abs(path), changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
