-- Schema catalogo "amazon-referral". Incolla tutto nell'SQL Editor di Supabase ed esegui.

create table if not exists public.ar_categories (
  slug text primary key,
  name text not null,
  emoji text not null default '🛍️',
  blurb text not null default '',
  sort int not null default 0
);

create table if not exists public.ar_products (
  asin text primary key check (asin ~ '^[A-Z0-9]{10}$'),
  category text not null references public.ar_categories(slug) on update cascade,
  name text not null,
  note text not null default '',
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  image_url text,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ar_clicks (
  id bigint generated always as identity primary key,
  asin text not null check (asin ~ '^[A-Z0-9]{10}$'),
  source text check (char_length(source) <= 200),
  created_at timestamptz not null default now()
);
create index if not exists ar_clicks_asin_created_idx on public.ar_clicks (asin, created_at desc);

-- Sicurezza: il sito (chiave pubblica) può solo LEGGERE il catalogo e SCRIVERE i clic.
alter table public.ar_categories enable row level security;
alter table public.ar_products  enable row level security;
alter table public.ar_clicks    enable row level security;

drop policy if exists "catalogo leggibile" on public.ar_categories;
create policy "catalogo leggibile" on public.ar_categories for select to anon, authenticated using (true);

drop policy if exists "prodotti attivi leggibili" on public.ar_products;
create policy "prodotti attivi leggibili" on public.ar_products for select to anon, authenticated using (active);

drop policy if exists "registra clic" on public.ar_clicks;
create policy "registra clic" on public.ar_clicks for insert to anon, authenticated
  with check (exists (select 1 from public.ar_products p where p.asin = ar_clicks.asin and p.active));

grant select on public.ar_categories, public.ar_products to anon, authenticated;
grant insert (asin, source) on public.ar_clicks to anon, authenticated;

-- Vista statistiche (visibile solo da dashboard / ruolo admin)
create or replace view public.ar_click_stats with (security_invoker = on) as
  select p.asin, p.name, p.category,
         count(c.id) filter (where c.created_at > now() - interval '7 days')  as clic_7g,
         count(c.id) filter (where c.created_at > now() - interval '30 days') as clic_30g,
         count(c.id) as clic_totali
  from public.ar_products p left join public.ar_clicks c on c.asin = p.asin
  group by p.asin, p.name, p.category;
revoke all on public.ar_click_stats from anon, authenticated;

-- Dati iniziali
insert into public.ar_categories (slug,name,emoji,blurb,sort) values ('tech','Tech','🎧','Gadget utili davvero, non solo belli.',0) on conflict (slug) do nothing;
insert into public.ar_categories (slug,name,emoji,blurb,sort) values ('casa','Casa e cucina','🍳','Piccole comodità che si fanno sentire ogni giorno.',1) on conflict (slug) do nothing;
insert into public.ar_categories (slug,name,emoji,blurb,sort) values ('regali','Idee regalo','🎁','Per quando non sai cosa regalare.',2) on conflict (slug) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B09B8X9RGM','tech','Echo Dot (2022)','Il modo più economico per avere Alexa in casa: musica, timer e luci con la voce.',array['Audio pieno per le dimensioni','Configurazione in 2 minuti'],array['Serve il Wi-Fi sempre attivo'],array['smart home','sotto 50€'],true,0) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B0F7ZFWVTC','tech','Fire TV Stick 4K Plus','Rende smart qualsiasi TV con una presa HDMI. Veloce, con Wi-Fi 6 e Dolby Vision.',array['Menu reattivo','Telecomando vocale'],array['Pubblicità nella home'],array['streaming','tv'],true,1) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B0G4SHPH5K','tech','Kindle 16 GB','Leggero, schermo che non stanca gli occhi e batteria che dura settimane.',array['Senza pubblicità','Batteria lunghissima'],array['Niente colori'],array['lettura','regalo'],false,2) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B0FNWCYLZN','tech','Soundcore P31i','Auricolari con cancellazione del rumore a un prezzo onesto, 50 ore di autonomia.',array['Ottimo rapporto qualità/prezzo'],array['Custodia un po'' grande'],array['audio','sotto 50€'],false,3) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B095CLQ1PT','tech','Tapo C210 2K','Telecamera da interno che ruota a 360°: perfetta per controllare casa o animali.',array['Immagine nitida','App semplice'],array['Solo per interni'],array['smart home','sicurezza'],false,4) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B0DKKH9H5V','casa','Philips Airfryer doppio cestello 7,1 L','Due cestelli per cuocere secondo e contorno insieme. Cambia il modo di cucinare.',array['Due cotture in parallelo','Facile da pulire'],array['Occupa spazio sul piano'],array['cucina','famiglia'],true,5) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B0CWP7M17B','casa','Philips Airfryer 2000 6,2 L','La friggitrice ad aria giusta per 2-4 persone, con finestrella per controllare la cottura.',array['Finestrella con luce','13 modalità'],array['Un solo cestello'],array['cucina'],false,6) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B00E3862DE','casa','Philips levapelucchi','Dieci euro che fanno sembrare nuovi maglioni e divani.',array['Funziona davvero','Costa poco'],array['A batterie'],array['sotto 20€'],false,7) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B07MQ2MFGC','casa','Deumidificatore Comfee 16 L','Contro muffa e umidità in inverno, controllabile dallo smartphone.',array['Silenzioso','Wi-Fi e Alexa'],array['Tanica da svuotare spesso'],array['inverno'],false,8) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B06XFS8NFB','regali','Yankee Candle Christmas Magic','Il regalo che fa sempre bella figura: profumo intenso e fino a 150 ore di durata.',array['Confezione elegante'],array['Profumo forte per stanze piccole'],array['natale','sotto 30€'],true,9) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B0000C73CQ','regali','Pellicole Instax Mini (20 foto)','Se conosci qualcuno con una Instax, questo è il regalo che apprezzerà di più.',array['Sempre utili'],array['Solo per fotocamere Instax Mini'],array['foto','sotto 20€'],false,10) on conflict (asin) do nothing;
insert into public.ar_products (asin,category,name,note,pros,cons,tags,featured,sort) values ('B00G5YOVZA','regali','Nespresso Inissia','Macchina per caffè compatta e semplice: un regalo pratico per chi va a vivere da solo.',array['Compatta','Pronta in 25 secondi'],array['Solo capsule Nespresso'],array['caffè','casa nuova'],false,11) on conflict (asin) do nothing;
