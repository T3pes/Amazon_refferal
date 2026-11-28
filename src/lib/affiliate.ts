export const AMAZON_DOMAIN = "www.amazon.it";
export const DEFAULT_PARTNER_TAG = "dealsforev0bc-21";

export function partnerTag(): string {
  return process.env.AMAZON_PARTNER_TAG?.trim() || DEFAULT_PARTNER_TAG;
}

const ASIN_RE = /^[A-Z0-9]{10}$/;

export function isValidAsin(asin: string): boolean {
  return ASIN_RE.test(asin);
}

/** Link affiliato standard: https://www.amazon.it/dp/ASIN?tag=TAG */
export function buildAffiliateUrl(asin: string, tag: string = partnerTag()): string {
  const clean = asin.trim().toUpperCase();
  if (!isValidAsin(clean)) throw new Error(`ASIN non valido: ${asin}`);
  return `https://${AMAZON_DOMAIN}/dp/${clean}?tag=${encodeURIComponent(tag)}`;
}

/** Accetta un ASIN o un link Amazon e restituisce l'ASIN. */
export function extractAsin(input: string): string | null {
  const s = input.trim();
  if (isValidAsin(s.toUpperCase())) return s.toUpperCase();
  const m = s.match(/(?:\/dp\/|\/gp\/product\/|\/gp\/aw\/d\/|\/ASIN\/)([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : null;
}

/** Usa il link di Amazon solo se porta il nostro tag; altrimenti il link standard con il tag. */
export function withPartnerTag(url: string | null | undefined, asin: string, tag: string = partnerTag()): string {
  try {
    if (url) {
      const u = new URL(url);
      if (/(^|\.)amazon\.it$/.test(u.hostname) && u.searchParams.get("tag") === tag) return url;
    }
  } catch {}
  return buildAffiliateUrl(asin, tag);
}
