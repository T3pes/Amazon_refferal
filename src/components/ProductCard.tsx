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
        <ProductImage src={product.imageUrl} alt={title} emoji={emoji} hue={categoryHue(product.category)} className="aspect-square" padded="p-4" />
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
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div>
          <h3 className="font-display line-clamp-2 min-h-[2.6em] text-[0.9rem] font-semibold leading-[1.3] sm:text-base">
            <Link href={`/p/${product.asin}`} className="transition-colors hover:text-accent">{title}</Link>
          </h3>
          <p className="mt-1 hidden min-h-[2.5rem] sm:line-clamp-2 text-[0.8rem] leading-5 text-muted">{product.note}</p>
        </div>
        <div className="mt-auto flex flex-col items-stretch gap-2 pt-1">
          <Price live={product.live} compact />
          <a
            href={`/go/${product.asin}`}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="btn btn-primary px-3 py-2 text-[0.8rem] sm:text-sm"
          >
            <span className="sm:hidden">Su Amazon</span><span className="hidden sm:inline">Vedi su Amazon</span> <span aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
