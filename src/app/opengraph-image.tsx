import { renderOg, OG_SIZE } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ kicker: "Catalogo curato", title: SITE.tagline, subtitle: "Niente classifiche infinite né recensioni finte: solo prodotti scelti uno per uno, con il perché." });
}
