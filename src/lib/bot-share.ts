// Testo condiviso dall'app Amazon al bot → link e nome del prodotto (puro e testato).

const URL_RE = /https?:\/\/[^\s<>"]+/i;

export function parseShare(text: string): { link: string | null; name: string } {
  const t = (text ?? "").trim();
  const link = t.match(URL_RE)?.[0]?.replace(/[)\].,;]+$/, "") ?? null;
  let name = t.replace(URL_RE, " ");
  name = name
    .replace(/\s*[:|-]?\s*Amazon\.(it|com|de|fr|es|co\.uk)\b.*$/i, "") // "… : Amazon.it: Casa e cucina"
    .replace(/^(guarda|dai un'?occhiata a|ecco|ho trovato)\b[^:]*:\s*/i, "")
    .replace(/\s+/g, " ")
    .replace(/^["'«“\s]+|["'»”\s]+$/g, "")
    .trim();
  if (/^(guarda|dai un'?occhiata|condividi|ho trovato)/i.test(name) || name.length < 3) name = "";
  return { link, name: name.slice(0, 120) };
}
