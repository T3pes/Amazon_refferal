import { ImageResponse } from "next/og";
import { SITE } from "./site";

// Disegnata in SVG: il font di next/og non ha il glifo ★ e scaricarlo a runtime è fragile
function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"><path fill={color} d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" /></svg>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };

/** Anteprima per WhatsApp, Telegram, Facebook, X: stessi colori del sito. */
export function renderOg({ kicker, title, subtitle, star }: { kicker: string; title: string; subtitle?: string; star?: boolean }) {
  const t = title.length > 70 ? `${title.slice(0, 68).trimEnd()}…` : title;
  const sub = subtitle && subtitle.length > 140 ? `${subtitle.slice(0, 138).trimEnd()}…` : subtitle;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#faf7f2", color: "#1f1b16" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, background: "#c2541b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}><Star size={32} color="#fff" /></div>
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignSelf: "flex-start", padding: "8px 20px", borderRadius: 999, background: "#fbe9dd", color: "#c2541b", fontSize: 28, fontWeight: 600, alignItems: "center", gap: 10 }}>{star ? <Star size={26} color="#c2541b" /> : null}{kicker}</div>
          <div style={{ fontSize: t.length > 40 ? 62 : 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>{t}</div>
          {sub ? <div style={{ fontSize: 30, color: "#6b6258", lineHeight: 1.35 }}>{sub}</div> : null}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6b6258" }}>
          <span>Scelti a mano · nessuna registrazione</span>
          <span style={{ color: "#c2541b", fontWeight: 600 }}>Vedi su Amazon</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
