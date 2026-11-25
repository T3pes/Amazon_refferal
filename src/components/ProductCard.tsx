import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";
import { Price } from "./Price";

export function ProductCard({ product, emoji, index = 0 }: { product: Product; emoji: string; index?: number }) {
  const title = product.name;
  return (
    <article
      className="card card-hover group rise flex flex-col overflow-hidden"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <Link href={`/p/${product.asin}`} className="relative block" aria-label={`Dettagli: ${title}`}>
        <ProductImage src={product.imageUrl} alt={title} emoji={emoji} className="aspect-[16/10] sm:aspect-[4/3]" />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-accent shadow-sm backdrop-blur">
            ★ Il mio preferito
          </span>
        )}
        {product.live?.savingPercent ? (
          <span className="absolute right-3 top-3 rounded-full bg-good px-2.5 py-1 text-xs font-bold text-white">
            −{product.live.savingPercent}%
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug">
            <Link href={`/p/${product.asin}`} className="hover:text-accent">{title}</Link>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">{product.note}</p>
        </div>
        {product.tags && product.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((t) => (
              <li key={t} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted">{t}</li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <Price live={product.live} compact />
          <a
            href={`/go/${product.asin}`}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="btn btn-primary"
          >
            Vedi su Amazon <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
