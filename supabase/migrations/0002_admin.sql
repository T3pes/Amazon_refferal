-- Pannello admin. Prima di eseguire:
-- 1) Supabase → Authentication → Users → "Add user": crea il TUO utente (email + password).
-- 2) Sostituisci TUA_EMAIL qui sotto con quella email. Poi incolla tutto nell'SQL Editor ed esegui.

create table if not exists public.ar_admins (email text primary key);
alter table public.ar_admins enable row level security; -- nessuna policy: non leggibile da fuori

insert into public.ar_admins (email) values (lower('TUA_EMAIL')) on conflict do nothing;

create or replace function public.ar_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.ar_admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.ar_is_admin() from public, anon;
grant execute on function public.ar_is_admin() to authenticated;

-- L'admin può leggere e modificare tutto il catalogo (anche i prodotti disattivati)
drop policy if exists "admin gestisce prodotti" on public.ar_products;
create policy "admin gestisce prodotti" on public.ar_products for all to authenticated
  using (public.ar_is_admin()) with check (public.ar_is_admin());

drop policy if exists "admin gestisce categorie" on public.ar_categories;
create policy "admin gestisce categorie" on public.ar_categories for all to authenticated
  using (public.ar_is_admin()) with check (public.ar_is_admin());

drop policy if exists "admin legge clic" on public.ar_clicks;
create policy "admin legge clic" on public.ar_clicks for select to authenticated
  using (public.ar_is_admin());

grant insert, update, delete on public.ar_products, public.ar_categories to authenticated;
grant select on public.ar_clicks to authenticated;
grant select on public.ar_click_stats to authenticated;

-- updated_at automatico
create or replace function public.ar_touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists ar_products_touch on public.ar_products;
create trigger ar_products_touch before update on public.ar_products
  for each row execute function public.ar_touch_updated_at();
