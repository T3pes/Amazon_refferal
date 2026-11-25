import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center gap-4 px-4 py-28 text-center">
      <span className="text-5xl" aria-hidden>🧭</span>
      <h1 className="font-display text-3xl font-bold">Questa pagina non c&apos;è</h1>
      <p className="text-muted">Forse il prodotto è stato tolto dal catalogo.</p>
      <Link href="/" className="btn btn-primary mt-2">Torna al catalogo</Link>
    </div>
  );
}
