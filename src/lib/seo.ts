import { SITE } from "./site";
import type { Category, Product } from "./types";

export const abs = (path: string) => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Taglia una descrizione a ~155 caratteri senza spezzare le parole. */
export function clip(text: string, max = 155) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

/** Elenco di prodotti come ItemList: punta alle nostre schede, non ad Amazon. */
export function itemListLd(name: string, products: Product[]) {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/p/${p.asin}`), name: p.name })),
  };
}

export function categoryDescription(c: Category, count: number) {
  return clip(`${c.blurb} ${count} ${count === 1 ? "prodotto scelto" : "prodotti scelti"} a mano da ${SITE.name}, con il perché di ogni consiglio.`);
}
