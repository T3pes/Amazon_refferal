import Link from "next/link";
import type { GuideWithProducts } from "@/lib/catalog";

/** Riquadri delle guide tematiche (home e pagine prodotto). */
export function GuideStrip({ guides, title = "Guide del momento" }: { guides: GuideWithProducts[]; title?: string }) {
  if (guides.length === 0) return null;
  return (
    <section aria-labelledby="guide-titolo" className="mb-14">
      <h2 id="guide-titolo" className="mb-5 font-display text-2xl font-bold">{title}</h2>
      <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {guides.map((g, i) => (
          <li key={g.slug} className="w-64 shrink-0 snap-start sm:w-auto">
            <Link
              href={`/guida/${g.slug}`}
              className="card card-hover rise group flex h-full flex-col gap-2 p-5"
              style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
            >
              <span className="text-3xl transition-transform duration-300 group-hover:scale-110" aria-hidden>{g.emoji}</span>
              <span className="font-display text-lg font-semibold leading-snug group-hover:text-accent">{g.title}</span>
              <span className="mt-auto text-sm text-muted">
                {g.products.length} {g.products.length === 1 ? "prodotto" : "prodotti"}
                {g.endsOn && <> · fino al {new Date(`${g.endsOn}T12:00:00`).toLocaleDateString("it-IT", { day: "numeric", month: "long" })}</>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
