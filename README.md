# IglesiaOS

Sistema de administración integral para iglesias: miembros, células, finanzas,
eventos, pastoral, multimedia, sacramentos y más. App React + Vite + Supabase
(opcional), desplegada en GitHub Pages.

## Desarrollo local

**Requisitos:** Node.js 22+

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. (Opcional) Conectar a Supabase: copia `.env.example` a `.env` y completa
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Sin esto la app funciona
   con datos locales de demo.
3. Ejecutar:
   ```bash
   npm run dev
   ```
   Abre http://localhost:3000

## Scripts

- `npm run dev` — servidor de desarrollo (puerto 3000)
- `npm run build` — build de producción
- `npm run preview` — previsualizar el build
- `npm run lint` — verificación de tipos (`tsc --noEmit`)

## Base de datos

El esquema completo está en `supabase/schema.sql` (idempotente). Las
migraciones incrementales por lote están en `supabase/migraciones/`. Para
verificar una instalación, ejecuta `supabase/verificar.sql` (esperado:
22 tablas / 22 RLS / 46 políticas / 17 roles).

## Despliegue

Push a `main` dispara el workflow `.github/workflows/deploy.yml` que publica
en GitHub Pages (`https://educores.github.io/IglesiaOS/`).

## Más información

- `PENDIENTES.md` — historial de lotes y decisiones de diseño.
- `docs/base-de-datos.md` — arquitectura de la base de datos.
