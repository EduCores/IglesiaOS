# Pendientes — IglesiaOS

> Registro de cambios acordados para el futuro próximo, ordenados por prioridad.

---

## ✅ CORREGIDO — El video de fondo (nubes) no se veía: codec incompatible

**Estado:** ✅ Aplicado el 01-oct-2026.

**Síntoma:** `public/videos/nubes1.mp4` respondía HTTP 200 en GitHub Pages (ruta y
despliegue correctos), el `<video>` existía en el DOM y la CSS se aplicaba, pero en el
celular **no se veía absolutamente nada**. Se intentó arreglar con transparencias,
`z-index`, quitar velos y `pb-*` durante varias iteraciones: todo en vano.

**Causa raíz real (nada que ver con CSS, capas ni caché):**
```text
Stream #0:0: Video: mpeg4 (Advanced Simple Profile) (mp4v / 0x7634706D), 852x480, 30fps
Stream #0:1: Audio: aac (mp4a), 48000 Hz, stereo, 2 kb/s   ← prácticamente silencio
```
El archivo estaba en **MPEG-4 Parte 2 (`mp4v`)**, un codec que **los navegadores móviles
no decodifican** (Chrome/Android y Safari/iOS solo aceptan **H.264 / `avc1`** en MP4).
El `<video>` cargaba el contenedor, no podía decodificar la pista de video y por eso el
elemento quedaba en blanco (o transparente) sin lanzar error visible.

**Solución aplicada:** recodificar a H.264 con `moov` al inicio (`faststart`) y sin audio,
usando el ffmpeg local del sistema:
```powershell
& 'C:\Program Files\Replay\resources\bin\ffmpeg.exe' -y -i 'public\videos\nubes1.mp4' `
  -an -c:v libx264 -profile:v main -level 3.1 -pix_fmt yuv420p -crf 26 -preset medium `
  -movflags +faststart 'public\videos\nubes1_h264.mp4'
```
Resultado: 5.87 MB → **1.90 MB**, `Video: h264 (Main) (avc1), yuv420p, 852x480, 30 fps`,
`moov` inmediatamente después de `ftyp`. Verificado en `public/` y en `dist/`.

**Regla para el futuro — CUALQUIER video nuevo debe cumplir:**
- [ ] Codec de video **H.264 (`avc1`)**, perfil `main` o `high`, `-pix_fmt yuv420p`.
- [ ] Codec de audio **AAC (`mp4a`)** si lleva sonido (o `-an` si es fondo mudo).
- [ ] Flag **`-movflags +faststart`** (sin él, algunos móviles/redes no arrancan).
- [ ] Comprobar con: `ffmpeg -hide_banner -i archivo.mp4` y verificar que diga `avc1`.
- [ ] Nunca usar `.mp4` codificado con `mp4v` / MPEG-4 Parte 2, `.wmv`, `.avi` o `.mov` con HEVC sin fallback.

---
## ✅ MUY IMPORTANTE — Detección automática de vista (móvil / escritorio)

**Estado:** ✅ Aplicado el 01-oct-2026. Al mismo tiempo se **eliminó el panel superior**
(selector de pantallas de Stitch, toggle manual "Móvil / Escritorio" y botón "Ocultar panel").

**Archivo modificado:** `src/App.tsx` (definición de `viewMode`).

### Problema (histórico)
La vista inicial siempre era `"mobile"`:

```tsx
const [viewMode] = useState<"mobile" | "desktop">("mobile");
```

El usuario debía descubrir y pulsar el toggle manual "Móvil / Escritorio" de la barra
superior. En un producto real, el layout debe adaptarse solo al dispositivo:

- Celular → vista **Móvil** (tab bar, marco de app).
- Notebook / desktop → vista **Escritorio** (header administrativo, grids amplios).

### Solución aplicada
- Se eliminó el panel superior completo (chrome de demo).
- `viewMode` se detecta **al cargar** con `window.matchMedia("(max-width: 767px)")`:
  - `< 768px` → `"mobile"`
  - `>= 768px` → `"desktop"`
- El toggle manual ya no existe (vivía en el panel eliminado). Si algún día se quiere
  recuperar como override para demos, reubicarlo como botón flotante discreto.

### Criterio de aceptación
- [x] En un notebook (≥768px) la app abre en vista Escritorio por defecto.
- [x] En un celular (<768px) la app abre en vista Móvil por defecto.
- [x] `npm run lint` y `npm run build` en verde; verificar el JS en producción.
- [~] Override manual para demos: **no aplicado** — se eliminó junto con el panel (ver arriba).

### Por qué es MUY IMPORTANTE
La estrategia de IglesiaOS es web responsive para ambos mundos: móvil para líderes en
terreno (asistencia, culto en vivo, difusión) y escritorio para secretaría/tesorería
(finanzas, censo, informes). Sin la detección automática, un usuario de notebook ve el
simulador de teléfono hasta que descubre el toggle — fricción innecesaria en producción.

---

## ✅ APLICADO — Inicio: video más sutil, sin foto de fondo en la tarjeta y con icono eclesial

**Estado:** ✅ Aplicado el 01-oct-2026.

1. **Video de nubes: UNA sola perilla de intensidad** (`src/index.css`). La opacidad se
   controla **únicamente** con el `opacity` de `.sky-video` (hoy `0.98`). El
   `@keyframes skyVideoFadeIn` declara **solo el fotograma `from` (`opacity: 0`)**: al no
   existir un `to`, el navegador interpola hasta el valor base del elemento, así que el
   número **no se repite en ningún otro sitio**; el bloque `prefers-reduced-motion` solo
   hace `animation: none` y el video queda en ese mismo valor base. ⚠️ El keyframe no
   puede quedar vacío ni llevar `to`, o el valor base se ignora.
   **Para subir/bajar la intensidad: cambiar SOLO el `opacity` de `.sky-video`.**
   *(Antes estaba duplicado en el `to` del keyframe y en el fallback de reduced-motion;
   si se movía uno solo, el aspecto del video cambiaba según la preferencia del sistema
   operativo del visitante.)*
2. **Foto de fondo de la tarjeta de bienvenida eliminada** (`src/App.tsx`, Inicio): se
   borró el `<div>` con `style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/…')" }}`
   que estaba detrás de "Paz y Gracia / Buenos días, Pastor Samuel". Se **mantuvo** la
   capa `bg-gradient-to-t from-white/50 via-white/25 to-transparent` como velo de
   legibilidad de la cita bíblica sobre el video; si se quiere transparencia total,
   basta borrar esa única línea.
3. **Icono de la insignia "Paz y Gracia"** (`src/App.tsx`): se cambió `eco` (hojita,
   lenguaje wellness/naturaleza) por **`folded_hands`** (manos en oración), en línea con
   el tema eclesial de la app. Donde antes decía `>eco</span>` ahora dice
   `>folded_hands</span>`.

**Nota — por qué "el cambio no se veía en el celular" (dos causas que se suman):**

1. **El archivo local no es lo que ve el teléfono.** El celular lee el sitio *desplegado*
   (`https://educores.github.io/IglesiaOS/`). Editar `src/index.css` y mirar el celular no
   cambia nada hasta hacer `npm run build` + `git push` (GitHub Pages despliega solo) y
   esperar el deploy + la caché (`Cache-Control: max-age=600`, 10 min → recarga forzada o
   incógnito).
2. **`@media (prefers-reduced-motion: reduce)` es condicional, no un bug.** Ese bloque solo
   se aplica si el sistema operativo del visitante tiene activado "Reducir movimiento"
   (iOS: Ajustes → Accesibilidad → Movimiento → Reducir movimiento; Android: Ajustes →
   Accesibilidad → Eliminar animaciones). **Por defecto viene desactivado**, así que el
   bloque se ignora por completo — y `!important` no sirve de nada dentro de él.

**Bucle de prueba rápido (sin deploy ni caché):** `npm run dev` en el PC y abrir en el
teléfono `http://192.168.100.20:3000/` (misma Wi‑Fi; la IP puede cambiar, se consulta con
`Get-NetIPAddress -AddressFamily IPv4`). En dev el `base` es `/`, en build es `/IglesiaOS/`
(ver `vite.config.ts`). HMR aplica los cambios en vivo.

**Regla para iconos — verificado contra el CDN de Material Symbols:**
El glifo **`cross` NO existe** (`404`) → no hay un icono de "cruz suelta" en Material
Symbols. Para lo religioso/eclesial usar, ya probados (todos `200`):
`church` (templo con cruz), `folded_hands` (manos orando), `menu_book` (Biblia),
`auto_stories`, `volunteer_activism`. **Verificar cualquier icono nuevo antes de usarlo**
(un nombre inexistente se renderiza como un hueco vacío, sin error en consola):
```powershell
Invoke-WebRequest -Method Head -Uri "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/<nombre>/default/24px.svg"
# 200 = existe · 404 = no existe
```

### ⏳ PENDIENTE — Vocabulario heredado del tema "Mindora" (bienestar) → lenguaje de iglesia

**Auditoría hecha el 01-oct-2026:** ya **no queda** vocabulario de meditación/consciencia
en el código (búsqueda de `meditac`, `mindful`, `conscien`, `concienc`, `self_improvement`,
`respirac`, `bienestar`, `wellness`, `mindset` → **0 resultados**). Lo único que
sobrevive es el **nombre de marca del tema original ("Mindora")**, que aún es visible
para el usuario en la pantalla de Sacramentos:

- `src/Sacramentos.tsx:490` → alerta de descarga `Guía_Preparación_Bautismal_Mindora.pdf`.
- `src/Sacramentos.tsx:508` → correo `secretaria@comunidadmindora.org`.
- Solo internos (comentarios): `src/App.tsx:174` y `:204`, `src/Directorio.tsx:203`,
  `src/index.css:89`.

**Falta únicamente que el usuario decida el nombre real** (¿"Comunidad de Fe"? ¿nombre de
la iglesia?) para reemplazar esas dos cadenas visibles. No se aplicó aún para no inventar
la identidad de la iglesia.

---
## 💡 Propuestas menores (identificadas, no acordadas aún)

1. **PWA (Progressive Web App):** manifest + service worker para que el sitio sea
   instalable en Android/iOS ("Añadir a pantalla de inicio"), con ícono propio y
   funcionamiento offline. Peso adicional: unos pocos KB.
2. **Uso de `lottie-react` y `react-player`** (ya instalados el 01-oct-2026):
   - ✅ `react-player` **integrado en `src/Multimedia.tsx`** (01-oct-2026) con carga
     diferida (`React.lazy` + `Suspense`): el preview de cámara reproduce video real al
     iniciar la transmisión, y se añadió la sección "Grabaciones Recientes" con clips
     reproducibles (vídeo embebido de YouTube).
   - ✅ **Videos como fondo** (01-oct-2026): el feed de cámara y cada clip de
     "Grabaciones Recientes" pueden activarse como fondo del contenido principal con el
     botón `wallpaper` (toggle). Aparece un chip "Fondo activo · …" para quitarlo, y
     mientras hay fondo los paneles pasan a glass translúcido (`bg-white/75` +
     `backdrop-blur`); sin fondo, el diseño queda idéntico al original.
     **Pendiente:** reemplazar las URLs de demostración (`src` de cada clip y la
     constante `DEMO_CAMERA_FEED`) por las grabaciones y señales reales del canal.
     Mientras tanto: el feed de cámara usa música cristiana en vivo 24/7
     (YouTube · letrasdelreino) y cada clip apunta a un vídeo público de YouTube.
   - `lottie-react` aún sin uso — importarla con carga diferida (`React.lazy` /
     `import()` dinámico) en la pantalla que la use, para no inflar la carga inicial.
