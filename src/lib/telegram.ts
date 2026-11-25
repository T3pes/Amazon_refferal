import "server-only";
import type { TelegramMessage } from "./telegram-format";
import { parseTopics, topicFor } from "./telegram-topics";

// Bot Telegram: TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID solo nelle variabili di Vercel.
const TOKEN = () => process.env.TELEGRAM_BOT_TOKEN?.trim();
const CHAT = () => process.env.TELEGRAM_CHAT_ID?.trim();

export function telegramConfigured() {
  return { token: Boolean(TOKEN()), chat: Boolean(CHAT()), topics: parseTopics(process.env.TELEGRAM_TOPICS ?? "") };
}

/** Argomento del gruppo per una categoria del sito (guide e categorie senza argomento → General). */
export function threadFor(category?: string): number | undefined {
  return topicFor(parseTopics(process.env.TELEGRAM_TOPICS ?? ""), category ?? "general");
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

export async function sendTelegram(msg: TelegramMessage, category?: string): Promise<void> {
  const chat_id = CHAT();
  if (!chat_id) throw new Error("Manca TELEGRAM_CHAT_ID su Vercel.");
  const reply_markup = { inline_keyboard: [[{ text: msg.buttonText, url: msg.buttonUrl }]] };
  const message_thread_id = threadFor(category);
  if (msg.photo) {
    try {
      await call("sendPhoto", { chat_id, message_thread_id, photo: msg.photo, caption: msg.text, parse_mode: "HTML", reply_markup });
      return;
    } catch {
      /* se la foto non va, invia almeno il testo */
    }
  }
  await call("sendMessage", { chat_id, message_thread_id, text: msg.text, parse_mode: "HTML", reply_markup, link_preview_options: { is_disabled: true } });
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
  type M = { chat: C; message_thread_id?: number; is_topic_message?: boolean; forum_topic_created?: { name: string }; reply_to_message?: { forum_topic_created?: { name: string } } };
  type U = { channel_post?: M; my_chat_member?: { chat: C }; message?: M };
  const updates = await call<U[]>("getUpdates", { allowed_updates: ["channel_post", "my_chat_member", "message"] });
  const seen = new Map<number, FoundChat>();
  for (const u of updates) {
    const m = u.message ?? u.channel_post;
    const c = m?.chat ?? u.my_chat_member?.chat;
    if (!c || c.type === "private") continue;
    const chat = seen.get(c.id) ?? { id: c.id, title: c.title ?? c.username ?? String(c.id), type: c.type, topics: [] };
    const name = m?.forum_topic_created?.name ?? m?.reply_to_message?.forum_topic_created?.name;
    if (m?.message_thread_id && m.is_topic_message !== false && name && !chat.topics.some((t) => t.id === m.message_thread_id)) {
      chat.topics.push({ id: m.message_thread_id, name });
    }
    seen.set(c.id, chat);
  }
  return [...seen.values()];
}
