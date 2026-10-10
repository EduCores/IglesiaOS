# Datos de conexión a la base de datos (Supabase).
#
# ⚠️ ESTE ARCHIVO CONTIENE DATOS SENSIBLES: RUT/DNI, fechas de nacimiento,
# direcciones, salud de menores y notas pastorales confidenciales
# (Ley 19.628, Chile). Lee la sección "Datos sensibles" antes de tocarlo.
# ==========================================================================

## Decisión de arquitectura (06-oct-2026)

**Stack: React + Vite + Supabase.** NO se migró a Next.js.

Motivos documentados en PENDIENTES.md. Resumen: la app es interna, detrás
de login, sin contenido público que indexar; Next.js (SSR/SEO) no aporta y
obligaría a mudar de hosting (GitHub Pages es estático). Para el futuro se
descartó compartir datos con la eventual red social: debe ser otro
proyecto, con su propio backend (mismos datos sensibles).

## Estado actual

- **Base de datos:** todavía NO creada. Los datos siguen hardcodeados en los
  componentes (`App.tsx` y módulos) para que la app funcione sin backend.
- **Esquema listo:** `supabase/schema.sql` (14 tablas + RLS + seed de los
  **17 roles** con sus permisos: coinciden con `ROLES_INICIALES` de la app).
- **Cliente listo:** `src/lib/supabase.ts` (`supabase` = null si no hay env).
- **Tipos listos:** `src/lib/tipos.ts` (espejo del esquema).

## Pasos para conectar (cuando crees el proyecto)

1. Crea el proyecto en supabase.com (región la más cercana a Chile).
2. SQL Editor → pega `supabase/schema.sql` completo → Run.
3. Project Settings → API → copia URL y `anon` key.
4. Crea `.env` con esas dos valores (ver `.env.example`).
5. La app seguirá funcionando igual hasta que reemplaces los arrays por
   queries; la conexión es gradual, pantalla por pantalla.

## Comandos útiles (con Supabase CLI instalado)

    supabase gen types typescript --project-id <ref> --out src/lib/tipos.generated.ts

Genera tipos exactos desde la base real; reemplaza `src/lib/tipos.ts`.

## Datos sensibles — antes de producción

- [ ] RLS probado: un usuario con rol Ujier NO debe leer `pastoral_logs`
      con `privacy='solo_pastor'` ni `children_checkins`.
- [ ] Bucket `avatars` es privado; las fotos se sirven por signed URL.
- [ ] Backups automáticos activados en el plan de Supabase.
- [ ] Política de retención: qué se borra y cuándo (datos de menores).
- [ ] `service_role` key solo en servidor, nunca en el frontend.