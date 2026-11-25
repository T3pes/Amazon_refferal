import "server-only";
import type { Session } from "./session";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export class AdminDbError extends Error {}

/** Chiamata PostgREST con il token dell'admin: valgono le policy RLS dell'admin. */
export async function adminRest<T = unknown>(session: Session, path: string, init: RequestInit = {}): Promise<T> {
  if (!URL_ || !KEY) throw new AdminDbError("Supabase non configurato");
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new AdminDbError(`Database: HTTP ${res.status} ${text.slice(0, 200)}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export type AdminProduct = {
  asin: string; category: string; name: string; note: string;
  pros: string[]; cons: string[]; tags: string[];
  featured: boolean; active: boolean; image_url: string | null; sort: number;
};

export type ClickStat = { asin: string; clic_7g: number; clic_30g: number; clic_totali: number };

export async function isAdmin(session: Session): Promise<boolean> {
  try {
    const r = await adminRest<boolean>(session, "rpc/ar_is_admin", { method: "POST", body: "{}" });
    return r === true;
  } catch {
    return false;
  }
}
