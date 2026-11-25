# Deals Forever · catalogo Amazon affiliato

Catalogo pubblico (senza registrazione) di prodotti Amazon scelti a mano, con link affiliato `dealsforev0bc-21`.

- **Stack:** Next.js 16 (App Router, Cache Components) · Tailwind 4 · Supabase · Vercel
- **Catalogo:** tabella `ar_products` su Supabase. Se Supabase non risponde, usa `src/data/seed.ts`.
- **Dati live (titolo, immagine, prezzo):** Amazon Creators API, cache di 1 ora (limite Amazon per i prezzi). Senza credenziali il sito funziona lo stesso, senza prezzi.
- **Link:** ogni pulsante passa da `/go/ASIN`, che registra il clic in forma anonima (`ar_clicks`) e reindirizza ad Amazon. Solo ASIN presenti nel catalogo.

## Comandi
```
npm install
npm run dev     # sviluppo
npm test        # test del generatore di link affiliati
npm run build
```

## Variabili d'ambiente
Vedi `.env.example`. Il segreto della Creators API va solo nelle variabili di Vercel (tipo "sensitive"), mai nel codice.

## Database
Esegui `supabase/migrations/0001_catalogo.sql` nell'SQL Editor di Supabase.
