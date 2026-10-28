-- ==========================================================================
-- IglesiaOS — Migración incremental Lote G: Multimedia
-- (canales sincronizados + grabaciones recientes)
--
-- Para instalaciones que ya corrieron schema.sql anterior (sin estas tablas).
-- Es idempotente: create ... if not exists, drop policy if exists,
-- seeds con "where not exists". Ejecutar completo en el SQL Editor.
-- ==========================================================================

-- 1) Tablas.
create table if not exists public.media_channels (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  description text,
  icon        text,
  bg_color    text,
  icon_color  text,
  is_active   boolean     not null default true,
  sort        int         not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.media_clips (
  id            uuid primary key default gen_random_uuid(),
  title         text        not null,
  meta_label    text,
  badge         text,
  thumbnail_url text,
  src_url       text,
  is_active     boolean     not null default true,
  sort          int         not null default 0,
  created_at    timestamptz not null default now()
);

-- 2) RLS.
alter table public.media_channels enable row level security;
alter table public.media_clips enable row level security;

-- 3) Políticas (lectura autenticados; escritura con 'gestionar_roles').
drop policy if exists "media_channels_select" on public.media_channels;
create policy "media_channels_select" on public.media_channels
  for select using (auth.role() = 'authenticated');
drop policy if exists "media_channels_write" on public.media_channels;
create policy "media_channels_write"  on public.media_channels for all
  using (public.has_permission('gestionar_roles'))
  with check (public.has_permission('gestionar_roles'));

drop policy if exists "media_clips_select" on public.media_clips;
create policy "media_clips_select" on public.media_clips
  for select using (auth.role() = 'authenticated');
drop policy if exists "media_clips_write" on public.media_clips;
create policy "media_clips_write"  on public.media_clips for all
  using (public.has_permission('gestionar_roles'))
  with check (public.has_permission('gestionar_roles'));

-- 4) Seeds (solo si la tabla está VACÍA: re-ejecutar no duplica).
insert into public.media_channels (name, description, icon, bg_color, icon_color, is_active, sort)
select v.name, v.description, v.icon, v.bg_color, v.icon_color, v.is_active, v.sort
from (values
  ('YouTube Live Oficial',   'RTMP Principal · Canal Comunidad de Fe', 'smart_display', 'bg-[#ffd9de]', 'text-[#7f4e57]', true, 1),
  ('Facebook Watch Iglesia', 'Página Oficial Verificada · Evento en Vivo', 'public', 'bg-[#cde5ff]', 'text-[#294964]', true, 2),
  ('Grabación Local en 4K',  'Google Drive Backup · ProRes HQ', 'cloud_upload', 'bg-[#bdeddd]', 'text-[#214e43]', true, 3)
) as v(name, description, icon, bg_color, icon_color, is_active, sort)
where not exists (select 1 from public.media_channels);

insert into public.media_clips (title, meta_label, badge, thumbnail_url, src_url, is_active, sort)
select v.title, v.meta_label, v.badge, v.thumbnail_url, v.src_url, v.is_active, v.sort
from (values
  ('Culto Dominical · Prédica Completa', 'Dom 27 Sep · 412 reproducciones', 'HD',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCFidNdOOMK-Gc1IlEvVisENzHoO1-ixW45S5GfWQkW_zxYISoGnZIFSjLRpUncMXBHxm39TE7O7BLGp31I3AYuJ4pOmPeEKKz2Kb9snNgg4eyDhI864cehrbiTv5KYXpS5bmooWSPVIVzk7VxUbe4oOzvcj1z-GPoNEfUvZir-Bl4VbQPzNWtTwtWde95Pj2QnUeoaocAuY-bMyMMnBiKM5hKaS3uTljA6Md-suUsf7Xvm6x6myS-3',
   'https://www.youtube.com/watch?v=y5JOJx8l-gA', true, 1),
  ('Set de Adoración · Cuán Grande es Dios', 'Dom 27 Sep · 268 reproducciones', '4K',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBXZQ04S41pr2PWBNCWCCtjbco4gMgLaRNTIT55jYfXjLfA-s8KATpoFYyhTwqpYs5UdkYFjVw7OYLn6TQpDlulgjVJ8vpqWhDcv37unHoA_gE7cUmiFPHMwPZLUMmkYunqQzlH0QPDwNX0jIfgQq8UoqbH4XsvcI7Ezmku9lZvUE5G8-vPtiMcPHkG1VrpPsfH-1jMTuoxFTfQ2i0-h1bGvlz79Hj1VRddlOdSAA1jXHSUoplKoXOm',
   'https://www.youtube.com/watch?v=6sRKYpgfS4I', true, 2),
  ('Bautismos & Testimonios · Servicio Especial', 'Vie 18 Sep · 305 reproducciones', 'CLIP',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCKuDV7C_6aZYyhi5tu2z1OQld66W9ew608SiUHa3NqIfobUM8rA2zg1aUrTDQ8M1I0dlr7KwtsSlxHrDjlju_ElTynZ8KOI6XMzwgagPKu21q__Hyhgimph3gdWwy7ykxaa_B1XRtaI6xn_h-zm-LSu1Il38Ym74SPPIv8MkZMA-Z-_XHdlsB-6RUvpcXOBDE93EFLAM8dpVEzrxAv27BVEgdxdWq6REqUpyoAUXzDlsc7ONsTYFtF',
   'https://www.youtube.com/watch?v=k6sY6-PLxko', true, 3)
) as v(title, meta_label, badge, thumbnail_url, src_url, is_active, sort)
where not exists (select 1 from public.media_clips);