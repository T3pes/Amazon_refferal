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

## Pannello admin (`/admin`)
- Login con un utente Supabase Auth la cui email è nella tabella `ar_admins` (vedi `supabase/migrations/0002_admin.sql`).
- Aggiungi prodotti incollando un link Amazon, un link amzn.to o l'ASIN; modifica testi, preferiti e visibilità; vedi i clic.
- Ogni salvataggio aggiorna subito il sito pubblico (`updateTag("catalog")`).
- Sicurezza: i permessi li applica il database (RLS + `ar_is_admin()`), le Server Action ricontrollano la sessione.
- `/api/stato`: diagnostica senza segreti; da admin loggato prova anche la Creators API.
