import Link from "next/link";
import { categoryHue, hueStyle } from "@/lib/palette";
import type { Category, Product } from "@/lib/types";

/** Riquadri grandi e colorati per entrare in una categoria. */
export function CategoryTiles({ categories, products }: { categories: Category[]; products: Product[] }) {
  if (categories.length < 2) return null;
  return (
    <section aria-labelledby="cat-titolo" className="mb-16">
      <p className="eyebrow mb-1.5">Sfoglia</p>
      <h2 id="cat-titolo" className="mb-6 font-display text-2xl font-bold sm:text-3xl">Per categoria</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {categories.map((c, i) => {
          const n = products.filter((p) => p.category === c.slug).length;
          return (
            <li key={c.slug}>
              <Link href={`/c/${c.slug}`} className="cat-tile tint-art rise group flex items-center gap-4 p-4 sm:flex-col sm:items-start sm:p-6" style={{ ...hueStyle(categoryHue(c.slug)), animationDelay: `${i * 60}ms` }}>
                <span className="tint-disc grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:h-16 sm:w-16" aria-hidden>{c.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold sm:text-xl">{c.name}</span>
                  <span className="tint-ink block truncate text-sm font-medium sm:whitespace-normal">{n} {n === 1 ? "prodotto" : "prodotti"} · {c.blurb}</span>
                </span>
                <span aria-hidden className="tint-ink text-xl transition-transform group-hover:translate-x-1 sm:hidden">→</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
