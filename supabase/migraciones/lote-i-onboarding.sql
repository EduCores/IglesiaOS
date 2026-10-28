-- ==========================================================================
-- IglesiaOS — Migración incremental Lote I: Onboarding
-- (pilares de configuración inicial)
--
-- Idempotente: create ... if not exists, drop policy if exists, seeds con
-- "where not exists". Ejecutar completo en el SQL Editor.
-- ==========================================================================

create table if not exists public.onboarding_pillars (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  subtitle    text,
  icon        text,
  status      text        not null default 'pendiente'
              check (status in ('prioritario', 'pendiente', 'completado')),
  action_text text,
  sort        int         not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.onboarding_pillars enable row level security;

drop policy if exists "onboarding_pillars_select" on public.onboarding_pillars;
create policy "onboarding_pillars_select" on public.onboarding_pillars
  for select using (auth.role() = 'authenticated');
drop policy if exists "onboarding_pillars_write" on public.onboarding_pillars;
create policy "onboarding_pillars_write"  on public.onboarding_pillars for all
  using (public.has_permission('gestionar_roles'))
  with check (public.has_permission('gestionar_roles'));

insert into public.onboarding_pillars (title, subtitle, icon, status, action_text, sort)
select v.title, v.subtitle, v.icon, v.status, v.action_text, v.sort
from (values
  ('Directorio de Familias', 'Sube tu listado en XLSX para activar el censo fraternal dominical.', 'group_add', 'prioritario', 'Subir Lista', 1),
  ('Células y Zonas Territoriales', 'Mapea tus grupos pequeños y sectores geográficos de comunión.', 'share_location', 'pendiente', 'Configurar Zonas', 2),
  ('Cuentas y Fondos Financieros', 'Establece tus cuentas de diezmos, misiones y acción comunitaria.', 'account_balance_wallet', 'pendiente', 'Crear Cuentas', 3),
  ('Primer Culto o Evento', 'Planifica el orden litúrgico de tu próximo culto de Alabanza.', 'calendar_month', 'pendiente', 'Crear Culto', 4)
) as v(title, subtitle, icon, status, action_text, sort)
where not exists (select 1 from public.onboarding_pillars);