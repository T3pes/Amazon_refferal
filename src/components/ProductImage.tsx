/* eslint-disable @next/next/no-img-element */
import { hueStyle } from "@/lib/palette";

// Le immagini Amazon vanno mostrate così come arrivano (niente ottimizzazione o copia).
// Senza immagine: riquadro colorato con la tinta della categoria.
export function ProductImage({ src, alt, emoji, hue = 30, className = "" }: { src?: string | null; alt: string; emoji: string; hue?: number; className?: string }) {
  if (src) {
    return (
      <div className={`grid place-items-center bg-white ${className}`}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
      </div>
    );
  }
  return (
    <div aria-hidden className={`tint-art relative grid place-items-center overflow-hidden ${className}`} style={hueStyle(hue)}>
      <span className="tint-watermark pointer-events-none absolute -bottom-6 -right-4 select-none text-[7rem] leading-none sm:text-[9rem]">{emoji}</span>
      <span className="tint-disc grid h-20 w-20 place-items-center rounded-full text-4xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:h-24 sm:w-24 sm:text-5xl">
        {emoji}
      </span>
    </div>
  );
}
