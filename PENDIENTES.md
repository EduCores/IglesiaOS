# Pendientes — IglesiaOS

> Registro de cambios acordados para el futuro próximo, ordenados por prioridad.

---

## 🔴 MUY IMPORTANTE — Detección automática de vista (móvil / escritorio)

**Estado:** Pendiente — acordado en octubre de 2026, se aplicará en el futuro próximo.
**Archivo a modificar:** `src/App.tsx` (línea ~1055, definición de `viewMode`).

### Problema
Hoy la vista inicial siempre es `"mobile"`:

```tsx
const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
```

El usuario debe descubrir y pulsar el toggle manual "Móvil / Escritorio" de la barra
superior. En un producto real, el layout debe adaptarse solo al dispositivo:

- Celular → vista **Móvil** (tab bar, marco de app).
- Notebook / desktop → vista **Escritorio** (header administrativo, grids amplios).

### Solución acordada
- Detectar el ancho de pantalla **al cargar**:
  - `< 768px` → `"mobile"`
  - `>= 768px` → `"desktop"`
  - Con `window.matchMedia("(max-width: 767px)")`.
- **Mantener el toggle manual** como override (sigue siendo útil para demos y presentaciones).
- Costo estimado: **~10 líneas**, cero peso adicional en el bundle.

### Criterio de aceptación
- [ ] En un notebook (≥768px) la app abre en vista Escritorio por defecto.
- [ ] En un celular (<768px) la app abre en vista Móvil por defecto.
- [ ] El toggle manual sigue funcionando y puede sobreescribir la detección.
- [ ] `npm run lint` y `npm run build` en verde; verificar el CSS/JS en producción.

### Por qué es MUY IMPORTANTE
La estrategia de IglesiaOS es web responsive para ambos mundos: móvil para líderes en
terreno (asistencia, culto en vivo, difusión) y escritorio para secretaría/tesorería
(finanzas, censo, informes). Sin la detección automática, un usuario de notebook ve el
simulador de teléfono hasta que descubre el toggle — fricción innecesaria en producción.

---

## 💡 Propuestas menores (identificadas, no acordadas aún)

1. **PWA (Progressive Web App):** manifest + service worker para que el sitio sea
   instalable en Android/iOS ("Añadir a pantalla de inicio"), con ícono propio y
   funcionamiento offline. Peso adicional: unos pocos KB.
2. **Uso de `lottie-react` y `react-player`** (ya instalados el 01-oct-2026):
   importarlas con carga diferida (`React.lazy` / `import()` dinámico) en las pantallas
   que las usen, para no inflar la carga inicial.
