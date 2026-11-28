import "server-only";
import type { TelegramMessage } from "./telegram-format";
import { parseTopics, topicFor } from "./telegram-topics";
import { fetchCategoryTopics } from "./supabase";

// Bot Telegram: TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID solo nelle variabili di Vercel.
const TOKEN = () => process.env.TELEGRAM_BOT_TOKEN?.trim();
const CHAT = () => process.env.TELEGRAM_CHAT_ID?.trim();

export function telegramConfigured() {
  return { token: Boolean(TOKEN()), chat: Boolean(CHAT()), topics: parseTopics(process.env.TELEGRAM_TOPICS ?? "") };
}

/**
 * Argomento del gruppo per una categoria del sito (guide e categorie senza argomento → General).
 * Prima l'argomento salvato sulla categoria (creato in automatico), poi TELEGRAM_TOPICS.
 */
export async function threadFor(category?: string): Promise<number | undefined> {
  const topics = { ...parseTopics(process.env.TELEGRAM_TOPICS ?? ""), ...(await fetchCategoryTopics()) };
  return topicFor(topics, category ?? "general");
}

/** Crea un argomento nel gruppo (il bot deve poter gestire gli argomenti). Restituisce il suo numero. */
export async function createTopic(name: string): Promise<number> {
  const chat_id = CHAT();
  if (!chat_id) throw new Error("Manca TELEGRAM_CHAT_ID su Vercel.");
  const r = await call<{ message_thread_id: number }>("createForumTopic", { chat_id, name: name.slice(0, 128) });
  return r.message_thread_id;
}

/** Rinomina un argomento esistente. */
export async function renameTopic(id: number, name: string): Promise<void> {
  const chat_id = CHAT();
  if (!chat_id) return;
  await call("editForumTopic", { chat_id, message_thread_id: id, name: name.slice(0, 128) });
}

/** Chiamata generica alla Bot API (serve al bot che riceve i link). */
export function tgCall<T>(method: string, body?: Record<string, unknown>): Promise<T> {
  return call<T>(method, body);
}

async function call<T>(method: string, body?: Record<string, unknown>): Promise<T> {
  const token = TOKEN();
  if (!token) throw new Error("Manca TELEGRAM_BOT_TOKEN su Vercel.");
  const res = await fetch(`${process.env.TELEGRAM_API_BASE ?? "https://api.telegram.org"}/bot${token}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; result?: T; description?: string };
  if (!json.ok) throw new Error(`Telegram: ${json.description ?? `HTTP ${res.status}`}`);
  return json.result as T;
}

/** Invia il messaggio e restituisce il suo numero (serve per poterlo cancellare o sostituire). */
export async function sendTelegram(msg: TelegramMessage, category?: string): Promise<number> {
  const chat_id = CHAT();
  if (!chat_id) throw new Error("Manca TELEGRAM_CHAT_ID su Vercel.");
  const reply_markup = { inline_keyboard: [[{ text: msg.buttonText, url: msg.buttonUrl }]] };
  const message_thread_id = await threadFor(category);
  if (msg.photo) {
    try {
      const r = await call<{ message_id: number }>("sendPhoto", { chat_id, message_thread_id, photo: msg.photo, caption: msg.text, parse_mode: "HTML", reply_markup });
      return r.message_id;
    } catch {
      /* se la foto non va, invia almeno il testo */
    }
  }
  const r = await call<{ message_id: number }>("sendMessage", { chat_id, message_thread_id, text: msg.text, parse_mode: "HTML", reply_markup, link_preview_options: { is_disabled: true } });
  return r.message_id;
}

export async function botInfo(): Promise<{ username: string } | null> {
  try { return await call<{ username: string }>("getMe"); } catch { return null; }
}

export type FoundChat = { id: number; title: string; type: string; topics: { id: number; name: string }[] };

/**
 * Gruppi/canali (e argomenti) in cui il bot ha visto messaggi di recente:
 * serve a trovare l'ID del gruppo e quello di ogni argomento.
 */
export async function recentChats(): Promise<FoundChat[]> {
  type C = { id: number; title?: string; type: string; username?: string };
  type M = { chat: C; message_thread_id?: number; is_topic_message?: boolean; forum_topic_created?: { name: string }; reply_to_message?: { forum_topic_created?: { name: string } }; text?: string };
  type U = { channel_post?: M; my_chat_member?: { chat: C }; message?: M };
  const updates = await call<U[]>("getUpdates", { allowed_updates: ["channel_post", "my_chat_member", "message"] });
  const seen = new Map<number, FoundChat>();
  for (const u of updates) {
    const m = u.message ?? u.channel_post;
    const c = m?.chat ?? u.my_chat_member?.chat;
    if (!c || c.type === "private") continue;
    const chat = seen.get(c.id) ?? { id: c.id, title: c.title ?? c.username ?? String(c.id), type: c.type, topics: [] };
    const name = m?.forum_topic_created?.name ?? m?.reply_to_message?.forum_topic_created?.name;
    const tid = m?.message_thread_id;
    if (tid && m.is_topic_message !== false) {
      const known = chat.topics.find((t) => t.id === tid);
      if (!known) chat.topics.push({ id: tid, name: name ?? `argomento #${tid}${m.text ? ` («${m.text.slice(0, 30)}»)` : ""}` });
      else if (name && known.name.startsWith("argomento #")) known.name = name;
    }
    seen.set(c.id, chat);
  }
  return [...seen.values()];
}

export type BotDiagnosis = { webhook?: string; pending: number; lastError?: string; readsAll?: boolean };

/** Perché il bot non vede i messaggi: webhook di un altro servizio, privacy, errori. */
export async function botDiagnosis(): Promise<BotDiagnosis> {
  const w = await call<{ url?: string; pending_update_count?: number; last_error_message?: string }>("getWebhookInfo");
  const me = await call<{ can_read_all_group_messages?: boolean }>("getMe");
  return { webhook: w.url || undefined, pending: w.pending_update_count ?? 0, lastError: w.last_error_message, readsAll: me.can_read_all_group_messages };
}

/** Cancella un messaggio del bot nel gruppo (Telegram lo permette entro 48 ore). true se cancellato. */
export async function deleteTelegram(messageId: number): Promise<boolean> {
  const chat_id = CHAT();
  if (!chat_id) return false;
  try { await call("deleteMessage", { chat_id, message_id: messageId }); return true; } catch { return false; }
}
