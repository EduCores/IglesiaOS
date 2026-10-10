# Pendientes — IglesiaOS

> Registro de cambios acordados para el futuro próximo, ordenados por prioridad.

---

## ✅ APLICADO — Temas de color: Zafiro y Terracota (light/dark c/u) + icono palette

**Estado:** ✅ Aplicado el 06-oct-2026, desde `DESIGN (1).md` (Serene Ecclesia →
**Zafiro** `#1a4b84`) y `DESIGN (2).md` (Sanctuary Warmth → **Terracota**
`#C25E2E`). Eucalipto (verde actual) sigue por defecto.

**Mecanismo:** la marca vive como hex literales en cientos de clases, así que el
tema es override CSS, no refactor: `src/temas-color.css` (generado, 59 tokens ×
2 temas × claro/oscuro, 241 reglas) cuelga de `html[data-tema]` (+ `.dark`) con
`!important`; el alfa de cada token se preserva (solo cambia el matiz).
Eucalipto no tiene reglas (CSS base intacto).

**Switcher:** icono `palette` junto al toggle claro/oscuro (móvil y escritorio)
con panel vidrio (Eucalipto/Zafiro/Terracota + check). Hook `useTemaColor` en
`src/useTheme.ts`, persiste `iglesiaos-tema-color`, independiente del modo
claro/oscuro: cada color trae versión light y dark de los docs.

**Verificado:** capturas Edge headless de las 4 combinaciones con matices
correctos (botones `#1a4b84` / `#C25E2E`, acentos celestial/ámbar en oscuro).

**Ampliación 06-oct-2026 (tarde): cobertura total de marca + panel por portal.**
- `src/temas-color.css` pasa de 59 a **90 combinaciones** (241 → 365 reglas):
  verde medio `#507d70`, rampa del gráfico `#d5e9e1/#c0ded3/#a8d2c4/#7fb3a1`
  (Zafiro: escala `#d5e3ff→#99cbff` / vidrio celestial en oscuro; Terracota:
  arena→durazno→miel `#F3EEE6→#E09F3E` / vidrio `#E07A5F` en oscuro) y familia
  azul-gris `#bddefe/#e0f0fb/#e7f6ff/#e6f0f6/#daebf5/#aacaea/#aecdf5/#ccdce7/
  #d8e7f0/#9bc8f0/#43627e` con paletas de `DESIGN (1).md` y `DESIGN (2).md`.
- **Bug de especificidad en oscuro (detectado por probe de estilos
  computados):** las reglas `.dark` de `index.css` con `:not()` tienen
  `(0,4,0)/(0,5,0)` y ganaban a los overrides `(0,3,1)`, así que en oscuro
  `bg-[#bdeddd]`, `text-[#386458]` y afines **nunca remapeaban**. Las 38
  reglas dark afectadas ahora espejan la misma cadena `:not()` del rival
  (`(0,5,1)` gana) — misma convención del bloque HOVERS.
- `src/index.css` (final): `accent-color` de checkboxes/radios y botón
  "Perfil" por tema (el override por clases no los alcanzaba).
- `src/App.tsx`: sombra `rgba(56,100,88,…)` fija → `shadow-[#386458]/35`
  (token remapeable).
- **Panel del selector por PORTAL a `document.body`:** el `fixed z-[70]`
  vivía dentro del header (`relative z-10`) y el contenido posterior (su
  propio `z-10`) pintaba encima de todo ese stacking context. En el body no
  hay ancestro que lo atrape. Geometría probada en DOM: `right=13.5px`,
  `w=198px`, `pos=fixed` (el "corte" visto en capturas headless era
  reescalado del propio headless, `vw=756` real vs imagen de 390).
- **Se conservan a propósito (semánticos, no marca):** familia rosa
  (`#ffd9de/#f4b6bf/#663a42/#7f4e57/#331018`), error `#ba1a1a`, neutros
  (`#23323a/#f4faff/#0e1d25/#001d32/#002019/#404845`) y verde
  `text-emerald-600` de "MODO INTEGRADO".
- **Verificado:** estilos computados exactos en las 4 combinaciones
  (p. ej. oscuro+zafiro: texto `#38bdf8`, barra J `#2060aa`, icono
  `rgba(23,47,82,0.45)`; oscuro+terracota: `#E07A5F`, `#A34E26`,
  `rgba(44,38,33,0.45)`) + capturas claro/oscuro en ambos temas.
- **Corrección (misma tarde): fuga substring en variantes.** Los links del
  menú quedaban sólidos en Zafiro/Terracota: la regla plana
  `bg-[#386458]` casaba por substring con `hover:bg-[#386458]/5` y pintaba
  en reposo (probe: inactivo `rgb(26,75,132)`). Era sistémico: 11 reglas
  planas fugaban a `hover:/focus:/focus-within:/selection:/group-hover:`
  (inputs con borde siempre, iconos `group-hover` fijos, página teñida por
  `selection:` del root). Se agregaron 58 `:not()` guards anti-fuga
  (script `fix-leaks.js`, no versionado); auditado que ningún elemento
  combina base + variante de la misma familia. Menú verificado por probe
  (inactivo transparente) y captura.

---

## ✅ APLICADO — Equipos de servicio: Portero, Ujieres, Aseo y Cocina (Roles + Finanzas)

**Estado:** ✅ Aplicado el 06-oct-2026, a pedido del usuario.

**Roles** (`src/App.tsx`, `RolesScreen`): 4 roles nuevos tipo `apoyo`, tag
`Servicio`, `members: 0`, activos — Portero (`door_open`, tinte menta:
registra ofrendas + control de acceso), Ujieres (`hail`, tinte menta +
azul: registran ofrendas + orden), Servicio de Aseo
(`cleaning_services`: solicita gastos de limpieza) y Cocina + Ayudantes
(`soup_kitchen`: solicita gastos de víveres). Iconos verificados `200`
contra el CDN de Material Symbols. Solo tokens hex ya cubiertos por
`temas-color.css` (cero reglas CSS nuevas); el filtro Apoyo y la Auditoría
los cuentan sin cambios de código.

**Finanzas** (`FinanzasDashboardScreen`): 3 movimientos `operaciones`
(`minus`) — Insumos de Aseo −$45.000, Víveres Cocina −$60.000, Mantención
Puerta −$25.000, familia rosa de gastos; el modal de reportes los suma
solo. El donut de presupuesto es estático (no se tocó a propósito).

---

## ✅ APLICADO — Lenguaje eclesial (fuera conceptos de meditación)

**Estado:** ✅ Aplicado el 06-oct-2026, a pedido del usuario. Auditoría
previa (ES+EN: `meditac|mindful|yoga|respira|bienestar|afirmac|decreto|…`)
sin prácticas de meditación en el código; se ajustaron 5 textos con
resonancia wellness a lenguaje eclesial/neutro:
- `App.tsx` tarjeta devocional: "Pausa Espiritual" → **"Devocional"**.
- `OnboardingSetup.tsx`: "orden, serenidad y gracia" → **"orden, paz y gracia"**.
- `Eventos.tsx`: "acordes contemplativos" → **"acordes de adoración"**.
- `AngelAsistente.tsx`: "revisarlo con calma" → **"revisarlo en detalle"**.
- `BitacoraPastoral.tsx`: estado de ánimo "Calma" → **"En Paz"** (a juego
  con "En Gozo"; son estados observados en la visita, no prácticas).
- Se conservan por ser eclesiales: "Versículo del día", "Devocional",
  "Reflexión Pastoral", "Vigilia", "Retiro", "Paz/Gracia", letra de
  "Cuán Grande es Dios" y el nombre "Fuego & Quietud" (título propio de
  la actividad).

---

## ✅ APLICADO — Punto de inflexión: base de datos preparada (Supabase, sin migrar a Next.js)

**Estado:** ✅ Aplicado el 06-oct-2026. Decisión tomada: **React + Vite se
mantiene**; se prepara la capa de datos.

**Por qué NO Next.js (respuesta con datos, no opinión):** el deploy es
GitHub Pages (`deploy.yml` → `vite build` → artifact = hosting **estático**);
el código tiene **0** llamadas `fetch`/axios/GraphQL (app 100 % cliente);
y SSR/SEO no aporta en una app interna detrás de login. Migrar obligaría a
cambiar de hosting y reescribir 8.882 líneas *antes* de que exista la base
de datos. La red social futura **sí** querría Next.js (SEO público), pero
como **proyecto aparte**: no debe compartir datos con IglesiaOS.

**Por qué Supabase y no Neon:** no son la misma categoría. Neon es solo
hosting de Postgres (habría que agregarle auth y permisos aparte);
Supabase = Postgres + Auth + Storage + **RLS** (permisos aplicados en la
base) + Realtime. Los roles agregados (Portero/Ujieres/Aseo/Cocina) dejan
de ser texto: `role_permissions` los vuelve comprobables.

**Entregado:**
- `supabase/schema.sql` — 14 tablas (perfiles, roles, role_permissions,
  miembros, células, transacciones, bitácora pastoral, motivos de oración,
  sacramentos, eventos, asistencia, check-in niños, difusión) + RLS con
  políticas por permiso + bucket privado `avatars` + **seed de los 9 roles**
  actuales (coinciden con `ROLES_INICIALES`, así el selector de rol del
  login los puede leer tal cual).
- `src/lib/supabase.ts` — cliente que **no rompe la app**: sin variables de
  entorno exporta `supabase = null` / `isSupabaseReady = false` y la app
  sigue con los datos actuales (verificado en captura).
- `src/lib/tipos.ts` — tipos del dominio (evita `any` al integrar).
- `.env.example` reescrito (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
- `docs/base-de-datos.md` — arquitectura, pasos de conexión y checklist de
  datos sensibles (Ley 19.628).
- `metadata.json` **eliminado**: boilerplate muerto de AI Studio
  (mencionaba Cloud Run y Gemini; nada en el repo lo referenciaba).

**Datos sensibles detectados al modelar:** `CensoMiembro` (RUT, nacimiento,
dirección), `CheckinNinos` (alergias de menores), `BitacoraPastoral` (notas
confidenciales de salud). Por eso `children_checkins` va en tabla aparte
con RLS estricta, y la bitácora filtra por `privacy`.

**Pendiente (siguiente paso acordado):** partir `App.tsx` (2.752 líneas)
en módulos **antes** de reemplazar los arrays por queries, y agregar router
(react-router) para URLs y botón atrás.

---

## ✅ APLICADO — Fases 1-4: refactor modular, router, Auth nube y Roles piloto

**Estado:** ✅ Aplicado el 10-oct-2026. Stack intacto (React + Vite).

**Fase 1 — App.tsx partida (2.760 → ~1.500 líneas):** `src/screens/`
(4 pantallas), `src/components/chrome.tsx` (FooterVideo, NavMenuPanel,
ThemeToggle, TemaColorBoton), `src/navigation.ts` (ScreenId + NAV_GROUPS),
`src/data/roles.ts` (ROLES_INICIALES + tipo RolLocal). Sin cambios
visuales (verificado por captura).

**Fase 2 — react-router:** cada pantalla tiene URL (`/`, `/finanzas`,
`/roles`, `/hermanos`, …; ver `SCREEN_PATHS`). Recargar no pierde la
pantalla, el botón atrás funciona, rutas falsas van a inicio. `basename`
desde Vite (dev `/`, Pages `/IglesiaOS`) + `public/404.html` y script en
`index.html` para recargas y enlaces profundos en GitHub Pages.

**Fase 3 — Auth en la nube (`src/lib/auth.tsx`, aditiva):** sin backend no
muestra nada y todo sigue igual (verificado por captura). Con backend, el
modal Perfil ofrece Entrar / Crear cuenta (las nuevas nacen como Miembro);
la insignia y la ficha usan nombre/rol de la BD cuando hay sesión cloud.
Requiere las policies `profiles_insert_own` / `profiles_update_own`
(agregadas a `schema.sql` — **re-ejecutarlo**). Bootstrap: el primer
usuario nace Miembro; un SQL del dashboard le da Pastor Principal (ver
`auth.tsx`).

**Fase 4 — Roles piloto (`src/lib/useRoles.ts`):** con sesión cloud lee
`roles` y mezcla por título (estilo local + `checked` de la BD); toggle y
crear escriben optimista + intento en nube (si RLS niega: toast honesto,
cambio local). Sin nube: idéntico a antes (verificado por captura).

**Pendiente:** `.env` real con URL + anon key, probar login cloud contra
la base creada, y conectar el resto de pantallas una por vez.

---

## ✅ APLICADO — 17 roles: Miembro general, Pastor 1/2, equipo de alabanza y Portero sin ofrendas

**Estado:** ✅ Aplicado el 06-oct-2026, a pedido del usuario.

**Nuevos (app + seed, con iconos verificados `200` en el CDN):**
- **Miembro** (apoyo, tag General): usuario general sin cargo; solo navega
  (sin directorio, finanzas ni pastoral — coincide con el fallback
  `"Miembro"` de sesiones migradas).
- **Pastor 1 / Pastor 2** (liderazgo): como Pastor Principal pero sin
  `gestionar_roles`; con directorio, pastoral, ofrendas, gastos, finanzas
  y check-in. (Ojo: "Pastor Principal" **ya existía**, no se duplicó.)
- **Sonido** (`speaker`), **Técnico Sonido** (`tune`), **Multimedia**
  (`videocam`), **Músicos** (`music_note`, banda tradicional),
  **Voces** (`mic`) — ministerios, sin permisos financieros.
- Renombre pedido: **"Dir. Alabanza" → "Director Alabanza"** (app + base
  con `UPDATE` idempotente; el Ángel también entiende "sonido, músico,
  voces, coro, banda, aseo, cocina, pastor 1/2").

**Portero sin `registrar_ofrendas` (pedido explícito):** queda solo para
Ujieres (+ Tesorero y pastores). En la app su tarjeta pasa a "Control de
acceso" con tinte gris; en la base, un `UPDATE allowed=false` idempotente
revoca el permiso en instalaciones que ya corrieron el seed anterior.

**`ver_directorio` otorgado a roles operativos** (era necesario: sin él,
`members_select` bloqueaba el Directorio para *todos* al migrar):
Pastor Principal, Pastores 1/2, Tesorero, Director Alabanza, Líder de
Célula, Portero, Ujieres. `checkin_ninos` para pastores, Líder, Ujieres y
Portero. Aseo/Cocina/Miembro/música quedan con lo básico de `authenticated`
(una línea SQL los amplía si se necesita).

**Verificado:** `lint` en verde, probe DOM `ROLES17 total=17
faltan=[ninguno]`, SQL sin cirílicos y 28/28 policies con `drop` previo.

---

## ✅ APLICADO — Insignia con nombre y rol de quien se loguea

**Estado:** ✅ Aplicado el 06-oct-2026, a pedido del usuario.

**Insignia del header de escritorio** (`src/App.tsx`): con sesión muestra
el **nombre** (línea 1) y su **rol** (línea 2, mayúsculas); sin sesión
muestra **"Pastor Samuel" / "Pastor"** (texto pedido, reemplaza al
"Célula Betania / Modo Integrado" anterior). En móvil no existe esa
insignia: el rol se ve en la ficha del modal Perfil (compartido).

**Sesión con rol** (`src/App.tsx`): tipo `{nombre, email, rol}` en
`localStorage ("iglesiaos-sesion")`; sesiones viejas sin rol migran a
`"Miembro"`. Formularios de Acceso y Editar perfil con **selector de rol**
(solo roles activos de `ROLES_INICIALES`; si el guardado ya no está
activo, se ofrece igual para no perderlo). La ficha "Mi perfil" muestra
el rol bajo el correo.

**Refactor previo:** la lista inicial de roles sale del estado de
`RolesScreen` a la constante `ROLES_INICIALES` (mismo contenido, cero
cambio visual en Roles). Límite honesto: los roles creados con "Crear
Nuevo Rol" no salen en el selector hasta recargar; el rol es declarativo
(sin backend no hay verificación real).

---

## ✅ APLICADO — Acceso local y perfil + modales legibles en oscuro

**Estado:** ✅ Aplicado el 05-oct-2026, a pedido del usuario.

**Acceso** (`src/App.tsx`): el icono Perfil abre modal compartido (móvil y
escritorio). Sin sesión: formulario Nombre + Correo con validación inline;
con sesión: ficha con inicial, nombre, correo, acceso a Configuración y
"Cerrar sesión". Sesión persistida en `iglesiaos-sesion` (este dispositivo),
toast de bienvenida/despedida y saludo de Inicio con el nombre guardado.

**Modales en oscuro** (`src/index.css`): la regla `.dark [class*="bg-white"]`
no excluía `max-w-sm` y volvía translúcidas las 10 tarjetas modales (se leía
el contenido de atrás); ahora las excluye y una regla posterior les da
superficie sólida `#101f29` para que los textos claros se lean. En claro no
cambia nada.

---

## ✅ APLICADO — Módulo Biblia RV1909 + botonera con Biblia

**Estado:** ✅ Aplicado el 05-oct-2026, a pedido del usuario.

**Fuente del texto:** API Midvash (`api.midvash.com`, sin key ni registro, CORS
abierto), versión **Reina-Valera 1909 (dominio público)**. RVR1960 queda fuera a
propósito: tiene copyright de Sociedades Bíblicas Unidas.

**Archivos nuevos:** `src/lib/biblia.ts` (66 libros ES con slugs/capítulos, fetch
de capítulo y versículo del día, caché localStorage de lo último leído y del
votd del día) y `src/Biblia.tsx` (lector libro→capítulo con Anterior/Siguiente
entre libros, tarjeta de versículo del día con "Leer capítulo", atribución
"Reina-Valera 1909 · Dominio público"). Sin internet: muestra lo último leído o
toast honesto (nunca `alert`).

**Navegación** (`src/App.tsx`): `ScreenId` += `"biblia"`; grupo Pastoral del
`menu-vidrio` += Biblia (`auto_stories`); títulos en headers móvil/escritorio;
ramas de render en ambas vistas (`onBack` → Pastoral); **botonera inferior:
`Más` reemplazado por `Biblia` (`auto_stories`) a la izquierda de Finanzas**
(Comunicaciones sigue en el menú hamburguesa); franja devocional en Inicio con
el versículo del día → Biblia; botón "Cambiar" de Bitácora → Biblia.

**Versiones (05-oct-2026, pedido por ortografía 1909):** selector Gómez 2010
(moderna, por defecto) ↔ Reina-Valera 1909 (original) con caché y atribución por
versión; la franja de Inicio respeta la versión elegida. RVG: uso libre sin
fines de lucro, sin alterar palabras, con atribución. Combos propios (no
`<select>` nativo) para que el desplegable se vea igual en todos los
navegadores y temas.

**Verificado:** `lint` + `build` en verde; capturas Edge headless (móvil 390 y
escritorio 1280, en claro) con texto real (votd 2 Timoteo 3:16-17, Juan 3).

---

## ✅ APLICADO — Tema "Dark" por defecto en la primera visita

**Estado:** ✅ Aplicado el 04-oct-2026, a pedido del usuario.

**Pedido:** dejar por defecto primero el tema "Dark".

**Solución aplicada** (los dos puntos donde se resuelve el tema inicial):
- `index.html` (script anti-flash pre-React): añade la clase `dark` salvo que
  localStorage guarde `"light"` explícito; además fija
  `documentElement.style.colorScheme = "dark"` para scrollbars/nativos en
  oscuro.
- `src/useTheme.ts` (`getInitialTheme`): devuelve `"dark"` cuando no hay
  preferencia guardada; se dejó de consultar `prefers-color-scheme`.

**Comportamiento:** primera visita (sin `iglesiaos-theme` en localStorage) →
oscuro. Si el usuario cambia a claro con el toggle, `"light"` queda guardado y
se respeta en recargas (ambos puntos lo verifican).

## ✅ CORREGIDO — Paneles en claro con la transparencia del modo oscuro

**Estado:** ✅ Aplicado el 03-oct-2026, con los valores aportados por el usuario.

**Pedido:** los paneles en oscuro se ven bien (vidrio `#15283430`); en claro
seguían blancos sólidos. Copiar la transparencia a la versión light.

**Solución aplicada** (`src/index.css`, bloque "PANELES EN CLARO", justo antes
del MODO OSCURO):
- Fondo `#ffffff12` + borde `oklch(0.97 0.01 0 / 0)` (valores del usuario, tal
  cual, sin `!important` para que el `!important` nocturno siga ganando en
  oscuro).
- Alcance estrecho a `div`/`section` de panel (nunca global): excluye
  `rounded-full` (pastillas, botones, pulgares de switch), `max-w-sm` (los 4
  modales), `bg-white/…` (velos ya diseñados: hero, ritmo, devocional,
  bottom-nav, modo fondo de Multimedia), `hover:bg-…` (no anular su feedback)
  y `dark:bg-`/`dark:border-` (piezas con fondo oscuro dedicado, p. ej. la
  tarjeta de escritorio `App.tsx:1815`).

## ✅ CORREGIDO — Barrido claro/oscuro: tintes, gradientes-velo y toggles en toda la App

**Estado:** ✅ Aplicado el 02-oct-2026, tras auditar token por token los 18 módulos.

**Síntoma:** además de los paneles degradados ya convertidos, quedaban errores de tema en ambos sentidos:

- *Oscuro*: tintes de Tailwind sin remapeo (aviso rosa `bg-rose-50/70`, círculos
  `bg-emerald-50` de los estados de éxito de Consagración, badge `bg-red-50`
  "EN VIVO" de Multimedia, rampa menta del gráfico de asistencia, chips
  `#daebf5`/`#aacaea`, `bg-slate-200` de carriles y badges, `bg-slate-300` de
  separadores); textos hex sin regla (`text-[#001d32]`, `text-[#002019]`,
  `text-[#43627e]` y el hover `text-[#2c4e45]`) y semánticos (`text-red-600`,
  `text-rose-500`, `text-emerald-600`); el pulgar `bg-white` de los toggles
  desaparecía sobre el carril (remapeo vidrio de `bg-white`); y el velo
  gradiente de la tarjeta de bienvenida (Inicio) quedaba blanco lechoso — es
  `background-image`, así que escapaba al remapeo de `background-color`.
- *Claro*: las pastillas de filtro de Roles (`bg-white/70`) y el chip "Gestión
  Pastoral" (`bg-white/80`) se quedaban sin superficie sobre el panel ya blanco.

**Solución aplicada** (`src/index.css`, bloque MODO OSCURO + ajustes en los módulos):

- Tintes semánticos: `bg-emerald-50` → `#bdeddd33`; `bg-rose-50` y `bg-red-50`
  → `#ffd9de33`; bordes `border-emerald-100` / `border-blue-100` /
  `border-rose-100` → vidrio del mismo tono; textos `text-red-600` →
  `#fca5a5`, `text-rose-500` → `#fda4af`, `text-emerald-600` → `#6ee7b7`.
- Tokens sin remapeo: `#daebf5` y `#aacaea` → `#9bc8f02e` (serie azul); rampa
  menta `#d5e9e1` / `#c0ded3` / `#a8d2c4` / `#7fb3a1` → vidrio menta con alfas
  crecientes (`1f`/`2e`/`3d`/`4d`) para conservar la progresión del gráfico;
  chips `bg-[#386458]/10` y `/5` → menta translúcido; halos `bg-blue-100` →
  `#9bc8f01f`; `bg-slate-200` sólido (con exclusión del hover claro) →
  `#24404f`; `bg-slate-300` → `#2e4756`; bordes `border-slate-50` / `300`
  remapeados.
- Velo de Inicio: `.dark [class*="from-white/50"]` invierte el gradiente a
  vidrio nocturno (única vía posible: es `background-image`).
- Toggles: los 6 interruptores de la App llevan `role="switch"` +
  `aria-checked`, y el pulgar `bg-white` se mantiene claro en oscuro con
  `.dark [role="switch"] [class*="bg-white"] { background-color: #cfe0ea }`.
- Claro: las 7 pastillas de filtro (4 en Roles + 3 en Comunicaciones) pasaron a
  `bg-slate-100 text-slate-600 hover:bg-slate-200` (ese hover también funciona
  en oscuro); el chip "Gestión Pastoral" pasó a `bg-[#386458]/10`, el patrón ya
  usado por "Canal Pastoral".

**Repaso fino (mismo día, tras revisión del usuario):**
- `bg-[#e7f6ff]` pasa a **vidrio** `#1528343b` en sus usos de chip/tarjeta
  (KPI de Células, pills "Este mes"/"Atención" de Pastoral, tarjetas de
  Onboarding/Confirmación, banner de reflexión). El combo campo/botón con
  hover `#e0f0fb` (Eventos, Pastoral) conserva su superficie sólida por su
  regla específica.
- Las dos tarjetas de cabecera con `bg-slate-50` (Onboarding Setup y Check-In
  Niños) pasan a `bg-white`: `bg-slate-50` es token de campos y hovers (su
  remapeo nocturno es sólido) y como superficie de panel no aplicaba.
- "Pilares de Configuración" (Onboarding) en `flex flex-wrap gap-2.5`, con
  tarjetas `flex-1 min-w-[260px]`: en escritorio se acomodan en fila con
  envolvido; en móvil, una por fila a ancho completo.
- "Onboarding" se rotula **"Configuración" / "Configuración Inicial"** (menú,
  cabecera móvil y barra de la pantalla).

**Regla permanente** (`.clinerules` §2): todo tinte semántico nuevo necesita su
remapeo nocturno; los gradientes-velo blancos se remapean por
`background-image`; los interruptores llevan `role="switch"` y pulgar claro en
oscuro.

---

## ✅ CORREGIDO — Paneles con degradado: fuera de estilo y brillantes en oscuro

**Estado:** ✅ Aplicado el 02-oct-2026.

**Síntoma:** quedaban paneles con superficie degradada
(`bg-gradient-to-br from-[#e7f6ff] via-[#e0f0fb] …`) que no habían recibido el
estilo de panel estándar: en claro se veían azulados (llamativos) frente al
resto —blancos— y en oscuro **se quedaban brillantes**, porque el bloque MODO
OSCURO remapea `background-color` por substring y un degradado es
`background-image` (ninguna regla lo toca).

**Solución aplicada** (solo el contenedor; el contenido no se tocó):
- `App.tsx` #88 — cabecera de la pantalla de Roles → `bg-white rounded-xl p-4
  shadow-sm border border-slate-100 flex flex-col justify-between relative
  overflow-hidden` (mismo estilo que los paneles de estadísticas de Pastoral).
- `App.tsx` #344 — tarjeta "Balance Consolidado" (Finanzas) → mismo estilo
  (antes: degradado + `shadow-[0_12px_…]` + `backdrop-blur-xl` a medida).
- `Celulas.tsx` #373 — tarjeta "Guía de Estudio Semanal" → `bg-white` en lugar
  del degradado menta; ya conservaba el resto del estilo estándar.

**Revisados y NO convertidos (a propósito):**
- Banner verde "Próximo Culto" (`Eventos.tsx`) y tarjeta de Reflexión Pastoral
  (`Pastoral.tsx`): son acentos oscuros con texto blanco; volver el panel
  blanco rompería su contenido.
- Scrims sobre foto/vídeo (`bg-gradient-to-t from-slate-900/…` en Sacramentos,
  Pastoral, CultoVivo, Multimedia, Difusión WhatsApp e Inicio) y
  anillos/círculos de icono: no son paneles.

**Detectado en la revisión → RESUELTO el 02-oct-2026:** los tintes semánticos
de Tailwind (`bg-rose-50/70` del aviso devocional, `bg-emerald-50` de los
círculos de éxito de Consagración y `bg-red-50` del badge "EN VIVO") recibieron
su remapeo nocturno a vidrio (`#ffd9de33` / `#bdeddd33`), junto con sus bordes
`border-*-100` y sus textos semánticos. Detalle completo en la sección
"Barrido claro/oscuro" de arriba.

**Ojo (claro) → RESUELTO el 02-oct-2026:** las pastillas de filtro de Roles
pasaron de `bg-white/70` a `bg-slate-100 text-slate-600 hover:bg-slate-200`
(se unificaron también las 3 de Comunicaciones), así que ahora se distinguen
sobre el panel blanco y conservan hover visible en oscuro.

---

## ✅ CORREGIDO — Barras de herramientas: grandes, anchas, desbordaban y con restos en inglés

**Estado:** ✅ Aplicado el 02-oct-2026 en las 7 pantallas con barra: Sacramentos,
Bitácora Pastoral, Censo Miembro, Check-In Niños, Confirmación de Registro,
Difusión WhatsApp y Onboarding Setup.

**Síntoma:** la franja superior se veía grande y **desbordaba** en móviles de
360px: el rótulo iba en mayúsculas con `tracking-wider` y, al otro extremo
(`justify-between`), un segundo botón de cierre (`Cerrar` / `Descartar` /
`Volver`) **repetía la misma acción del ←**, dejando la fila con ~380px de ancho.

**Solución aplicada:**
- Una sola fila compacta: el ← de siempre (`w-9 h-9`, icono a 18px) + rótulo
  sobrio `text-xs text-slate-500`, sin mayúsculas ni tracking y con
  `truncate min-w-0` (nunca vuelve a desbordar).
- Se eliminó el botón de cierre derecho, el borde inferior y el
  `style={{ borderBottomWidth: "0px" }}` que arrastraban 4 archivos.
- Rótulos en español y case normal: "Baptism Request Form" → "Solicitud de
  Bautismo", "Pastoral Visit Log" → "Bitácora de Visitas", "Sesión en curso",
  "Confirmación de registro", "Difusión en curso".
- `src/index.css` (MODO OSCURO): nuevo
  `.dark [class*="hover:bg-slate-200"]:hover { background-color: #24404f }`;
  el remapeo base `!important` de `bg-slate-100` anulaba el hover en nocturno.

**Regla permanente:** `.clinerules` §2 — las barras de sub-pantallas llevan una
sola salida (el ←) y el rótulo en minúsculas de caja, con `truncate`.

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
## ✅ CORREGIDO — El video de nubes tenía un **fade a negro incrustado en el archivo**

**Estado:** ✅ Aplicado el 01-oct-2026.

**Síntoma:** aun con codec y CSS correctos, el fondo de nubes aparecía **negro** al cargar
la pantalla y otra vez negro cada vez que el clip se reiniciaba (el `<video>` lleva `loop`).
Se sospechó de la máscara CSS, del `opacity` y del fondo, pero nada de eso lo explicaba.

**Causa raíz (medida, no supuesta):** el **propio MP4** traía un *fade* de negro al
principio y al final. Se midió la luminancia media por fotograma:

| t (video original) | luminancia YAVG | lectura |
|---|---|---|
| 0,0 s | **16** | negro (fade de entrada) |
| 0,7 s | 28 | `blackdetect` marca negro puro 0→0,7 s |
| 2,0 s | 102 | subiendo |
| 3,6 s | 159 | ya pleno (meseta ~160) |
| 85,2 s | 153 | empieza a caer (fade de salida) |
| 87,0 s | 99 | cayendo |
| 88,3–89,0 s | 0 | `blackdetect` marca negro puro 88,33→88,97 s |

> La **máscara CSS solo usa el canal alfa** (`linear-gradient(... black 154px, transparent 420px)`):
> el color `black` vs `rgb(244, 250, 255)` produce **píxeles idénticos** (comprobado con
> Edge headless + muestreo de píxeles). Ningún cambio de CSS puede quitar un negro que ya
> está grabado dentro del video.

**Cómo se midió (repetible):**
```powershell
$ff = 'C:\Program Files\Replay\resources\bin\ffmpeg.exe'
# 1) Localizar el negro puro
& $ff -hide_banner -i 'public\videos\nubes1.mp4' -vf 'blackdetect=d=0.05:pix_th=0.10' -an -f null NUL 2>&1 |
  Select-String 'black_start'
# 2) Luminancia por fotograma (dónde empieza/termina la rampa)
& $ff -hide_banner -ss 0 -t 6 -i 'public\videos\nubes1.mp4' `
  -vf 'signalstats,metadata=print:key=lavfi.signalstats.YAVG' -an -f null NUL 2>&1
```

**Solución aplicada — recortar el fade, no re-exportar.**
El original (`videos\nubes1.mp4`, mpeg4 + AAC) tiene **el mismo negro**, así que re-exportarlo
tampoco lo quitaba: había que **cortar**. Se recorta de **4,0 s a 85,0 s** (81 s de nubes
limpias) y se re-codifica **desde el original mpeg4** (no desde el H.264 ya convertido, para
no acumular pérdida) con la misma receta de la sección anterior:
```powershell
& 'C:\Program Files\Replay\resources\bin\ffmpeg.exe' -y -ss 4.0 -i 'videos\nubes1.mp4' -t 81.0 `
  -an -c:v libx264 -profile:v main -level 3.1 -pix_fmt yuv420p -crf 26 -preset medium `
  -movflags +faststart 'public\videos\nubes1.mp4'
```
Resultado: **81,0 s**, **1,58 MB** (antes 89 s / 1,81 MB), `h264 (Main) / avc1 / yuv420p / 852x480 / 30 fps`.
Verificación: `blackdetect` **no encuentra ningún segmento negro**; en el inicio (t=0) la
luminancia ya es **159** (antes 16) y al final (t=80,8 s) **153,6** (antes negro).

**Respaldos:** el archivo anterior con fade se guardó como
`videos\nubes1_h264_con-fade-negro.mp4` (no se despliega, `public/` sí se despliega).
El recortado se copió también a `dist\videos\nubes1.mp4` (mismo hash).

**Nota — el `loop` ya no parpadea en negro:** ahora el bucle salta de un fotograma de nubes
al otro sin negro. Si algún día se quiere un empalme más suave, se puede añadir un
*crossfade* al final del clip con `xfade`, pero **no** es necesario para el objetivo.

**Regla para el futuro:** ante "se ve negro/oscuro", **medir el archivo primero**
(`blackdetect` + `signalstats`) antes de tocar CSS. Un *fade* incrustado en el video no se
arregla con estilos.

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

### ✅ APLICADO — Marca heredada "Mindora" → "IOS"

**Estado:** ✅ Aplicado el 05-oct-2026, a pedido del usuario (nombre real: **IOS**).

**Auditoría hecha el 01-oct-2026:** ya **no quedaba** vocabulario de meditación/consciencia
en el código (búsqueda de `meditac`, `mindful`, `conscien`, `concienc`, `self_improvement`,
`respirac`, `bienestar`, `wellness`, `mindset` → **0 resultados**). Lo único que
sobrevivía era el **nombre de marca del tema original ("Mindora")**:

- `src/Sacramentos.tsx:510` → correo `secretaria@comunidadmindora.org` → `secretaria@comunidadios.org`.
- Solo internos (comentarios): `src/App.tsx:211`, `src/Directorio.tsx:209`,
  `src/index.css:94` → `IOS`.
- La guía `Guía_Preparación_Bautismal_Mindora.pdf` ya no se nombra: la descarga es
  toast interim ("Guía de preparación disponible próximamente").

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
