-- Telegram: pubblica in automatico anche i prodotti NUOVI aggiunti a mano (non solo le offerte di Amazon).
-- Incolla nell'SQL Editor di Supabase ed esegui. Si può rieseguire senza danni.

alter table public.ar_telegram_posts drop constraint if exists ar_telegram_posts_kind_check;
alter table public.ar_telegram_posts add constraint ar_telegram_posts_kind_check check (kind in ('offerta', 'manuale', 'nuovo'));

-- I prodotti già presenti oggi contano come "già annunciati": partono solo quelli aggiunti da ora in poi.
insert into public.ar_telegram_posts (kind, ref)
  select 'nuovo', p.asin from public.ar_products p
  where not exists (select 1 from public.ar_telegram_posts t where t.ref = p.asin);

-- Sì se il prodotto è attivo e non è mai stato inviato al gruppo (in nessun modo); lo registra subito.
create or replace function public.ar_telegram_claim_new(p_ref text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_ref !~ '^[A-Z0-9]{10}$' then return false; end if;
  if not exists (select 1 from public.ar_products where asin = p_ref and active) then return false; end if;
  if exists (select 1 from public.ar_telegram_posts where ref = p_ref) then return false; end if;
  insert into public.ar_telegram_posts (kind, ref) values ('nuovo', p_ref);
  return true;
end; $$;
revoke all on function public.ar_telegram_claim_new(text) from public;
grant execute on function public.ar_telegram_claim_new(text) to anon, authenticated;
