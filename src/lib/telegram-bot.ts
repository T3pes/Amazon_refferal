import "server-only";
import { createHash } from "node:crypto";
import { resolveAsin } from "./admin/resolve";
import { parseShare } from "./bot-share";
import { SITE } from "./site";
import { rpc } from "./supabase";
import { escapeHtml, productMessage } from "./telegram-format";
import { sendTelegram, tgCall } from "./telegram";

// Bot per aggiungere prodotti dal telefono: Flavio condivide un prodotto dall'app Amazon
// in privato a @sconti_sales_bot, sceglie la categoria e il prodotto va sul sito e nel gruppo.
// Non legge nulla dalle pagine Amazon: serve solo il codice del prodotto (il link col tag lo crea il sito).

/** Chiave del bot ricavata da CRON_SECRET: firma il webhook e autorizza le funzioni SQL. */
export function botKey(): string | null {
  const s = process.env.CRON_SECRET?.trim();
  return s ? createHash("sha256").update(`${s}:telegram-bot`).digest("hex") : null;
}

export function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/** Solo chi è amministratore del gruppo può usare il bot. */
async function isGroupAdmin(userId: number): Promise<boolean> {
  const chat_id = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!chat_id) return false;
  try {
    const m = await tgCall<{ status: string }>("getChatMember", { chat_id, user_id: userId });
    return m.status === "creator" || m.status === "administrator";
  } catch {
    return false;
  }
}

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
async function rest<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}` }, cache: "no-store" });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

type Cat = { slug: string; name: string; emoji: string };
const categories = async () => (await rest<Cat[]>("ar_categories?select=slug,name,emoji&order=sort,slug")) ?? [];

const reply = (chat_id: number, text: string, extra: Record<string, unknown> = {}) =>
  tgCall("sendMessage", { chat_id, text, parse_mode: "HTML", link_preview_options: { is_disabled: true }, ...extra }).catch(() => {});

const HELP = [
  "👋 <b>Aggiungi prodotti da qui</b>",
  "",
  "1. Nell'app Amazon apri un prodotto e premi <b>Condividi</b> → Telegram → questo bot.",
  "2. Scegli la categoria con i pulsanti.",
  "",
  "Il prodotto va sul sito con il tuo link referral e viene pubblicato nel gruppo.",
  "Se il nome non va bene, scrivimelo prima di scegliere la categoria.",
].join("\n");

type Msg = { message_id: number; chat: { id: number; type: string }; from?: { id: number }; text?: string; caption?: string };
type Cb = { id: string; from: { id: number }; data?: string; message?: Msg };
export type Update = { message?: Msg; callback_query?: Cb };

export async function handleUpdate(u: Update, key: string): Promise<void> {
  if (u.callback_query) return onCallback(u.callback_query, key);
  const m = u.message;
  if (!m || m.chat.type !== "private" || !m.from) return;
  if (!(await isGroupAdmin(m.from.id))) return void reply(m.chat.id, "Questo bot è riservato agli amministratori del gruppo.");
  const text = (m.text ?? m.caption ?? "").trim();
  if (!text || text.startsWith("/start") || text.startsWith("/aiuto")) return void reply(m.chat.id, HELP);

  const { link, name } = parseShare(text);
  const asin = await resolveAsin(link ?? text);
  if (!asin) {
    if (link) return void reply(m.chat.id, "Non riesco a leggere il prodotto da questo link. Condividilo dall'app Amazon o incolla un link amazon.it.");
    // Testo senza link: è il nome dell'ultimo prodotto in attesa di categoria
    const renamed = await rpc<string | null>("ar_bot_rename_last", { p_key: key, p_name: text });
    return void reply(m.chat.id, renamed ? `✏️ Nome aggiornato: <b>${escapeHtml(text.slice(0, 120))}</b>. Ora scegli la categoria qui sopra.` : HELP);
  }

  const outcome = await rpc<string>("ar_bot_add_product", { p_key: key, p_asin: asin, p_name: name || `Prodotto ${asin}` });
  if (outcome === "esiste") return void reply(m.chat.id, `ℹ️ Questo prodotto è già nel catalogo: ${SITE.url}/p/${asin}`);
  if (outcome !== "nuovo") return void reply(m.chat.id, "⚠️ Bot non collegato al sito: apri /admin/telegram e premi «Collega il bot».");

  const cats = await categories();
  const rows: { text: string; callback_data: string }[][] = [];
  cats.forEach((c, i) => {
    const b = { text: `${c.emoji} ${c.name}`.slice(0, 40), callback_data: `c|${asin}|${c.slug}`.slice(0, 64) };
    if (i % 2 === 0) rows.push([b]); else rows[rows.length - 1].push(b);
  });
  const lines = [`🆕 <b>${escapeHtml(name || `Prodotto ${asin}`)}</b>`, "", "In quale categoria lo pubblico?"];
  if (!name) lines.push("", "<i>Scrivimi il nome del prodotto prima di scegliere.</i>");
  await reply(m.chat.id, lines.join("\n"), { reply_markup: { inline_keyboard: rows } });
}

async function onCallback(cb: Cb, key: string): Promise<void> {
  const answer = (text: string) => tgCall("answerCallbackQuery", { callback_query_id: cb.id, text }).catch(() => {});
  if (!(await isGroupAdmin(cb.from.id))) return void answer("Non autorizzato.");
  const [kind, asin, slug] = (cb.data ?? "").split("|");
  if (kind !== "c" || !asin || !slug) return void answer("Pulsante non valido.");

  const ok = await rpc<boolean>("ar_bot_publish", { p_key: key, p_asin: asin, p_category: slug });
  if (!ok) return void answer("Non sono riuscito a pubblicarlo.");
  type Row = { asin: string; name: string; note: string; pros: string[] | null; featured: boolean; image_url: string | null };
  const p = (await rest<Row[]>(`ar_products?asin=eq.${asin}&select=asin,name,note,pros,featured,image_url`))?.[0];
  const cat = (await categories()).find((c) => c.slug === slug);
  let posted = "";
  if (p) {
    try {
      const id = await sendTelegram(productMessage({ ...p, pros: p.pros ?? [], live: null }, { emoji: cat?.emoji ?? "🛍️", siteUrl: SITE.url, photo: p.image_url }), slug);
      await rpc("ar_bot_log_post", { p_key: key, p_ref: asin, p_message_id: id });
      posted = " e nel gruppo";
    } catch (err) {
      posted = ` (gruppo: ${(err as Error).message})`;
    }
  }
  await answer("Pubblicato!");
  if (cb.message) {
    await tgCall("editMessageText", {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      parse_mode: "HTML",
      text: `✅ <b>${escapeHtml(p?.name ?? asin)}</b>\nPubblicato in ${escapeHtml(cat ? `${cat.emoji} ${cat.name}` : slug)} sul sito${posted}.\n${SITE.url}/p/${asin}\n\n<i>Foto, descrizione e punti forti li puoi aggiungere dall'admin.</i>`,
      link_preview_options: { is_disabled: true },
    }).catch(() => {});
  }
}

/** Collega il bot al sito: webhook firmato verso /api/telegram/bot. */
export async function connectWebhook(): Promise<void> {
  const key = botKey();
  if (!key) throw new Error("Manca CRON_SECRET su Vercel.");
  await tgCall("setWebhook", {
    url: `${SITE.url}/api/telegram/bot`,
    secret_token: key,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  });
  await tgCall("setMyCommands", { commands: [{ command: "aiuto", description: "Come aggiungere un prodotto" }], scope: { type: "all_private_chats" } }).catch(() => {});
}
