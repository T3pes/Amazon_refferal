import { ImageResponse } from "next/og";
import { getProduct } from "@/lib/catalog";
import { SITE } from "@/lib/site";

// Foto standard per i post Telegram: sempre 1080x1080, sfondo bianco, prodotto centrato.
// Così ogni messaggio nel gruppo ha la stessa forma, qualunque sia la foto di Amazon.
const SIZE = 1080;
const AMAZON_IMG = /^https:\/\/([a-z0-9-]+\.)*(media-amazon\.com|ssl-images-amazon\.com)\//i;

function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"><path fill={color} d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" /></svg>
  );
}

/** Chiede ad Amazon la versione grande della foto (es. ._AC_SL1500_.) e la scarica. */
async function loadImage(url: string | null | undefined): Promise<string | null> {
  if (!url || !AMAZON_IMG.test(url)) return null;
  const big = url.replace(/\._[^/]*_\.(jpg|jpeg|png)$/i, "._AC_SL1000_.$1");
  for (const u of big === url ? [url] : [big, url]) {
    try {
      const r = await fetch(u, { signal: AbortSignal.timeout(8000) });
      const type = r.headers.get("content-type") ?? "";
      if (!r.ok || !/image\/(jpeg|png)/.test(type)) continue;
      return `data:${type.split(";")[0]};base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}`;
    } catch { /* prova la successiva */ }
  }
  return null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ asin: string }> }) {
  const { asin } = await params;
  const { catalog, product } = await getProduct(asin);
  if (!product) return new Response("Not found", { status: 404 });
  const emoji = catalog.categories.find((c) => c.slug === product.category)?.emoji ?? "🛍️";
  const img = await loadImage(product.imageUrl);
  const name = product.name.length > 60 ? `${product.name.slice(0, 58).trimEnd()}…` : product.name;

  const brand = (
    <div style={{ position: "absolute", right: 36, bottom: 32, display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 999, background: "#c2541b", color: "#fff", fontSize: 26, fontWeight: 700 }}>
      <Star size={24} color="#fff" />{SITE.name}
    </div>
  );

  return new ImageResponse(
    img ? (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" width={880} height={880} style={{ width: 880, height: 880, objectFit: "contain" }} />
        {brand}
      </div>
    ) : (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, padding: 90, background: "#faf7f2", color: "#1f1b16", position: "relative" }}>
        <div style={{ fontSize: 220, display: "flex" }}>{emoji}</div>
        <div style={{ fontSize: name.length > 35 ? 60 : 74, fontWeight: 700, textAlign: "center", lineHeight: 1.1, display: "flex" }}>{name}</div>
        {brand}
      </div>
    ),
    { width: SIZE, height: SIZE, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } },
  );
}
