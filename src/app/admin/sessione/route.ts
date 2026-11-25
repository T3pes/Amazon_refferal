import { refreshSession } from "@/lib/admin/session";

// Rinnova il token scaduto e torna alla pagina admin richiesta.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") ?? "/admin";
  const safeNext = next.startsWith("/admin") ? next : "/admin";
  const s = await refreshSession();
  return Response.redirect(new URL(s ? safeNext : "/admin/login", url), 303);
}
