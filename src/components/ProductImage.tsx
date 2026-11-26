/* eslint-disable @next/next/no-img-element */
import { hueStyle } from "@/lib/palette";

// Le immagini Amazon vanno mostrate così come arrivano (niente ottimizzazione o copia).
// Senza immagine: riquadro colorato con la tinta della categoria.
export function ProductImage({ src, alt, emoji, hue = 30, className = "", padded = "p-6" }: { src?: string | null; alt: string; emoji: string; hue?: number; className?: string; padded?: string }) {
  if (src) {
    return (
      <div className={`grid place-items-center bg-white ${className}`}>
        <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-contain ${padded} mix-blend-multiply transition-transform duration-500 group-hover:scale-105`} />
      </div>
    );
  }
  return (
    <div aria-hidden className={`tint-art relative grid place-items-center overflow-hidden ${className}`} style={hueStyle(hue)}>
      <span className="tint-watermark pointer-events-none absolute -bottom-6 -right-4 select-none text-[7rem] leading-none sm:text-[9rem]">{emoji}</span>
      <span className="tint-disc grid h-16 w-16 place-items-center rounded-full text-3xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:h-20 sm:w-20 sm:text-4xl">
        {emoji}
      </span>
    </div>
  );
}
