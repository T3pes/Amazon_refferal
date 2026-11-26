import "server-only";
import { getCatalog } from "./catalog";
import { SITE } from "./site";
import { claimTelegramDeal, claimTelegramNew } from "./supabase";
import { sendTelegram, telegramConfigured } from "./telegram";
import { productMessage } from "./telegram-format";

export type DealsRun = { inviate: string[]; giaInviate: number; offerte: number; novita: number; note: string[] };

const pause = () => new Promise((r) => setTimeout(r, 1200)); // limite Telegram sui gruppi

/**
 * Pubblica nel gruppo, al massimo `max` messaggi per volta:
 * 1. le offerte nuove (o con sconto più alto), se Amazon fornisce i dati;
 * 2. i prodotti aggiunti a mano e mai inviati prima (funziona anche senza Creators API).
 */
export async function publishNewDeals(max = 5): Promise<DealsRun> {
  const run: DealsRun = { inviate: [], giaInviate: 0, offerte: 0, novita: 0, note: [] };
  const cfg = telegramConfigured();
  if (!cfg.token || !cfg.chat) return { ...run, note: ["Telegram non configurato su Vercel."] };
  const { deals, products, categories, offersKnown } = await getCatalog();
  const emojiOf = new Map(categories.map((c) => [c.slug, c.emoji]));
  const send = (p: (typeof products)[number]) =>
    sendTelegram(productMessage(p, { emoji: emojiOf.get(p.category) ?? "🛍️", siteUrl: SITE.url, photo: p.imageUrl }), p.category);

  if (offersKnown) {
    run.offerte = deals.length;
    for (const p of deals) {
      if (run.inviate.length >= max) break;
      const claim = await claimTelegramDeal(p.asin, p.live?.savingPercent ?? 0);
      if (claim === null) { run.note.push("Registro Telegram mancante: esegui supabase-telegram.sql su Supabase."); break; }
      if (!claim) { run.giaInviate++; continue; }
      await send(p);
      run.inviate.push(p.name);
      await pause();
    }
  }

  // Prodotti nuovi: quelli "solo in offerta" aspettano lo sconto, gli altri partono subito
  for (const p of products.filter((x) => !x.dealOnly)) {
    if (run.inviate.length >= max) break;
    const claim = await claimTelegramNew(p.asin);
    if (claim === null) { run.note.push("Per inviare i prodotti nuovi esegui supabase-telegram-novita.sql su Supabase."); break; }
    if (!claim) continue;
    await send(p);
    run.inviate.push(p.name);
    run.novita++;
    await pause();
  }
  return run;
}
