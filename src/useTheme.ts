import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "iglesiaos-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* localStorage no disponible: se usa el valor por defecto */
  }
  return "dark";
}

/**
 * Tema claro/oscuro global.
 * - Aplica la clase `dark` en <html> (estrategia por clase, ver `@custom-variant dark` en index.css).
 * - Persiste en localStorage ("iglesiaos-theme").
 * - Por defecto es "dark"; el "light" del usuario se respeta al recargar.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* almacenamiento no disponible: el tema solo vive en memoria */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme, isDark: theme === "dark" };
}

export type TemaColor = "eucalipto" | "zafiro" | "terracota";

export const TEMAS_COLOR: { id: TemaColor; nombre: string; punto: string }[] = [
  { id: "eucalipto", nombre: "Eucalipto", punto: "#386458" },
  { id: "zafiro", nombre: "Zafiro", punto: "#1a4b84" },
  { id: "terracota", nombre: "Terracota", punto: "#C25E2E" },
];

const TEMA_COLOR_KEY = "iglesiaos-tema-color";

function getInitialTemaColor(): TemaColor {
  if (typeof window === "undefined") return "eucalipto";
  try {
    const saved = window.localStorage.getItem(TEMA_COLOR_KEY);
    if (saved === "zafiro" || saved === "terracota" || saved === "eucalipto") return saved;
  } catch {
    /* localStorage no disponible: se usa el valor por defecto */
  }
  return "eucalipto";
}

/**
 * Color de marca global (Eucalipto = CSS base, Zafiro/Terracota = overrides
 * en src/temas-color.css).
 * - Aplica `data-tema` en <html> (los overrides cuelgan de html[data-tema]).
 * - Persiste en localStorage ("iglesiaos-tema-color").
 * - Independiente del modo claro/oscuro: cada tema trae versión light y dark.
 */
export function useTemaColor() {
  const [temaColor, setTemaColor] = useState<TemaColor>(getInitialTemaColor);

  useEffect(() => {
    try {
      document.documentElement.dataset.tema = temaColor;
    } catch {
      /* DOM no disponible */
    }
    try {
      window.localStorage.setItem(TEMA_COLOR_KEY, temaColor);
    } catch {
      /* almacenamiento no disponible: el tema solo vive en memoria */
    }
  }, [temaColor]);

  const cambiarTemaColor = useCallback((t: TemaColor) => {
    setTemaColor(t);
  }, []);

  return { temaColor, cambiarTemaColor };
}
