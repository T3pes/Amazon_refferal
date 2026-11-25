/* eslint-disable @next/next/no-img-element */
// Le immagini Amazon vanno mostrate così come arrivano (niente ottimizzazione o copia).
export function ProductImage({ src, alt, emoji, className = "" }: { src?: string | null; alt: string; emoji: string; className?: string }) {
  if (src) {
    return (
      <div className={`grid place-items-center bg-white ${className}`}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-contain p-6 mix-blend-multiply" />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={`grid place-items-center bg-gradient-to-br from-accent-soft via-surface-2 to-surface ${className}`}
    >
      <span className="text-6xl drop-shadow-sm transition-transform duration-500 group-hover:scale-110">{emoji}</span>
    </div>
  );
}
