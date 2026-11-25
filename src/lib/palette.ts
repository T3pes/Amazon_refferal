// Colori per categoria e per guida: ogni sezione ha la sua tinta (tonalità OKLCH 0-360).
// Le categorie nuove create dall'admin ricevono una tinta stabile calcolata dallo slug.

const CATEGORY_HUES: Record<string, number> = { tech: 262, casa: 150, regali: 18 };
const GUIDE_HUES: Record<string, number> = {
  "regali-di-natale": 25, "regali-sotto-30-euro": 330, "regali-per-lui": 235,
  "regali-per-lei": 350, "casa-smart": 195, "cucina-facile": 65,
};
const SPARE = [45, 95, 175, 210, 285, 310, 0];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function categoryHue(slug: string): number {
  return CATEGORY_HUES[slug] ?? SPARE[hash(slug) % SPARE.length];
}

export function guideHue(slug: string): number {
  return GUIDE_HUES[slug] ?? SPARE[hash(slug) % SPARE.length];
}

/** Le guide Black Friday hanno lo stile scuro "notte" */
export function isDarkGuide(slug: string) {
  return slug.includes("black-friday") || slug.includes("cyber-monday");
}

export const hueStyle = (h: number) => ({ "--h": String(h) }) as React.CSSProperties;
