-- Ogni categoria ricorda il suo argomento nel gruppo Telegram (creato in automatico dall'admin)
alter table public.ar_categories add column if not exists telegram_topic integer;
update public.ar_categories set telegram_topic = 3  where slug = 'tech'  and telegram_topic is null;
update public.ar_categories set telegram_topic = 49 where slug = 'casa'  and telegram_topic is null;
update public.ar_categories set telegram_topic = 85 where slug = 'sport' and telegram_topic is null;
update public.ar_categories set telegram_topic = 2  where slug = 'funko' and telegram_topic is null;
