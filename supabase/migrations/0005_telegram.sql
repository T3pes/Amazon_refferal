-- Registro dei messaggi inviati sul canale Telegram (evita di ripubblicare la stessa offerta).
-- Incolla nell'SQL Editor di Supabase ed esegui. Si può rieseguire senza danni.

create table if not exists public.ar_telegram_posts (
  id        bigint generated always as identity primary key,
  kind      text not null check (kind in ('offerta', 'manuale')),
  ref       text not null check (char_length(ref) between 2 and 60),
  saving    int not null default 0,
  posted_at timestamptz not null default now()
);
create index if not exists ar_telegram_posts_ref on public.ar_telegram_posts (ref, posted_at desc);
alter table public.ar_telegram_posts enable row level security; -- nessuna lettura diretta da fuori

-- Decide se un'offerta va pubblicata e la registra in un colpo solo.
-- Sì se non è stata pubblicata negli ultimi 7 giorni, oppure se lo sconto è salito.
create or replace function public.ar_telegram_claim(p_ref text, p_saving int)
returns boolean language plpgsql security definer set search_path = public as $$
declare last_saving int;
begin
  if p_ref !~ '^[A-Z0-9]{10}$' or p_saving < 1 or p_saving > 99 then return false; end if;
  select saving into last_saving from public.ar_telegram_posts
    where ref = p_ref and kind = 'offerta' and posted_at > now() - interval '7 days'
    order by posted_at desc limit 1;
  if last_saving is not null and p_saving <= last_saving then return false; end if;
  insert into public.ar_telegram_posts (kind, ref, saving) values ('offerta', p_ref, p_saving);
  return true;
end; $$;
revoke all on function public.ar_telegram_claim(text, int) from public;
grant execute on function public.ar_telegram_claim(text, int) to anon, authenticated;

-- L'admin vede lo storico e registra gli invii manuali
drop policy if exists "admin gestisce telegram" on public.ar_telegram_posts;
create policy "admin gestisce telegram" on public.ar_telegram_posts for all to authenticated
  using (public.ar_is_admin()) with check (public.ar_is_admin());
grant select, insert on public.ar_telegram_posts to authenticated;
