import "server-only";
import type { CatalogEntry, Category, Guide } from "./types";

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
  /** Colonna aggiunta con lo SQL 0004: può mancare */
  deal_only?: boolean;
};

export async function fetchCatalogFromSupabase(): Promise<{ categories: Category[]; products: CatalogEntry[] } | null> {
  if (!supabaseConfigured()) return null;
  try {
    const [cRes, pRes] = await Promise.all([
      fetch(`${URL_}/rest/v1/ar_categories?select=slug,name,emoji,blurb&order=sort.asc`, { headers: headers(), cache: "no-store" }),
      fetch(`${URL_}/rest/v1/ar_products?select=*&active=eq.true&order=sort.asc`, { headers: headers(), cache: "no-store" }),
    ]);
    if (!cRes.ok || !pRes.ok) throw new Error(`HTTP ${cRes.status}/${pRes.status}`);
    const categories = (await cRes.json()) as Category[];
    const rows = (await pRes.json()) as ProductRow[];
    return {
      categories,
      products: rows.map((r) => ({
        asin: r.asin, category: r.category, name: r.name, note: r.note,
        pros: r.pros ?? [], cons: r.cons ?? [], tags: r.tags ?? [],
        featured: r.featured, imageUrl: r.image_url, dealOnly: r.deal_only === true,
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

type GuideRow = { slug: string; title: string; emoji: string; intro: string; tags: string[] | null; asins: string[] | null; ends_on: string | null };

/** Guide attive. null = tabella non ancora creata o Supabase non raggiungibile. */
export async function fetchGuidesFromSupabase(): Promise<Guide[] | null> {
  if (!supabaseConfigured()) return null;
  try {
    const res = await fetch(`${URL_}/rest/v1/ar_guides?select=slug,title,emoji,intro,tags,asins,ends_on&active=eq.true&order=sort.asc`, { headers: headers(), cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = (await res.json()) as GuideRow[];
    return rows.map((r) => ({ slug: r.slug, title: r.title, emoji: r.emoji, intro: r.intro, tags: r.tags ?? [], asins: r.asins ?? [], endsOn: r.ends_on }));
  } catch (err) {
    console.warn("Guide da Supabase non disponibili, uso quelle di partenza:", (err as Error).message);
    return null;
  }
}

/** true = offerta da pubblicare su Telegram (e già registrata). null = registro non disponibile. */
export async function claimTelegramDeal(asin: string, saving: number): Promise<boolean | null> {
  if (!supabaseConfigured()) return null;
  try {
    const res = await fetch(`${URL_}/rest/v1/rpc/ar_telegram_claim`, {
      method: "POST",
      headers: headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ p_ref: asin, p_saving: Math.round(saving) }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) === true;
  } catch {
    return null;
  }
}
