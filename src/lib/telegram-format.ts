// Testi dei messaggi Telegram (puri e testati).
// I pulsanti portano alla pagina del sito, non direttamente ad Amazon:
// il programma Affiliazione non consente link affiliati in canali/gruppi privati.

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function withUtm(url: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "telegram");
  u.searchParams.set("utm_medium", "canale");
  return u.toString();
}

type MsgProduct = {
  asin: string; name: string; note: string; featured?: boolean;
  live: { price?: string; listPrice?: string; savingPercent?: number } | null;
};

export type TelegramMessage = { text: string; buttonText: string; buttonUrl: string; photo?: string | null };

export function productMessage(p: MsgProduct, opts: { emoji: string; siteUrl: string; photo?: string | null }): TelegramMessage {
  const saving = p.live?.savingPercent ?? 0;
  const lines: string[] = [];
  if (saving > 0) lines.push(`🔥 <b>OFFERTA −${saving}%</b>`);
  else if (p.featured) lines.push("⭐ <b>Uno dei miei preferiti</b>");
  lines.push(`${opts.emoji} <b>${escapeHtml(p.name)}</b>`);
  if (p.live?.price) {
    lines.push(`💶 <b>${escapeHtml(p.live.price)}</b>${p.live.listPrice && saving > 0 ? ` invece di <s>${escapeHtml(p.live.listPrice)}</s>` : ""}`);
  }
  if (p.note) lines.push("", escapeHtml(p.note));
  if (p.live?.price) lines.push("", "<i>Prezzo rilevato da Amazon: può cambiare in qualsiasi momento.</i>");
  return {
    text: lines.join("\n"),
    buttonText: saving > 0 ? "Vedi l'offerta" : "Scopri di più",
    buttonUrl: withUtm(`${opts.siteUrl}/p/${p.asin}`),
    photo: opts.photo ?? null,
  };
}

export function guideMessage(g: { slug: string; title: string; emoji: string; intro: string; count: number }, siteUrl: string): TelegramMessage {
  const lines = [`${g.emoji} <b>${escapeHtml(g.title)}</b>`];
  if (g.intro) lines.push("", escapeHtml(g.intro));
  lines.push("", `👉 ${g.count} ${g.count === 1 ? "prodotto scelto" : "prodotti scelti"} a mano`);
  return { text: lines.join("\n"), buttonText: "Apri la guida", buttonUrl: withUtm(`${siteUrl}/guida/${g.slug}`) };
}
