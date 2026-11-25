-- Guide tematiche (Black Friday, Natale, Regali sotto 30€…).
-- Incolla tutto nell'SQL Editor di Supabase ed esegui. Si può rieseguire senza danni.

create table if not exists public.ar_guides (
  slug       text primary key check (slug ~ '^[a-z0-9][a-z0-9-]{1,59}$'),
  title      text not null check (char_length(title) between 2 and 80),
  emoji      text not null default '✨',
  intro      text not null default '',
  tags       text[] not null default '{}',   -- include in automatico i prodotti con queste etichette
  asins      text[] not null default '{}',   -- prodotti scelti a mano, in ordine
  ends_on    date,                            -- ultimo giorno online (es. fine Black Friday)
  active     boolean not null default true,
  sort       int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ar_guides enable row level security;

drop policy if exists "guide attive leggibili" on public.ar_guides;
create policy "guide attive leggibili" on public.ar_guides for select to anon, authenticated using (active);

drop policy if exists "admin gestisce guide" on public.ar_guides;
create policy "admin gestisce guide" on public.ar_guides for all to authenticated
  using (public.ar_is_admin()) with check (public.ar_is_admin());

grant select on public.ar_guides to anon, authenticated;
grant insert, update, delete on public.ar_guides to authenticated;

drop trigger if exists ar_guides_touch on public.ar_guides;
create trigger ar_guides_touch before update on public.ar_guides
  for each row execute function public.ar_touch_updated_at();

-- Temi di partenza (non sovrascrive le guide che hai già modificato)
insert into public.ar_guides (slug, title, emoji, intro, tags, asins, ends_on, sort) values
  ('black-friday', 'Black Friday 2026', '🖤', 'I prodotti che tengo d''occhio per il Black Friday e il Cyber Monday. Sono cose che consiglierei anche a prezzo pieno: con lo sconto diventano un affare.', array['black friday']::text[], array['B09B8X9RGM','B0F7ZFWVTC','B0DKKH9H5V','B0FNWCYLZN','B0G4SHPH5K']::text[], '2026-12-01', 10),
  ('regali-di-natale', 'Regali di Natale', '🎄', 'Idee regalo che fanno piacere davvero, dal pensierino al regalo importante. Ordina per tempo: a dicembre le consegne rallentano.', array['natale','regalo']::text[], array['B06XFS8NFB','B0G4SHPH5K','B0000C73CQ']::text[], '2026-12-25', 20),
  ('regali-sotto-30-euro', 'Regali sotto 30€', '🎁', 'Pensieri piccoli nel prezzo ma non nell''effetto. Il prezzo esatto lo vedi su Amazon e può cambiare.', array['sotto 30€','sotto 20€']::text[], '{}'::text[], null, 30),
  ('regali-per-lui', 'Regali per lui', '🎧', 'Per chi ama la tecnologia, la musica o le serie TV.', array['per lui']::text[], array['B0FNWCYLZN','B0F7ZFWVTC','B09B8X9RGM']::text[], null, 40),
  ('regali-per-lei', 'Regali per lei', '💐', 'Per chi ama leggere, fotografare o coccolarsi con un buon caffè.', array['per lei']::text[], array['B0G4SHPH5K','B0000C73CQ','B00G5YOVZA','B06XFS8NFB']::text[], null, 50),
  ('casa-smart', 'Casa smart', '🏠', 'Piccoli dispositivi che rendono la casa più comoda e sicura, senza impianti complicati.', array['smart home','sicurezza']::text[], '{}'::text[], null, 60),
  ('cucina-facile', 'Cucina facile', '🍳', 'Elettrodomestici che fanno risparmiare tempo ogni giorno.', array['cucina','caffè']::text[], '{}'::text[], null, 70)
on conflict (slug) do nothing;
