"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { signIn, signOut, requireSession } from "@/lib/admin/session";
import { adminRest, isAdmin, AdminDbError } from "@/lib/admin/db";
import { resolveAsin } from "@/lib/admin/resolve";
import { isValidAsin } from "@/lib/affiliate";

export type FormState = { error?: string; values?: Record<string, string> } | undefined;

// Dopo un errore React svuota il form: restituiamo i valori per ripopolarlo.
function keep(form: FormData): Record<string, string> {
  const v: Record<string, string> = {};
  for (const [k, x] of form.entries()) if (typeof x === "string" && k !== "password" && !k.startsWith("$")) v[k] = x;
  return v;
}

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Inserisci email e password.", values: keep(form) };
  if (!(await signIn(email, password))) return { error: "Email o password non corrette.", values: keep(form) };
  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/admin/login");
}

async function adminOrThrow() {
  const s = await requireSession();
  if (!s) redirect("/admin/login");
  if (!(await isAdmin(s))) throw new AdminDbError("Questo account non è abilitato come admin.");
  return s;
}

function lines(v: FormDataEntryValue | null): string[] {
  return String(v ?? "").split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 8);
}

export async function saveProductAction(_: FormState, form: FormData): Promise<FormState> {
  const mode = String(form.get("mode"));
  let asin = String(form.get("asin") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const imageUrl = String(form.get("image_url") ?? "").trim();

  if (!name) return { error: "Il nome è obbligatorio.", values: keep(form) };
  if (!category) return { error: "Scegli una categoria.", values: keep(form) };
  if (imageUrl && !/^https:\/\/([a-z0-9-]+\.)*(media-amazon\.com|ssl-images-amazon\.com)\//i.test(imageUrl)) {
    return { error: "L'immagine deve essere un link https di Amazon (es. da SiteStripe).", values: keep(form) };
  }

  try {
    const session = await adminOrThrow();
    if (mode === "new") {
      const resolved = await resolveAsin(String(form.get("link") ?? ""));
      if (!resolved) return { error: "Non riesco a leggere l'ASIN: incolla un link Amazon, un link amzn.to o il codice ASIN.", values: keep(form) };
      asin = resolved;
    }
    if (!isValidAsin(asin)) return { error: "ASIN non valido.", values: keep(form) };

    const row = {
      category,
      name: name.slice(0, 120),
      note: String(form.get("note") ?? "").trim().slice(0, 600),
      pros: lines(form.get("pros")),
      cons: lines(form.get("cons")),
      tags: String(form.get("tags") ?? "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 6),
      featured: form.get("featured") === "on",
      active: form.get("active") === "on",
      image_url: imageUrl || null,
      deal_only: form.get("deal_only") === "on",
    };

    const write = (r: Record<string, unknown>) => mode === "new"
      ? adminRest(session, "ar_products", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ asin, ...r }) })
      : adminRest(session, `ar_products?asin=eq.${asin}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(r) });
    try {
      await write(row);
    } catch (err) {
      // Colonna deal_only non ancora creata (SQL 0004): salva il resto
      if (!(err as Error).message.includes("deal_only")) throw err;
      if (row.deal_only) return { error: "Per usare “Solo in offerta” esegui prima su Supabase il file supabase-offerte.sql.", values: keep(form) };
      const { deal_only: _omit, ...rest } = row;
      void _omit;
      await write(rest);
    }
  } catch (err) {
    const msg = (err as Error).message;
    if (msg.includes("23505")) return { error: "Questo prodotto è già nel catalogo.", values: keep(form) };
    if (err instanceof AdminDbError) return { error: msg, values: keep(form) };
    throw err;
  }
  updateTag("catalog");
  redirect(`/admin?salvato=${asin}`);
}

export async function toggleAction(asin: string, field: "active" | "featured", value: boolean) {
  if (!isValidAsin(asin)) return;
  const session = await adminOrThrow();
  await adminRest(session, `ar_products?asin=eq.${asin}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ [field]: value }) });
  updateTag("catalog");
}

export async function deleteAction(asin: string) {
  if (!isValidAsin(asin)) return;
  const session = await adminOrThrow();
  await adminRest(session, `ar_products?asin=eq.${asin}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  updateTag("catalog");
  redirect("/admin");
}
