import "server-only";
import { extractAsin } from "@/lib/affiliate";

const SHORT_HOSTS = new Set(["amzn.to", "amzn.eu", "a.co"]);

/** ASIN da: codice ASIN, link amazon.it oppure short link amzn.to (seguito solo verso Amazon). */
export async function resolveAsin(input: string): Promise<string | null> {
  const direct = extractAsin(input);
  if (direct) return direct;
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !SHORT_HOSTS.has(url.hostname)) return null;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "manual", cache: "no-store" });
    const loc = res.headers.get("location");
    if (!loc) return null;
    const target = new URL(loc, url);
    if (!/(^|\.)amazon\.[a-z.]+$/.test(target.hostname)) return null;
    return extractAsin(target.toString());
  } catch {
    return null;
  }
}
