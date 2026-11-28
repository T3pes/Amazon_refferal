"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/admin/session";
import { adminRest, isAdmin } from "@/lib/admin/db";
import { getCatalog } from "@/lib/catalog";
import { isValidAsin } from "@/lib/affiliate";
import { SITE } from "@/lib/site";
import { deleteTelegram, sendTelegram } from "@/lib/telegram";
import { publishNewDeals } from "@/lib/telegram-deals";
import { guideMessage, productMessage } from "@/lib/telegram-format";
import { botKey, connectWebhook, sha256 } from "@/lib/telegram-bot";

export type TgState = { ok?: string; error?: string } | undefined;

async function adminOrNull() {
  const s = await requireSession();
  if (!s) redirect("/admin/login");
  return (await isAdmin(s)) ? s : null;
}

type AdminSession = NonNullable<Awaited<ReturnType<typeof adminOrNull>>>;

async function logManual(session: AdminSession, ref: string, messageId?: number) {
  // Lo storico è facoltativo: se la tabella non c'è ancora, l'invio vale lo stesso
  await adminRest(session, "ar_telegram_posts", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ kind: "manuale", ref, message_id: messageId ?? null }) }).catch(() => {});
}

/** Cancella dal gruppo i messaggi già inviati per questo prodotto/guida (se ne conosciamo il numero). */
async function removePrevious(session: AdminSession, ref: string): Promise<number> {
  const rows = await adminRest<{ id: number; message_id: number | null }[]>(session, `ar_telegram_posts?select=id,message_id&ref=eq.${encodeURIComponent(ref)}&message_id=not.is.null`).catch(() => []);
  let n = 0;
  for (const r of rows) {
    if (r.message_id && (await deleteTelegram(r.message_id))) n++;
  }
  return n;
}

export async function sendProductAction(_: TgState, form: FormData): Promise<TgState> {
  const session = await adminOrNull();
  if (!session) return { error: "Account non abilitato." };
  const asin = String(form.get("asin") ?? "");
  if (!isValidAsin(asin)) return { error: "ASIN non valido." };
  const { products, categories } = await getCatalog();
  const p = products.find((x) => x.asin === asin);
  if (!p) return { error: "Il prodotto non è visibile sul sito: rendilo visibile prima di inviarlo." };
  try {
    const emoji = categories.find((c) => c.slug === p.category)?.emoji ?? "🛍️";
    const removed = await removePrevious(session, asin);
    const id = await sendTelegram(productMessage(p, { emoji, siteUrl: SITE.url, photo: p.imageUrl }), p.category);
    await logManual(session, asin, id);
    if (removed) return { ok: `Inviato nel gruppo al posto del messaggio precedente (argomento ${categories.find((c) => c.slug === p.category)?.name ?? p.category}).` };
    return { ok: `Inviato nel gruppo${p.category ? ` (argomento ${categories.find((c) => c.slug === p.category)?.name ?? p.category})` : ""}.` };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function sendGuideAction(_: TgState, form: FormData): Promise<TgState> {
  const session = await adminOrNull();
  if (!session) return { error: "Account non abilitato." };
  const slug = String(form.get("slug") ?? "");
  const { guides } = await getCatalog();
  const g = guides.find((x) => x.slug === slug);
  if (!g) return { error: "La guida non è online (nascosta, scaduta o senza prodotti)." };
  try {
    await sendTelegram(guideMessage({ ...g, count: g.products.length }, SITE.url));
    await logManual(session, slug);
    return { ok: "Guida inviata sul gruppo." };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function sendTestAction(): Promise<TgState> {
  if (!(await adminOrNull())) return { error: "Account non abilitato." };
  try {
    await sendTelegram({ text: `✅ <b>${SITE.name}</b> è collegato a questo gruppo.`, buttonText: "Apri il sito", buttonUrl: SITE.url });
    return { ok: "Messaggio di prova inviato: controlla il gruppo." };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function publishDealsNowAction(): Promise<TgState> {
  if (!(await adminOrNull())) return { error: "Account non abilitato." };
  try {
    const r = await publishNewDeals();
    if (r.inviate.length === 0) {
      if (r.note.length) return { error: r.note.join(" ") };
      return { error: "Nessun messaggio inviato: non ci sono prodotti nuovi né offerte da pubblicare. I prodotti già presenti contano come già annunciati: per mandarne uno usa \"Invia\" qui sotto." };
    }
    return { ok: `Inviati ${r.inviate.length} prodotti: ${r.inviate.join(", ")}.${r.note.length ? ` ${r.note.join(" ")}` : ""}` };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/** Collega il bot: webhook verso il sito + chiave salvata su Supabase (solo admin). */
export async function connectBotAction(): Promise<TgState> {
  const session = await adminOrNull();
  if (!session) return { error: "Account non abilitato." };
  const key = botKey();
  if (!key) return { error: "Manca CRON_SECRET su Vercel." };
  try {
    const ok = await adminRest<boolean>(session, "rpc/ar_bot_set_key", { method: "POST", body: JSON.stringify({ p_hash: sha256(key) }) });
    if (ok !== true) return { error: "Supabase non ha accettato la chiave del bot." };
    await connectWebhook();
    return { ok: "Bot collegato: scrivigli in privato e condividi un prodotto dall'app Amazon." };
  } catch (err) {
    return { error: (err as Error).message };
  }
}
