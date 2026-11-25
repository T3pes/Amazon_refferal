"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/admin/session";
import { adminRest, isAdmin } from "@/lib/admin/db";
import { getCatalog } from "@/lib/catalog";
import { isValidAsin } from "@/lib/affiliate";
import { SITE } from "@/lib/site";
import { sendTelegram } from "@/lib/telegram";
import { publishNewDeals } from "@/lib/telegram-deals";
import { guideMessage, productMessage } from "@/lib/telegram-format";

export type TgState = { ok?: string; error?: string } | undefined;

async function adminOrNull() {
  const s = await requireSession();
  if (!s) redirect("/admin/login");
  return (await isAdmin(s)) ? s : null;
}

async function logManual(session: NonNullable<Awaited<ReturnType<typeof adminOrNull>>>, ref: string) {
  // Lo storico è facoltativo: se la tabella non c'è ancora, l'invio vale lo stesso
  await adminRest(session, "ar_telegram_posts", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ kind: "manuale", ref }) }).catch(() => {});
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
    await sendTelegram(productMessage(p, { emoji, siteUrl: SITE.url, photo: p.imageUrl }), p.category);
    await logManual(session, asin);
    return { ok: "Inviato sul gruppo Telegram." };
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
    if (r.nota) return { error: r.nota };
    if (r.inviate.length === 0) return { ok: r.offerte === 0 ? "Nessuna offerta sul sito in questo momento." : `Nessuna offerta nuova: ${r.giaInviate} già pubblicate negli ultimi 7 giorni.` };
    return { ok: `Pubblicate ${r.inviate.length} offerte: ${r.inviate.join(", ")}.` };
  } catch (err) {
    return { error: (err as Error).message };
  }
}
