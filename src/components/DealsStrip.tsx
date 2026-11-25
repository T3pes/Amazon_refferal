import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

/** "In offerta adesso": appare solo se Amazon segnala almeno uno sconto. */
export function DealsStrip({ deals, categories, max = 3 }: { deals: Product[]; categories: Category[]; max?: number }) {
  if (deals.length === 0) return null;
  const emojiOf = Object.fromEntries(categories.map((c) => [c.slug, c.emoji]));
  return (
    <section aria-labelledby="offerte-titolo" className="mb-14">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 id="offerte-titolo" className="flex items-center gap-2 font-display text-2xl font-bold">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-good" />
          </span>
          In offerta adesso
        </h2>
        {deals.length > max && <Link href="/offerte" className="text-sm font-medium text-accent hover:underline">Tutte le {deals.length} offerte →</Link>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {deals.slice(0, max).map((p, i) => <ProductCard key={p.asin} product={p} emoji={emojiOf[p.category] ?? "🛍️"} index={i} />)}
      </div>
    </section>
  );
}
