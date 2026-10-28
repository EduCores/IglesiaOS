-- ==========================================================================
-- IglesiaOS — Verificación del esquema (ejecutar DESPUÉS de schema.sql).
-- No modifica nada: solo consulta. Debe devolver 21 / 21 / 44 / 17.
-- (Lote E: 19 tablas y 40 políticas. Lote F: sin tablas nuevas.
--  Lote G: 21 tablas y 44 políticas — se suman media_channels y media_clips.)
-- ==========================================================================

-- 1) Tablas creadas (esperado: 21)
select count(*) as tablas_creadas
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE';

-- 2) RLS habilitado en todas (esperado: 21 de 21; cualquier FALSE = tabla
--    expuesta: corrige antes de seguir).
select
  count(*) filter (where c.relrowsecurity) as con_rls,
  count(*) filter (where not c.relrowsecurity) as sin_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r';

-- 3) Políticas creadas (esperado: 44: 40 del Lote E + 4 del Lote G)
select count(*) as politicas
from pg_policies
where schemaname = 'public';

-- 4) Roles sembrados (esperado: 17, con Voluntario inactivo)
select title, type, is_active
from public.roles
order by is_active desc, title;

-- 5) Permisos de los equipos de servicio (esperado: 2 con
--    registrar_ofrendas y 2 con solicitar_gastos).
select r.title, rp.permission, rp.allowed
from public.role_permissions rp
join public.roles r on r.id = rp.rol_id
where rp.allowed and rp.permission in ('registrar_ofrendas', 'solicitar_gastos')
order by rp.permission, r.title;

-- 6) Tablas SIN ninguna política (esperado: ninguna; una tabla con RLS
--    activo y cero políticas queda bloqueada para todos).
select tablename
from pg_tables
where schemaname = 'public'
  and tablename not in (
    select tablename from pg_policies where schemaname = 'public'
  );

-- ==========================================================================
-- RESULTADO ESPERADO EN UNA TABLA RESUMEN:
--   tablas_creadas 19 · con_rls 19 · sin_rls 0 · politicas 40 · roles 17
-- Si sin_rls > 0 o la consulta 6 devuelve tablas, NO sigas: corrige primero.
-- ==========================================================================