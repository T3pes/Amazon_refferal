import { connection } from "next/server";
import { creatorsApiConfigured, getItems, lastCreatorsError } from "@/lib/creators-api";
import { fetchCatalogFromSupabase, supabaseConfigured } from "@/lib/supabase";
import { readSession } from "@/lib/admin/session";
import { isAdmin } from "@/lib/admin/db";

// Diagnostica senza segreti: quali sorgenti dati sono attive.
// Da admin loggato fa anche una chiamata di prova alla Creators API.
export async function GET() {
  await connection();
  const db = supabaseConfigured() ? await fetchCatalogFromSupabase() : null;
  let creators: Record<string, unknown> = { configurata: creatorsApiConfigured() };
  // La prova live consuma una chiamata API (limite 1/s): solo per l'admin loggato
  const session = await readSession();
  const admin = session && session !== "expired" ? await isAdmin(session) : false;
  if (creatorsApiConfigured() && admin) {
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
