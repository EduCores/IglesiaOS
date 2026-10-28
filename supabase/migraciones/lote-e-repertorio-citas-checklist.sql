-- ==========================================================================
-- IglesiaOS — Migración incremental LOTE E (2026-10-28)
-- Repertorio + Ensayos + Checklist Pre-Culto + Citas Pastorales.
--
-- PARA QUIÉN: instalaciones que YA corrieron `schema.sql` antes de este
-- lote (la base ya tiene las 14 tablas del Lote D). Correr todo este
-- archivo UNA VEZ en SQL Editor.
--
-- Si la base es NUEVA, no lo necesitas: `schema.sql` ya incluye este
-- mismo contenido al final (sección 9b) y es idempotente.
--
-- Todo aquí es idempotente: crear de nuevo no duplica seeds ni policies.
-- ==========================================================================

-- 1) Tablas (solo las que faltan) ------------------------------------------
create table if not exists public.songs (
  id              uuid primary key default gen_random_uuid(),
  number_tag      text,
  title           text        not null,
  artist          text,
  musical_key     text,
  bpm             int         check (bpm is null or bpm between 40 and 220),
  time_signature  text,
  comment         text,
  atmosphere      text        check (atmosphere is null or atmosphere in
                  ('calma','intima','contemporaneo','agradecimiento')),
  created_at      timestamptz not null default now()
);
create index if not exists songs_number_tag_idx on public.songs (number_tag);

create table if not exists public.rehearsals (
  id            uuid primary key default gen_random_uuid(),
  title         text        not null,
  starts_at     timestamptz not null,
  location      text,
  location_icon text,
  created_at    timestamptz not null default now()
);
create index if not exists rehearsals_starts_at_idx on public.rehearsals (starts_at);

create table if not exists public.rehearsal_confirmations (
  rehearsal_id uuid not null references public.rehearsals (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  confirmed_at timestamptz not null default now(),
  primary key (rehearsal_id, user_id)
);

create table if not exists public.worship_checklist (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references public.events (id) on delete cascade,
  item_text   text        not null,
  is_checked  boolean     not null default false,
  checked_by  uuid        references auth.users (id) on delete set null,
  checked_at  timestamptz,
  sort        int         not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.pastoral_appointments (
  id           uuid primary key default gen_random_uuid(),
  member_id    uuid references public.members (id) on delete set null,
  person_name  text        not null,
  purpose      text,
  status       text        not null default 'programado'
               check (status in ('programado','confirmado','completado','cancelado')),
  date_label   text,
  time_label   text,
  location     text        check (location is null or location in
               ('Hogar','Presencial','Online')),
  author_id    uuid        references auth.users (id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists pastoral_appointments_created_idx
  on public.pastoral_appointments (created_at desc);

-- 2) RLS activado en las 4 tablas nuevas -----------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'songs','rehearsals','rehearsal_confirmations',
    'worship_checklist','pastoral_appointments'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- 3) Permiso nuevo `editar_repertorio` (Director Alabanza + Pastor Principal)
--    Es idempotente: en bases donde el seed ya corrió, hace el upsert.
insert into public.role_permissions (rol_id, permission, allowed)
select r.id, 'editar_repertorio', true
from public.roles r
where r.title in ('Director Alabanza', 'Pastor Principal')
on conflict (rol_id, permission) do update set allowed = excluded.allowed;

-- 4) Seeds (solo si la tabla está VACÍA) ------------------------------------
insert into public.songs (number_tag, title, artist, musical_key, bpm, time_signature, comment, atmosphere)
select v.number_tag, v.title, v.artist, v.musical_key, v.bpm, v.time_signature, v.comment, v.atmosphere
from (values
  ('01', 'Worthy of It All', 'David Brymer • Versión Acústica', 'Bb', 72, '4/4', 'Intro: Piano pad suave (4 compases)',  'intima'),
  ('02', 'King of Kings',    'Hillsong Worship • Arreglo Cuerdas','D', 68, '4/4', 'Entrada de voces femeninas en Coro', 'calma'),
  ('03', 'Build My Life',    'Housefires • Comunión y Adoración', 'G', 70, '4/4', 'Momento de oración reflexiva',       'contemporaneo'),
  ('04', 'Agnus Dei',        'Michael W. Smith • Oración Final',  'A', 64, '4/4', 'Cierre congregacional a capella',    'agradecimiento')
) as v(number_tag, title, artist, musical_key, bpm, time_signature, comment, atmosphere)
where not exists (select 1 from public.songs);

insert into public.rehearsals (title, starts_at, location, location_icon)
select v.title, v.starts_at, v.location, v.location_icon
from (values
  ('Ensayo General',
   ((current_date + ((4 - extract(isodow from current_date)::int + 7) % 7))::date + time '19:00')::timestamptz,
   'Santuario Principal', 'church'),
  ('Ensayo Banda & Voces',
   ((current_date + ((6 - extract(isodow from current_date)::int + 7) % 7))::date + time '10:00')::timestamptz,
   'Sala de Ensayos A', 'mic')
) as v(title, starts_at, location, location_icon)
where not exists (select 1 from public.rehearsals);

insert into public.worship_checklist (item_text, is_checked, sort)
select v.item_text, v.is_checked, v.sort
from (values
  ('Elementos de Santa Cena preparados en mesa',  true,  1),
  ('Test de baterías en micrófonos inalámbricos', true,  2),
  ('Aromatización y climatización a 21°C',        true,  3),
  ('Sobres de diezmos reposicionados en bancos',  false, 4)
) as v(item_text, is_checked, sort)
where not exists (select 1 from public.worship_checklist);

-- 5) Políticas RLS (identicas a schema.sql) ---------------------------------
drop policy if exists "songs_select" on public.songs;
create policy "songs_select" on public.songs for select using (auth.role() = 'authenticated');
drop policy if exists "songs_write" on public.songs;
create policy "songs_write"  on public.songs for all
  using (public.has_permission('gestionar_roles') or public.has_permission('editar_repertorio'))
  with check (public.has_permission('gestionar_roles') or public.has_permission('editar_repertorio'));

drop policy if exists "rehearsals_select" on public.rehearsals;
create policy "rehearsals_select" on public.rehearsals for select using (auth.role() = 'authenticated');
drop policy if exists "rehearsals_write" on public.rehearsals;
create policy "rehearsals_write"  on public.rehearsals for all
  using (public.has_permission('gestionar_roles') or public.has_permission('editar_repertorio'))
  with check (public.has_permission('gestionar_roles') or public.has_permission('editar_repertorio'));

drop policy if exists "rehearsal_confirmations_own" on public.rehearsal_confirmations;
create policy "rehearsal_confirmations_own" on public.rehearsal_confirmations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "worship_checklist_select" on public.worship_checklist;
create policy "worship_checklist_select" on public.worship_checklist
  for select using (auth.role() = 'authenticated');
drop policy if exists "worship_checklist_write" on public.worship_checklist;
create policy "worship_checklist_write"  on public.worship_checklist for all
  using (public.has_permission('gestionar_roles'))
  with check (public.has_permission('gestionar_roles'));

drop policy if exists "pastoral_appointments_select" on public.pastoral_appointments;
create policy "pastoral_appointments_select" on public.pastoral_appointments for select using (
  public.has_permission('ver_todos_pastoral') or public.has_permission('ver_directorio')
);
drop policy if exists "pastoral_appointments_insert" on public.pastoral_appointments;
create policy "pastoral_appointments_insert" on public.pastoral_appointments for insert
  with check (public.has_permission('ver_todos_pastoral') or public.has_permission('ver_directorio'));
drop policy if exists "pastoral_appointments_update" on public.pastoral_appointments;
create policy "pastoral_appointments_update" on public.pastoral_appointments for update
  using (public.has_permission('ver_todos_pastoral'))
  with check (public.has_permission('ver_todos_pastoral'));

-- ==========================================================================
-- VERIFICACIÓN RÁPIDA al terminar (cifras completas en verificar.sql):
--   select count(*) from public.songs;             -> 4
--   select count(*) from public.rehearsals;        -> 2
--   select count(*) from public.worship_checklist; -> 4
-- ==========================================================================
