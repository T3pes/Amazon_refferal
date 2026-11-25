-- Prodotti "solo in offerta": compaiono sul sito solo mentre Amazon li segnala scontati.
-- Incolla nell'SQL Editor di Supabase ed esegui. Si può rieseguire senza danni.
alter table public.ar_products add column if not exists deal_only boolean not null default false;
