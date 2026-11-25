import "server-only";
import { redirect } from "next/navigation";
import { readSession, type Session } from "@/lib/admin/session";
import { isAdmin } from "@/lib/admin/db";

/** Per le pagine admin: sessione valida e abilitata, altrimenti redirect. */
export async function guard(path: string): Promise<Session | "not-admin"> {
  const s = await readSession();
  if (s === "expired") redirect(`/admin/sessione?next=${encodeURIComponent(path)}`);
  if (!s) redirect("/admin/login");
  return (await isAdmin(s)) ? s : "not-admin";
}
