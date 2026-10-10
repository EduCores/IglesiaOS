-- ==========================================================================
-- IglesiaOS — Verificación del esquema (ejecutar DESPUÉS de schema.sql).
-- No modifica nada: solo consulta. Debe devolver 14 / 14 / 30 / 17.
-- ==========================================================================

-- 1) Tablas creadas (esperado: 14)
select count(*) as tablas_creadas
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE';

-- 2) RLS habilitado en todas (esperado: 14 de 14; cualquier FALSE = tabla
--    expuesta: corrige antes de seguir).
select
  count(*) filter (where c.relrowsecurity) as con_rls,
  count(*) filter (where not c.relrowsecurity) as sin_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r';

-- 3) Políticas creadas (esperado: 30: 28 base + insert/update propios)
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
--   tablas_creadas 14 · con_rls 14 · sin_rls 0 · politicas 30 · roles 17
-- Si sin_rls > 0 o la consulta 6 devuelve tablas, NO sigas: corrige primero.
-- ==========================================================================