-- ==========================================================================
-- IglesiaOS — Migración incremental Lote H: Sacramentos
-- (columna candidate_name en sacrament_records + lectura desde la app)
--
-- La tabla sacrament_records ya existe (schema base). Este lote solo agrega
-- la columna candidate_name (texto libre del candidato, sin ficha CRM) y
-- deja las políticas RLS ya creadas (select authenticated; insert con
-- registrar_ofrendas o gestionar_roles; update con gestionar_roles).
-- Idempotente: alter ... if not exists.
-- ==========================================================================

alter table public.sacrament_records
  add column if not exists candidate_name text;