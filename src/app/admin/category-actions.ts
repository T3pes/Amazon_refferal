"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireSession } from "@/lib/admin/session";
import { adminRest, isAdmin, AdminDbError } from "@/lib/admin/db";
import { slugify } from "@/lib/guides";
import { createTopic, renameTopic, telegramConfigured } from "@/lib/telegram";
import type { FormState } from "./actions";
import type { Session } from "@/lib/admin/session";

type Row = { slug: string; name: string; telegram_topic?: number | null };

/**
 * Crea l'argomento Telegram della categoria e lo salva sulla categoria.
 * Restituisce un esito da mostrare in admin (mai un errore bloccante: la categoria resta salvata).
 */
async function linkTopic(session: Session, slug: string, name: string): Promise<string> {
  const cfg = telegramConfigured();
  if (!cfg.token || !cfg.chat) return "telegram-off";
  let id: number;
  try {
    id = await createTopic(name);
  } catch (e) {
    const m = (e as Error).message;
    return /not enough rights|CHAT_ADMIN_REQUIRED|manage/i.test(m) ? "telegram-permessi" : "telegram-errore";
  }
  try {
    await adminRest(session, `ar_categories?slug=eq.${slug}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ telegram_topic: id }) });
  } catch {
    return `telegram-sql-${id}`;
  }
  return "telegram-ok";
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,39}$/;

async function adminOrThrow() {
  const s = await requireSession();
  if (!s) redirect("/admin/login");
  if (!(await isAdmin(s))) throw new AdminDbError("Questo account non è abilitato come admin.");
  return s;
}

function keep(form: FormData): Record<string, string> {
  const v: Record<string, string> = {};
  for (const [k, x] of form.entries()) if (typeof x === "string" && !k.startsWith("$")) v[k] = x;
  return v;
}

export async function saveCategoryAction(_: FormState, form: FormData): Promise<FormState> {
  const mode = String(form.get("mode"));
  const name = String(form.get("name") ?? "").trim();
  const slug = mode === "new" ? slugify(String(form.get("slug") ?? "").trim() || name) : String(form.get("slug") ?? "");
  if (name.length < 2) return { error: "Scrivi un nome.", values: keep(form) };
  if (!SLUG_RE.test(slug)) return { error: "Indirizzo non valido: usa lettere, numeri e trattini.", values: keep(form) };

  const row = {
    name: name.slice(0, 40),
    emoji: String(form.get("emoji") ?? "").trim().slice(0, 8) || "🛍️",
    blurb: String(form.get("blurb") ?? "").trim().slice(0, 160),
    sort: Math.max(0, Math.min(999, Number(form.get("sort")) || 0)),
  };
  let esito = "";
  try {
    const session = await adminOrThrow();
    if (mode === "new") {
      await adminRest(session, "ar_categories", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ slug, ...row }) });
      esito = await linkTopic(session, slug, row.name);
    } else {
      const [old] = await adminRest<Row[]>(session, `ar_categories?select=*&slug=eq.${slug}`);
      await adminRest(session, `ar_categories?slug=eq.${slug}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) });
      if (old?.telegram_topic && old.name !== row.name) {
        await renameTopic(old.telegram_topic, row.name).catch(() => { esito = "telegram-errore"; });
      }
    }
  } catch (err) {
    const msg = (err as Error).message;
    if (msg.includes("23505")) return { error: "Esiste già una categoria con questo indirizzo.", values: keep(form) };
    if (err instanceof AdminDbError) return { error: msg, values: keep(form) };
    throw err;
  }
  updateTag("catalog");
  redirect(`/admin/categorie?salvata=${slug}${esito ? `&esito=${esito}` : ""}`);
}

export async function deleteCategoryAction(slug: string) {
  if (!SLUG_RE.test(slug)) return;
  const session = await adminOrThrow();
  const used = await adminRest<{ asin: string }[]>(session, `ar_products?select=asin&category=eq.${slug}&limit=1`);
  if (used.length) redirect("/admin/categorie?errore=usata");
  await adminRest(session, `ar_categories?slug=eq.${slug}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  updateTag("catalog");
  redirect("/admin/categorie?eliminata=1");
}

/** Per le categorie senza argomento: lo crea ora. */
export async function createTopicAction(slug: string) {
  if (!SLUG_RE.test(slug)) return;
  const session = await adminOrThrow();
  const [cat] = await adminRest<Row[]>(session, `ar_categories?select=*&slug=eq.${slug}`);
  if (!cat) return;
  const esito = cat.telegram_topic ? "telegram-ok" : await linkTopic(session, slug, cat.name);
  redirect(`/admin/categorie?salvata=${slug}&esito=${esito}`);
}
