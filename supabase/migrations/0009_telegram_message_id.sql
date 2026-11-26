-- Ricorda il numero del messaggio Telegram: così un nuovo invio può sostituire il precedente
alter table public.ar_telegram_posts add column if not exists message_id bigint;
