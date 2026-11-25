-- Categorie Sport e Funko (si possono anche creare da /admin/categorie)
insert into public.ar_categories (slug,name,emoji,blurb,sort) values ('sport','Sport e fitness','🏃','Per allenarti meglio, a casa e fuori.',3) on conflict (slug) do nothing;
insert into public.ar_categories (slug,name,emoji,blurb,sort) values ('funko','Funko Pop','🧸','Personaggi da collezione, per te o da regalare.',4) on conflict (slug) do nothing;
