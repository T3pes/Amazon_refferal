import Link from "next/link";
import { categoryHue } from "@/lib/palette";
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
      <Link href={`/p/${product.asin}`} className="relative block overflow-hidden" aria-label={`Dettagli: ${title}`}>
        <ProductImage src={product.imageUrl} alt={title} emoji={emoji} hue={categoryHue(product.category)} className="aspect-square sm:aspect-[4/3]" />
        {product.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-surface/90 px-2.5 py-1 text-[0.7rem] font-semibold text-accent shadow-sm backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
            ★ <span className="hidden sm:inline">Il mio </span>preferito
          </span>
        )}
        {product.live?.savingPercent ? (
          <span className="deal-badge absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-md sm:right-3 sm:top-3">
            −{product.live.savingPercent}%
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:gap-3 sm:p-5">
        <div>
          <h3 className="font-display text-[0.95rem] font-semibold leading-snug sm:text-lg">
            <Link href={`/p/${product.asin}`} className="transition-colors hover:text-accent">{title}</Link>
          </h3>
          {product.note && <p className="mt-1.5 line-clamp-2 hidden text-sm text-muted sm:block">{product.note}</p>}
        </div>
        {product.tags && product.tags.length > 0 && (
          <ul className="hidden flex-wrap gap-1.5 sm:flex">
            {product.tags.slice(0, 3).map((t) => (
              <li key={t} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted">{t}</li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-col items-stretch gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-2">
          <Price live={product.live} compact />
          <a
            href={`/go/${product.asin}`}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="btn btn-primary px-3 py-2 text-[0.8rem] sm:px-4 sm:py-2.5 sm:text-[0.925rem]"
          >
            <span className="sm:hidden">Su Amazon</span><span className="hidden sm:inline">Vedi su Amazon</span> <span aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
