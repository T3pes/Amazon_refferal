"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireSession } from "@/lib/admin/session";
import { adminRest, isAdmin, AdminDbError } from "@/lib/admin/db";
import { isValidAsin } from "@/lib/affiliate";
import { parseTags, slugify } from "@/lib/guides";
import type { FormState } from "./actions";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,59}$/;

function keep(form: FormData): Record<string, string> {
  const v: Record<string, string> = {};
  for (const [k, x] of form.entries()) if (typeof x === "string" && !k.startsWith("$") && k !== "asins") v[k] = x;
  v.asins = form.getAll("asins").map(String).join(",");
  return v;
}

async function adminOrThrow() {
  const s = await requireSession();
  if (!s) redirect("/admin/login");
  if (!(await isAdmin(s))) throw new AdminDbError("Questo account non è abilitato come admin.");
  return s;
}

export async function saveGuideAction(_: FormState, form: FormData): Promise<FormState> {
  const mode = String(form.get("mode"));
  const title = String(form.get("title") ?? "").trim();
  const slug = mode === "new" ? slugify(String(form.get("slug") ?? "").trim() || title) : String(form.get("slug") ?? "");
  const endsOn = String(form.get("ends_on") ?? "").trim();

  if (title.length < 2) return { error: "Scrivi un titolo.", values: keep(form) };
  if (!SLUG_RE.test(slug)) return { error: "Indirizzo non valido: usa lettere, numeri e trattini.", values: keep(form) };
  if (endsOn && !/^\d{4}-\d{2}-\d{2}$/.test(endsOn)) return { error: "Data di fine non valida.", values: keep(form) };

  const row = {
    title: title.slice(0, 80),
    emoji: String(form.get("emoji") ?? "").trim().slice(0, 8) || "✨",
    intro: String(form.get("intro") ?? "").trim().slice(0, 600),
    tags: parseTags(String(form.get("tags") ?? "")),
    // l'ordine dei prodotti scelti segue l'ordine del catalogo nel form
    asins: [...new Set(form.getAll("asins").map(String).filter(isValidAsin))].slice(0, 60),
    ends_on: endsOn || null,
    active: form.get("active") === "on",
    sort: Math.max(0, Math.min(9999, Number(form.get("sort")) || 100)),
  };

  try {
    const session = await adminOrThrow();
    if (mode === "new") {
      await adminRest(session, "ar_guides", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ slug, ...row }) });
    } else {
      await adminRest(session, `ar_guides?slug=eq.${slug}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) });
    }
  } catch (err) {
    const msg = (err as Error).message;
    if (msg.includes("23505")) return { error: "Esiste già una guida con questo indirizzo: cambia titolo o indirizzo.", values: keep(form) };
    if (err instanceof AdminDbError) return { error: msg, values: keep(form) };
    throw err;
  }
  updateTag("catalog");
  redirect(`/admin/guide?salvata=${slug}`);
}

export async function toggleGuideAction(slug: string, value: boolean) {
  if (!SLUG_RE.test(slug)) return;
  const session = await adminOrThrow();
  await adminRest(session, `ar_guides?slug=eq.${slug}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ active: value }) });
  updateTag("catalog");
}

export async function deleteGuideAction(slug: string) {
  if (!SLUG_RE.test(slug)) return;
  const session = await adminOrThrow();
  await adminRest(session, `ar_guides?slug=eq.${slug}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  updateTag("catalog");
  redirect("/admin/guide?eliminata=1");
}
