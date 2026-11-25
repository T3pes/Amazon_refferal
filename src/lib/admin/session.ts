import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";

// Sessione admin: token Supabase Auth in cookie httpOnly.
// I permessi veri li fa il database (RLS con ar_is_admin()).
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const AT = "df_at";
const RT = "df_rt";

export type Session = { token: string; email: string };

type TokenResponse = { access_token: string; refresh_token: string; expires_in: number; user?: { email?: string } };

function decode(token: string): { exp?: number; email?: string } {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
  } catch {
    return {};
  }
}

async function authRequest(grant: "password" | "refresh_token", body: Record<string, string>): Promise<TokenResponse | null> {
  if (!URL_ || !KEY) return null;
  const res = await fetch(`${URL_}/auth/v1/token?grant_type=${grant}`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as TokenResponse;
}

async function store(t: TokenResponse) {
  const jar = await cookies();
  const base = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
  jar.set(AT, t.access_token, { ...base, maxAge: t.expires_in });
  jar.set(RT, t.refresh_token, { ...base, maxAge: 60 * 60 * 24 * 30 });
}

/** Solo in Server Action / Route Handler (scrive cookie). */
export async function signIn(email: string, password: string): Promise<boolean> {
  const t = await authRequest("password", { email, password });
  if (!t) return false;
  await store(t);
  return true;
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(AT);
  jar.delete(RT);
}

/** Legge la sessione. Se il token è scaduto restituisce `expired` (va rinnovato in una route). */
export async function readSession(): Promise<Session | "expired" | null> {
  const jar = await cookies();
  const token = jar.get(AT)?.value;
  if (!token) return jar.get(RT)?.value ? "expired" : null;
  const { exp, email } = decode(token);
  await connection(); // l'ora attuale va letta a ogni richiesta, mai in un prerender
  if (!exp || exp * 1000 < Date.now() + 30_000) return jar.get(RT)?.value ? "expired" : null;
  return { token, email: email ?? "" };
}

/** Solo in Server Action / Route Handler: rinnova il token con il refresh token. */
export async function refreshSession(): Promise<Session | null> {
  const jar = await cookies();
  const rt = jar.get(RT)?.value;
  if (!rt) return null;
  const t = await authRequest("refresh_token", { refresh_token: rt });
  if (!t) {
    await signOut();
    return null;
  }
  await store(t);
  return { token: t.access_token, email: decode(t.access_token).email ?? "" };
}

/** Per le Server Action: sessione valida o null (rinnova se serve). */
export async function requireSession(): Promise<Session | null> {
  const s = await readSession();
  if (s === "expired") return refreshSession();
  return s;
}
