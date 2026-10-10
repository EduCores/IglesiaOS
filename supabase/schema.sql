-- ==========================================================================
-- IglesiaOS — Esquema de base de datos (PostgreSQL / Supabase)
-- ==========================================================================
-- CÓMO USAR ESTE ARCHIVO
--   1) Crea el proyecto en Supabase (https://supabase.com) -> New project.
--   2) Ve a SQL Editor -> New query -> pega ESTE ARCHIVO ENTERO -> Run.
--   3) La app se conecta con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
--      (Settings -> API). NO uses la service_role key en el frontend.
--
-- MODELADO: refleja las pantallas que ya existen (ver notas por tabla).
-- Convenciones: snake_case + `_id` (FK), timestamps en UTC, `uuid` para
-- todo lo que venga de la app, `text` para los estados catalogados
-- (no enums: asi agregar un estado no requiere migracion).
--
-- ⚠️ DATOS SENSIBLES: RUT, fechas de nacimiento, salud de menores y notas
-- pastorales confidenciales. Todo pasa por RLS (abajo) y la tabla de
-- Profiles NO es publicable por defecto. Ley 19.628 (Chile).
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 0. Extensiones y helper de timestamps
-- --------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- --------------------------------------------------------------------------
-- 1. Roles y permisos  (pantalla Roles: App.tsx ROLES_INICIALES)
--    Los 9 roles actuales: Pastor Principal, Dir. Alabanza, Tesorero,
--    Líder de Célula, Voluntario (suspendido), Portero, Ujieres,
--    Servicio de Aseo, Cocina + Ayudantes.
--    `type` reproduce los filtros de la pantalla (todos/liderazgo/
--    ministerios/apoyo) -> la UI sigue igual, ahora con datos.
--    ⚠️ Va PRIMERO: profiles y role_permissions lo referencian.
-- --------------------------------------------------------------------------
create table if not exists public.roles (
  id           uuid primary key default gen_random_uuid(),
  title        text        not null unique,
  tag          text,
  type         text        not null default 'apoyo'
               check (type in ('liderazgo', 'ministerios', 'apoyo')),
  description  text,
  icon         text,
  is_active    boolean     not null default true,  -- switch de la pantalla
  created_at   timestamptz not null default now()
);

-- Permisos por rol. En vez de un campo `desc` de texto (decorativo hoy),
-- cada permiso es una fila comprobable: la app podrá verificarlo y RLS
-- puede envolverlo. Ejemplos del pedido:
--   ujieres   -> registrar_ofrendas = true, solicitar_gastos = false
--   aseo/cocina -> solicitar_gastos = true, registrar_ofrendas = false
create table if not exists public.role_permissions (
  id            uuid primary key default gen_random_uuid(),
  rol_id        uuid not null references public.roles (id) on delete cascade,
  permission    text not null,   -- 'registrar_ofrendas','solicitar_gastos',
                                 -- 'ver_finanzas','ver_directorio','gestionar_roles',...
  allowed       boolean not null default false,
  unique (rol_id, permission)
);

-- --------------------------------------------------------------------------
-- 2. Perfiles de usuario (rol + iglesia)
--    Espejo de la sesión local actual (App.tsx: {nombre, email, rol}), pero
--    ahora respaldado por auth.users. `rol_id` es la FK que hace que los
--    permisos de Portero/Ujieres/Aseo/Cocina sean REALES (ver RLS).
-- --------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text        not null,
  email       text,
  phone       text,
  rol_id      uuid        references public.roles (id) on delete set null,
  congregation text       default 'Célula Betania',
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 3. Miembros  (Censo de Miembro + Directorio)
--    Campos tomados del formulario real (CensoMiembro.tsx: fullName, docId,
--    birthDate, phone, email, address, spiritualStage, sacramentDate,
--    cellGroup, isFamilyHead, familyMembers).
-- --------------------------------------------------------------------------
create table if not exists public.members (
  id              uuid primary key default gen_random_uuid(),
  full_name       text        not null,
  doc_id          text,                      -- RUT / DNI
  birth_date      date,
  phone           text,
  email           text,
  address         text,
  photo_url       text,
  spiritual_stage text        default 'Nuevo Creyente',
  is_family_head  boolean     not null default false,
  family_members  text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
-- El RUT identifica personas: único cuando existe (varios pueden dejarlo null).
create unique index if not exists members_doc_id_key
  on public.members (doc_id) where doc_id is not null;

-- --------------------------------------------------------------------------
-- 4. Células  (pantalla Células)
-- --------------------------------------------------------------------------
create table if not exists public.cells (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  zone        text,                       -- norte/centro/sur/jovenes/matrimonios
  leader_name text,
  schedule    text,                       -- 'Martes 19:30'
  place       text,
  capacity    int,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.member_cells (
  member_id uuid not null references public.members (id) on delete cascade,
  cell_id   uuid not null references public.cells  (id) on delete cascade,
  primary key (member_id, cell_id)
);

-- --------------------------------------------------------------------------
-- 5. Finanzas  (pantalla Finanzas: balance, transacciones, presupuesto)
--    `kind` = 'oferta' | 'diezmo' | 'gasto' (tipos de la pantalla).
--    `category` = 'ministerios' | 'misiones' | 'operaciones' (chips).
--    `team` liga el gasto al equipo de servicio (Portero/Aseo/Cocina),
--    que es lo que se pidió al sumar esos roles.
-- --------------------------------------------------------------------------
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  amount      numeric(12,2) not null check (amount > 0),
  kind        text        not null default 'oferta'
              check (kind in ('oferta', 'diezmo', 'gasto')),
  category    text        not null default 'operaciones'
              check (category in ('ministerios', 'misiones', 'operaciones')),
  team        text,        -- 'Aseo','Cocina','Puerta', null si no aplica
  occurred_at timestamptz not null default now(),
  member_id   uuid references public.members (id) on delete set null,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists transactions_occurred_at_idx
  on public.transactions (occurred_at desc);

-- --------------------------------------------------------------------------
-- 6. Bitácora Pastoral  (pantalla Bitácora)
--    ⚠️ SENSIBLE: notas confidenciales de salud/familiares.
--    `privacy` = 'solo_pastor' | 'equipo' -> la RLS de abajo la usa para
--    que un ujier NO pueda leer notas marcadas 'solo_pastor'.
-- --------------------------------------------------------------------------
create table if not exists public.pastoral_logs (
  id              uuid primary key default gen_random_uuid(),
  member_id       uuid references public.members (id) on delete set null,
  author_id       uuid references auth.users (id) on delete set null,
  connection_place text,
  duration_minutes int,
  visited_at      date        not null default current_date,
  mood            text        default 'En Paz',   -- En Paz / En Gozo / Fortaleza / Inquietud / Quebranto
  privacy         text        not null default 'solo_pastor'
                  check (privacy in ('solo_pastor', 'equipo')),
  note            text,
  next_follow_up  date,
  created_at      timestamptz not null default now()
);
create index if not exists pastoral_logs_member_idx
  on public.pastoral_logs (member_id, visited_at desc);

-- Motivos de oración de la visita (se guardan separados para poder orar).
create table if not exists public.prayer_requests (
  id        uuid primary key default gen_random_uuid(),
  log_id    uuid not null references public.pastoral_logs (id) on delete cascade,
  petition  text not null,
  is_shared boolean not null default true,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 7. Sacramentos / Registros  (Consagración, Confirmación, Sacramentos)
-- --------------------------------------------------------------------------
create table if not exists public.sacrament_records (
  id           uuid primary key default gen_random_uuid(),
  member_id    uuid references public.members (id) on delete set null,
  kind         text        not null
               check (kind in ('bautismo', 'confirmacion', 'presentacion',
                               'matrimonio', 'comunion', 'mayordomia')),
  performed_at date        not null default current_date,
  notes        text,
  is_anonymous boolean     not null default false,  -- "Identificación Omitida"
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists sacrament_records_member_idx
  on public.sacrament_records (member_id, performed_at desc);

-- --------------------------------------------------------------------------
-- 8. Eventos / Cultos / Check-in
-- --------------------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  kind        text        not null default 'culto'
              check (kind in ('culto', 'actividad', 'jovenes', 'retiro')),
  atmosphere  text,                      -- calma / intima / contemporáneo / agradecimiento
  description text,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  place       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.event_attendance (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events (id) on delete cascade,
  member_id  uuid references public.members (id) on delete set null,
  checked_in_at timestamptz,
  checked_out_at timestamptz,
  unique (event_id, member_id)
);

-- Check-in de niños: datos de SALUD sensibles -> tabla aparte, RLS estricta.
create table if not exists public.children_checkins (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid not null references public.events (id) on delete cascade,
  full_name     text        not null,
  guardian_name text,
  doc_id        text,
  health_notes  text,       -- alergias, medicación — acceso restringido
  checked_in_at timestamptz not null default now(),
  checked_out_at timestamptz
);

-- --------------------------------------------------------------------------
-- 9. Newsletter / Difusión  (WhatsApp, boletines)
-- --------------------------------------------------------------------------
create table if not exists public.broadcasts (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  channel     text        not null default 'whatsapp',
  body        text        not null,
  status      text        not null default 'borrador'
              check (status in ('borrador', 'programado', 'enviado')),
  scheduled_at timestamptz,
  sent_at     timestamptz,
  recipients  int,
  created_at  timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 10. Roles seed: los 17 roles de la pantalla Roles.
--     Coinciden con ROLES_INICIALES (App.tsx) para que al migrar no cambie
--     nada visible. `is_active=false` para Voluntario (switch apagado).
--     Renombre: 'Dir. Alabanza' -> 'Director Alabanza' (vocabulario pedido);
--     el UPDATE es idempotente (0 filas si ya se aplicó o si es base nueva).
-- --------------------------------------------------------------------------
update public.roles set title = 'Director Alabanza' where title = 'Dir. Alabanza';

insert into public.roles (title, tag, type, description, icon, is_active) values
  ('Pastor Principal',        'Total',      'liderazgo',  'Acceso completo',                        'church',              true),
  ('Director Alabanza',       'Multimedia', 'ministerios','Editor en Multimedia, Solo Lectura en Pastoral', 'graphic_eq', true),
  ('Tesorero',                'Finanzas',   'liderazgo',  'Editor en Finanzas, Solo Lectura',       'payments',            true),
  ('Líder de Célula',         'Grupos',     'apoyo',      'Solo Lectura',                           'groups_3',            true),
  ('Voluntario',              'Básico',     'apoyo',      'Acceso limitado',                        'volunteer_activism',  false),
  ('Portero',                 'Servicio',   'apoyo',      'Control de acceso',                      'door_open',           true),
  ('Ujieres',                 'Servicio',   'apoyo',      'Registra ofrendas · Orden y acomodo',    'hail',                true),
  ('Servicio de Aseo',        'Servicio',   'apoyo',      'Solicita gastos · Limpieza del templo',  'cleaning_services',   true),
  ('Cocina + Ayudantes',      'Servicio',   'apoyo',      'Solicita gastos · Alimentación y convivios', 'soup_kitchen',   true),
  ('Miembro',                 'General',    'apoyo',      'Navega con su cuenta · Sin cargo asignado', 'person',           true),
  ('Pastor 1',                'Pastoral',   'liderazgo',  'Acceso pastoral · Sin gestión de roles', 'supervisor_account',  true),
  ('Pastor 2',                'Pastoral',   'liderazgo',  'Acceso pastoral · Sin gestión de roles', 'diversity_1',         true),
  ('Sonido',                  'Multimedia', 'ministerios','Opera el sonido · Cultos y eventos',     'speaker',             true),
  ('Técnico Sonido',          'Multimedia', 'ministerios','Mezcla y equipos · Apoyo técnico',       'tune',                true),
  ('Multimedia',              'Multimedia', 'ministerios','Proyección y transmisión · Pantallas y streaming', 'videocam',  true),
  ('Músicos',                 'Alabanza',   'ministerios','Banda tradicional de iglesia · Instrumentos', 'music_note',     true),
  ('Voces',                   'Alabanza',   'ministerios','Voces y coro · Alabanza congregacional', 'mic',                 true)
on conflict (title) do nothing;

-- Permisos iniciales.
-- * Portero NO registra ofrendas (pedido explícito): es asignación solo de
--   Ujieres (+ Tesorero y pastores). El UPDATE siguiente revoca el permiso
--   en bases que ya corrieron el seed anterior; es idempotente.
-- * `ver_directorio` se otorga a los roles operativos porque sin él NADIE
--   podría leer miembros (members_select lo exige): al migrar, el Directorio
--   quedaría vacío para todos. Aseo/Cocina/Miembro/equipos de música no lo
--   tienen (una línea SQL los agrega si se necesita).
-- * `checkin_ninos` para quienes atienden puerta e ingreso + pastores.
-- * Miembro (usuario general sin cargo): solo lo que `authenticated` ya ve
--   (células, eventos, sacramentos, difusión, asistencia). Sin directorio,
--   sin finanzas, sin pastoral: "solo navega".
update public.role_permissions rp set allowed = false
from public.roles r
where r.id = rp.rol_id and r.title = 'Portero' and rp.permission = 'registrar_ofrendas';

insert into public.role_permissions (rol_id, permission, allowed)
select r.id, p.permission, p.allowed
from public.roles r
cross join (values
  ('Pastor Principal', 'gestionar_roles', true), ('Pastor Principal', 'registrar_ofrendas', true),
  ('Pastor Principal', 'solicitar_gastos', true), ('Pastor Principal', 'ver_finanzas', true),
  ('Pastor Principal', 'ver_todos_pastoral', true), ('Pastor Principal', 'ver_directorio', true),
  ('Pastor Principal', 'checkin_ninos', true),
  ('Pastor 1', 'ver_directorio', true), ('Pastor 1', 'ver_todos_pastoral', true),
  ('Pastor 1', 'registrar_ofrendas', true), ('Pastor 1', 'solicitar_gastos', true),
  ('Pastor 1', 'ver_finanzas', true), ('Pastor 1', 'checkin_ninos', true),
  ('Pastor 2', 'ver_directorio', true), ('Pastor 2', 'ver_todos_pastoral', true),
  ('Pastor 2', 'registrar_ofrendas', true), ('Pastor 2', 'solicitar_gastos', true),
  ('Pastor 2', 'ver_finanzas', true), ('Pastor 2', 'checkin_ninos', true),
  ('Tesorero', 'ver_finanzas', true), ('Tesorero', 'registrar_ofrendas', true),
  ('Tesorero', 'ver_directorio', true),
  ('Director Alabanza', 'ver_directorio', true),
  ('Líder de Célula', 'ver_directorio', true), ('Líder de Célula', 'checkin_ninos', true),
  ('Portero', 'ver_directorio', true), ('Portero', 'checkin_ninos', true),
  ('Ujieres', 'registrar_ofrendas', true),
  ('Ujieres', 'ver_directorio', true), ('Ujieres', 'checkin_ninos', true),
  ('Servicio de Aseo', 'solicitar_gastos', true),
  ('Cocina + Ayudantes', 'solicitar_gastos', true)
) as p(title, permission, allowed)
where r.title = p.title
on conflict (rol_id, permission) do update set allowed = excluded.allowed;

-- ==========================================================================
-- 11. SEGURIDAD — Row Level Security (RLS)
--     Por qué importa: hoy los permisos son TEXTO. Con RLS el permiso se
--     cumple en la base: si alguien manipula el front, sigue bloqueado.
--     Cada pantalla sensible necesita su política; este bloque es la base.
--
--     NOTA sobre "Habilitar RLS automático" (casilla del alta de proyecto):
--     es solo un event trigger que activa RLS en tablas NUEVAS de `public`
--     (no crea políticas). Este archivo ya hace `enable row level security`
--     explícito en las 14 tablas (bloque siguiente), que es lo que de verdad
--     importa. Puedes dejar la casilla activada o desactivada: el resultado
--     es el mismo para este esquema.
-- ==========================================================================

-- Helpers: who is the current user and what permissions does their role have.
create or replace function public.current_role_id()
returns uuid language sql stable security definer set search_path = public as $$
  select rol_id from public.profiles where id = auth.uid() and is_active
$$;

create or replace function public.has_permission(perm text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.role_permissions rp
    where rp.rol_id = public.current_role_id()
      and rp.permission = perm
      and rp.allowed
  )
$$;

-- Enable RLS everywhere (idempotente).
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','roles','role_permissions','members','cells','member_cells',
    'transactions','pastoral_logs','prayer_requests','sacrament_records',
    'events','event_attendance','children_checkins','broadcasts'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Perfiles: cada uno ve el suyo; liderazgo ve todos.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select using (
  id = auth.uid() or public.has_permission('gestionar_roles')
);

-- Roles/permisos: lectura para todos autenticados; escritura solo liderazgo.
drop policy if exists "roles_select" on public.roles;
create policy "roles_select" on public.roles for select using (auth.role() = 'authenticated');
drop policy if exists "roles_write" on public.roles;
create policy "roles_write"  on public.roles for all
  using (public.has_permission('gestionar_roles'))
  with check (public.has_permission('gestionar_roles'));

drop policy if exists "role_permissions_select" on public.role_permissions;
create policy "role_permissions_select" on public.role_permissions for select using (auth.role() = 'authenticated');
drop policy if exists "role_permissions_write" on public.role_permissions;
create policy "role_permissions_write"  on public.role_permissions for all
  using (public.has_permission('gestionar_roles'))
  with check (public.has_permission('gestionar_roles'));

-- Miembros: lectura con permiso 'ver_directorio'; escritura con 'gestionar_roles'.
drop policy if exists "members_select" on public.members;
create policy "members_select" on public.members for select using (public.has_permission('ver_directorio'));
drop policy if exists "members_write" on public.members;
create policy "members_write"  on public.members for all
  using (public.has_permission('gestionar_roles'))
  with check (public.has_permission('gestionar_roles'));

-- Células: lectura autenticados.
drop policy if exists "cells_select" on public.cells;
create policy "cells_select" on public.cells for select using (auth.role() = 'authenticated');
drop policy if exists "cells_write" on public.cells;
create policy "cells_write"  on public.cells for all using (public.has_permission('gestionar_roles'))
  with check (public.has_permission('gestionar_roles'));
drop policy if exists "member_cells_rw" on public.member_cells;
create policy "member_cells_rw" on public.member_cells for all
  using (public.has_permission('ver_directorio'))
  with check (public.has_permission('gestionar_roles'));

-- Finanzas: leer con 'ver_finanzas'; registrar ofertas/diezmos con su permiso;
-- registrar gastos con 'solicitar_gastos'. NUNCA 'gestionar_roles' solo para esto.
drop policy if exists "transactions_select" on public.transactions;
create policy "transactions_select" on public.transactions for select using (public.has_permission('ver_finanzas'));
drop policy if exists "transactions_insert_oferta" on public.transactions;
create policy "transactions_insert_oferta" on public.transactions for insert
  with check (public.has_permission('registrar_ofrendas') and kind in ('oferta','diezmo'));
drop policy if exists "transactions_insert_gasto" on public.transactions;
create policy "transactions_insert_gasto" on public.transactions for insert
  with check (public.has_permission('solicitar_gastos') and kind = 'gasto');
-- Quien registró su gasto puede actualizarlo; borrar solo liderazgo.
drop policy if exists "transactions_update" on public.transactions;
create policy "transactions_update" on public.transactions for update using (
  public.has_permission('gestionar_roles') or public.has_permission('solicitar_gastos')
);
drop policy if exists "transactions_delete" on public.transactions;
create policy "transactions_delete" on public.transactions for delete using (public.has_permission('gestionar_roles'));

-- ⚠️ Pastoral: la nota 'solo_pastor' SOLO la ve quien puede 'ver_todos_pastoral';
--    con 'equipo' la puede ver el equipo pastoral. Un ujier/portero NO entra.
drop policy if exists "pastoral_logs_select" on public.pastoral_logs;
create policy "pastoral_logs_select" on public.pastoral_logs for select using (
  public.has_permission('ver_todos_pastoral')
  or (privacy = 'equipo' and public.has_permission('ver_directorio'))
);
drop policy if exists "pastoral_logs_insert" on public.pastoral_logs;
create policy "pastoral_logs_insert" on public.pastoral_logs for insert
  with check (public.has_permission('ver_todos_pastoral') or public.has_permission('ver_directorio'));
drop policy if exists "pastoral_logs_update" on public.pastoral_logs;
create policy "pastoral_logs_update" on public.pastoral_logs for update
  using (public.has_permission('ver_todos_pastoral'))
  with check (public.has_permission('ver_todos_pastoral'));
drop policy if exists "prayer_requests_all" on public.prayer_requests;
create policy "prayer_requests_all" on public.prayer_requests for all
  using (public.has_permission('ver_todos_pastoral') or public.has_permission('ver_directorio'))
  with check (public.has_permission('ver_todos_pastoral') or public.has_permission('ver_directorio'));

-- Sacramentos: lectura autenticados; escritura con 'gestionar_roles' o registro propio.
drop policy if exists "sacrament_records_select" on public.sacrament_records;
create policy "sacrament_records_select" on public.sacrament_records for select
  using (auth.role() = 'authenticated');
drop policy if exists "sacrament_records_insert" on public.sacrament_records;
create policy "sacrament_records_insert" on public.sacrament_records for insert
  with check (public.has_permission('registrar_ofrendas') or public.has_permission('gestionar_roles'));
drop policy if exists "sacrament_records_update" on public.sacrament_records;
create policy "sacrament_records_update" on public.sacrament_records for update
  using (public.has_permission('gestionar_roles')) with check (public.has_permission('gestionar_roles'));

-- Eventos: lectura autenticados; escritura liderazgo.
drop policy if exists "events_select" on public.events;
create policy "events_select" on public.events for select using (auth.role() = 'authenticated');
drop policy if exists "events_write" on public.events;
create policy "events_write"  on public.events for all using (public.has_permission('gestionar_roles'))
  with check (public.has_permission('gestionar_roles'));
drop policy if exists "event_attendance_rw" on public.event_attendance;
create policy "event_attendance_rw" on public.event_attendance for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ⚠️ Check-in de niños: solo quien puede 'checkin_ninos' ve nombres y SALUD.
drop policy if exists "children_checkins_all" on public.children_checkins;
create policy "children_checkins_all" on public.children_checkins for all
  using (public.has_permission('checkin_ninos'))
  with check (public.has_permission('checkin_ninos'));

-- Difusión: lectura autenticados; escritura con 'gestionar_roles'.
drop policy if exists "broadcasts_select" on public.broadcasts;
create policy "broadcasts_select" on public.broadcasts for select using (auth.role() = 'authenticated');
drop policy if exists "broadcasts_write" on public.broadcasts;
create policy "broadcasts_write"  on public.broadcasts for all
  using (public.has_permission('gestionar_roles')) with check (public.has_permission('gestionar_roles'));

-- ==========================================================================
-- 12. CELDAS (buckets) para fotos: miembros, niños, logo.
--     Bucket privado: `public` false. Las fotos se sirven por signed URL.
-- ==========================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', false)
on conflict (id) do nothing;

-- ==========================================================================
-- FIN. Notas finales:
--  * Este esquema no cambia la app: es la capa de datos que se conecta después.
--  * Los 9 roles ya están sembrados para que el selector de rol del login
--    (App.tsx) pueda leerlos tal cual.
--  * Cuando integres, reemplaza los arrays hardcodeados por queries; la
--    pantalla no cambia, solo la fuente de los datos.
--  * Para una congregation real, cambiá 'Célula Betania' en profiles por
--    el nombre real y crea un registro por iglesia si habrá varias.
-- ==========================================================================
