import type { LiveData } from "@/lib/types";

// I prezzi si mostrano solo se arrivano dalla Creators API (aggiornati entro 1 ora).
export function Price({ live, compact = false }: { live: LiveData | null; compact?: boolean }) {
  if (!live?.price) {
    return <span className={`text-sm text-muted ${compact ? "hidden sm:inline" : ""}`}>{compact ? "Prezzo su Amazon" : "Controlla il prezzo aggiornato su Amazon"}</span>;
  }
  return (
    <span className="flex flex-col leading-tight">
      <span className="text-lg font-bold">{live.price}</span>
      {live.listPrice && <span className="text-xs text-muted line-through">{live.listPrice}</span>}
    </span>
  );
}
