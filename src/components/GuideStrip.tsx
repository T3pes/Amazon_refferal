import Link from "next/link";
import type { GuideWithProducts } from "@/lib/catalog";
import { guideHue, hueStyle, isDarkGuide } from "@/lib/palette";

const until = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("it-IT", { day: "numeric", month: "long" });

/** Riquadri delle guide tematiche, ognuno con la sua tinta (Black Friday in stile scuro). */
export function GuideStrip({ guides, title = "Guide del momento", eyebrow = "Idee pronte" }: { guides: GuideWithProducts[]; title?: string; eyebrow?: string }) {
  if (guides.length === 0) return null;
  return (
    <section aria-labelledby="guide-titolo" className="mb-16">
      <p className="eyebrow mb-1.5">{eyebrow}</p>
      <h2 id="guide-titolo" className="mb-6 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {guides.map((g, i) => {
          const dark = isDarkGuide(g.slug);
          return (
            <li key={g.slug} className={`w-[15.5rem] shrink-0 snap-start sm:w-auto ${dark && i === 0 ? "lg:col-span-2" : ""}`}>
              <Link
                href={`/guida/${g.slug}`}
                className={`guide-card rise group flex h-full min-h-40 flex-col gap-3 p-5 ${dark ? "dark" : ""}`}
                style={{ ...hueStyle(guideHue(g.slug)), animationDelay: `${Math.min(i, 6) * 50}ms` }}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="guide-emoji text-4xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" aria-hidden>{g.emoji}</span>
                  {g.endsOn && (
                    <span className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${dark ? "bg-[#d8b56a] text-[#1c1916]" : "tint-chip"}`}>
                      fino al {until(g.endsOn)}
                    </span>
                  )}
                </span>
                <span className={`font-display font-bold leading-tight ${dark && i === 0 ? "text-2xl sm:text-3xl" : "text-xl"}`}>{g.title}</span>
                {dark && i === 0 && g.intro && <span className="line-clamp-2 max-w-md text-sm opacity-80">{g.intro}</span>}
                <span className={`guide-meta mt-auto flex items-center justify-between text-sm font-medium ${dark ? "" : "tint-ink"}`}>
                  {g.products.length} {g.products.length === 1 ? "prodotto" : "prodotti"}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
