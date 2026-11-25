import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import { SITE } from "@/lib/site";
import "./globals.css";

const display = Fraunces({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${SITE.name} · ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  applicationName: SITE.name,
  openGraph: { type: "website", locale: "it_IT", siteName: SITE.name, title: SITE.name, description: SITE.description, url: "/" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#15120f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 whitespace-nowrap font-display text-lg font-bold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-ink text-sm">★</span>
              {SITE.name}
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/#catalogo" className="hidden rounded-full px-3 py-2 text-muted hover:text-ink sm:inline">Catalogo</Link>
              <Link href="/offerte" className="whitespace-nowrap rounded-full px-3 py-2 text-muted hover:text-ink">Offerte</Link>
              <Link href="/come-funziona" className="whitespace-nowrap rounded-full px-3 py-2 text-muted hover:text-ink">Come funziona</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-24 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted sm:grid-cols-2 sm:px-6">
            <div>
              <p className="font-display text-base font-bold text-ink">{SITE.name}</p>
              <p className="mt-2 max-w-sm">{SITE.disclosure}</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
              <Link href="/come-funziona" className="hover:text-ink">Come funziona</Link>
              <Link href="/informativa-affiliazione" className="hover:text-ink">Affiliazione</Link>
              <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
