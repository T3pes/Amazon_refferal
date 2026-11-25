// Logica pura delle guide tematiche (testata in guides.test.ts).

type Pickable = { asin: string; tags?: string[]; featured?: boolean };

const norm = (s: string) => s.trim().toLowerCase();

/**
 * Prodotti di una guida: prima quelli scelti a mano (nel loro ordine),
 * poi quelli che hanno almeno un'etichetta della guida (i preferiti per primi).
 */
export function productsForGuide<T extends Pickable>(guide: { asins: string[]; tags: string[] }, products: T[]): T[] {
  const byAsin = new Map(products.map((p) => [p.asin, p]));
  const out: T[] = [];
  const seen = new Set<string>();
  for (const a of guide.asins) {
    const p = byAsin.get(a);
    if (p && !seen.has(a)) { out.push(p); seen.add(a); }
  }
  const wanted = new Set(guide.tags.map(norm).filter(Boolean));
  if (wanted.size) {
    const tagged = products
      .filter((p) => !seen.has(p.asin) && (p.tags ?? []).some((t) => wanted.has(norm(t))))
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    out.push(...tagged);
  }
  return out;
}

/** Giorno corrente in Italia, formato AAAA-MM-GG. */
export function todayInItaly(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** Una guida con data di fine resta online fino a quel giorno compreso (ora italiana). */
export function isGuideLive(guide: { endsOn: string | null }, now = new Date()): boolean {
  return !guide.endsOn || todayInItaly(now) <= guide.endsOn;
}

export function slugify(s: string): string {
  return s
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function parseTags(s: string): string[] {
  return [...new Set(s.split(",").map(norm).filter(Boolean))].slice(0, 10);
}
