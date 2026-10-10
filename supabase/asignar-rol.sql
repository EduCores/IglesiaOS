-- ==========================================================================
-- IglesiaOS — Asignar rol a un usuario (operativo, no destructivo).
-- Uso: edita el email y el título del rol, ejecuta solo ese bloque.
-- Requisito: el usuario ya debe existir (creado desde la app: Perfil →
-- Cuenta en la nube → Crear cuenta, o desde Authentication → Users).
-- El UID se obtiene en Authentication → Users → copiar UID, o por email
-- como en los ejemplos de abajo (más cómodo).
-- ==========================================================================

-- 1) Ver usuarios y su rol actual (solo lectura).
select u.email as usuario, r.title as rol_actual, p.full_name as nombre
from auth.users u
left join public.profiles p on p.id = u.id
left join public.roles r on r.id = p.rol_id
order by u.email;

-- 2) Ver roles disponibles (solo lectura).
select title, type, is_active from public.roles order by title;

-- 3) Asignar rol (EDITA email y título, luego ejecuta).
-- update public.profiles p
-- set rol_id = (select id from public.roles where title = 'Tesorero')
-- where p.email = 'persona@ejemplo.com';

-- 4) Ver permisos efectivos del usuario (solo lectura, verifica el cambio).
-- select u.email as usuario, r.title as rol, rp.permission as permiso
-- from auth.users u
-- join public.profiles p on p.id = u.id
-- join public.roles r on r.id = p.rol_id
-- join public.role_permissions rp on rp.rol_id = r.id
-- where u.email = 'persona@ejemplo.com' and rp.allowed = true
-- order by rp.permission;

-- 5) Quitar rol (volver a Miembro).
-- update public.profiles p
-- set rol_id = (select id from public.roles where title = 'Miembro')
-- where p.email = 'persona@ejemplo.com';
-- ==========================================================================