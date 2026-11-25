import "server-only";
import { getCatalog } from "./catalog";
import { SITE } from "./site";
import { claimTelegramDeal } from "./supabase";
import { sendTelegram, telegramConfigured } from "./telegram";
import { productMessage } from "./telegram-format";

export type DealsRun = { inviate: string[]; giaInviate: number; offerte: number; nota?: string };

/** Pubblica sul canale le offerte nuove (o con sconto più alto), al massimo `max` per volta. */
export async function publishNewDeals(max = 5): Promise<DealsRun> {
  const cfg = telegramConfigured();
  if (!cfg.token || !cfg.chat) return { inviate: [], giaInviate: 0, offerte: 0, nota: "Telegram non configurato su Vercel." };
  const { deals, categories, offersKnown } = await getCatalog();
  if (!offersKnown) return { inviate: [], giaInviate: 0, offerte: 0, nota: "Amazon non fornisce ancora i dati sulle offerte (Creators API non attiva)." };

  const emojiOf = new Map(categories.map((c) => [c.slug, c.emoji]));
  const run: DealsRun = { inviate: [], giaInviate: 0, offerte: deals.length };
  for (const p of deals) {
    if (run.inviate.length >= max) break;
    const claim = await claimTelegramDeal(p.asin, p.live?.savingPercent ?? 0);
    if (claim === null) return { ...run, nota: "Registro Telegram mancante: esegui supabase-telegram.sql su Supabase." };
    if (!claim) { run.giaInviate++; continue; }
    await sendTelegram(productMessage(p, { emoji: emojiOf.get(p.category) ?? "🛍️", siteUrl: SITE.url, photo: p.imageUrl }), p.category);
    run.inviate.push(p.name);
    await new Promise((r) => setTimeout(r, 1200)); // limite Telegram sui canali
  }
  return run;
}
