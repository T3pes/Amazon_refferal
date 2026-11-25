import { connection } from "next/server";
import { creatorsApiConfigured, getItems, lastCreatorsError } from "@/lib/creators-api";
import { fetchCatalogFromSupabase, supabaseConfigured } from "@/lib/supabase";

// Diagnostica senza segreti: quali sorgenti dati sono attive.
export async function GET() {
  await connection();
  const db = supabaseConfigured() ? await fetchCatalogFromSupabase() : null;
  let creators: Record<string, unknown> = { configurata: creatorsApiConfigured() };
  if (creatorsApiConfigured()) {
    const live = await getItems(["B09B8X9RGM"]);
    const item = live.get("B09B8X9RGM");
    creators = { ...creators, ok: Boolean(item?.title), prezzo: item?.price ?? null, versione: process.env.AMAZON_CREATORS_VERSION ?? "3.2", errore: item ? null : lastCreatorsError };
  }
  return Response.json(
    {
      supabase: { configurato: supabaseConfigured(), ok: Boolean(db), prodotti: db?.products.length ?? 0 },
      creatorsApi: creators,
      tag: process.env.AMAZON_PARTNER_TAG ?? "default",
    },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
