// Gruppo Telegram con argomenti: ogni categoria del sito va nel suo argomento.
// TELEGRAM_TOPICS su Vercel, es. "tech:12, casa:34, sport:56, funko:78"

export function parseTopics(raw: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const part of raw.split(",")) {
    const m = part.trim().match(/^([a-z0-9-]+)\s*[:=]\s*(\d+)$/i);
    if (m) out[m[1].toLowerCase()] = Number(m[2]);
  }
  return out;
}

/** Argomento per una categoria. undefined = General (il thread 1 di Telegram non va indicato). */
export function topicFor(topics: Record<string, number>, category: string): number | undefined {
  const id = topics[category] ?? topics.general;
  return id && id !== 1 ? id : undefined;
}
