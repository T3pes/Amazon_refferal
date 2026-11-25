import "server-only";
import type { CatalogEntry, Category } from "./types";

// Accesso a Supabase via REST (PostgREST) con la chiave pubblica.
// Le tabelle hanno RLS: in lettura solo prodotti attivi, in scrittura solo i clic.
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function supabaseConfigured(): boolean {
  return Boolean(URL_ && KEY);
}

function headers(extra: Record<string, string> = {}) {
  return { apikey: KEY!, Authorization: `Bearer ${KEY}`, ...extra };
}

type ProductRow = {
  asin: string; category: string; name: string; note: string;
  pros: string[] | null; cons: string[] | null; tags: string[] | null;
  featured: boolean; image_url: string | null;
};

export async function fetchCatalogFromSupabase(): Promise<{ categories: Category[]; products: CatalogEntry[] } | null> {
  if (!supabaseConfigured()) return null;
  try {
    const [cRes, pRes] = await Promise.all([
      fetch(`${URL_}/rest/v1/ar_categories?select=slug,name,emoji,blurb&order=sort.asc`, { headers: headers(), cache: "no-store" }),
      fetch(`${URL_}/rest/v1/ar_products?select=asin,category,name,note,pros,cons,tags,featured,image_url&active=eq.true&order=sort.asc`, { headers: headers(), cache: "no-store" }),
    ]);
    if (!cRes.ok || !pRes.ok) throw new Error(`HTTP ${cRes.status}/${pRes.status}`);
    const categories = (await cRes.json()) as Category[];
    const rows = (await pRes.json()) as ProductRow[];
    return {
      categories,
      products: rows.map((r) => ({
        asin: r.asin, category: r.category, name: r.name, note: r.note,
        pros: r.pros ?? [], cons: r.cons ?? [], tags: r.tags ?? [],
        featured: r.featured, imageUrl: r.image_url,
      })),
    };
  } catch (err) {
    console.warn("Supabase non disponibile, uso il catalogo locale:", (err as Error).message);
    return null;
  }
}

/** Registra un clic in uscita. Nessun dato personale: solo ASIN e pagina di provenienza. */
export async function logClick(asin: string, source: string | null): Promise<void> {
  if (!supabaseConfigured()) return;
  try {
    await fetch(`${URL_}/rest/v1/ar_clicks`, {
      method: "POST",
      headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ asin, source: source?.slice(0, 200) ?? null }),
      cache: "no-store",
    });
  } catch {
    /* il redirect non deve mai fallire per colpa delle statistiche */
  }
}
