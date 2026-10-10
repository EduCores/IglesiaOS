// ==========================================================================
// useCelulasNube — Células conectadas (mismo patrón piloto).
// Lee `cells` con sesión cloud; sin nube devuelve null y la pantalla usa
// CELULAS_INICIALES (reemplazo, igual que Roles/Miembros).
// Mapeo: `zone` de la BD es la clave (norte/centro/sur/jovenes/matrimonios);
// el resto del estilo se deriva igual que "Crear Nueva Célula". Solo se
// listan activas (no hay switch visual para inactivas en esta pantalla).
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { Celula } from "./tipos";
import type { CelulaUI } from "../data/celulas";

type Categoria = CelulaUI["category"];

function esCategoria(z: string | null): z is Categoria {
  return z === "norte" || z === "centro" || z === "sur" || z === "jovenes" || z === "matrimonios";
}

function zonaBonita(cat: Categoria): string {
  if (cat === "norte") return "Zona Norte";
  if (cat === "centro") return "Zona Centro";
  if (cat === "sur") return "Zona Sur";
  if (cat === "jovenes") return "Zona Campus";
  return "Zona Oriente";
}

export function mapCelulaToUI(row: Celula): CelulaUI {
  const cat: Categoria = esCategoria(row.zone) ? row.zone : "norte";
  const type = cat === "jovenes" ? "Jóvenes Univ." : cat === "matrimonios" ? "Matrimonios" : "Familiar";
  const badge = cat === "jovenes"
    ? "bg-[#bddefe] text-[#43627e]"
    : cat === "matrimonios"
      ? "bg-[#ffd9de] text-[#663a42]"
      : "bg-[#bdeddd] text-[#214e43]";
  const timeAndPlace = [row.schedule, row.place].filter(Boolean).join(" · ") || "Horario por definir";
  return {
    id: row.id,
    name: row.name,
    zone: zonaBonita(cat),
    type,
    category: cat,
    leaders: row.leader_name ?? "Por asignar",
    timeAndPlace,
    icon: cat === "jovenes" ? "school" : cat === "matrimonios" ? "favorite" : "church",
    badgeBg: badge,
    badgeText: cat === "norte" ? "Zona Norte" : cat === "centro" ? "Zona Centro" : cat === "sur" ? "Zona Sur" : type,
    capacity: row.capacity ?? undefined,
    connectedCountText: row.capacity != null ? `${row.capacity} cupos` : "Célula registrada",
  };
}

export function useCelulasNube(): { sincronizado: boolean; filas: Celula[] | null } {
  const nube = useAuth();
  const [filas, setFilas] = useState<Celula[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("cells")
      .select("id, name, zone, leader_name, schedule, place, capacity, is_active")
      .eq("is_active", true)
      .order("name")
      .limit(100)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as Celula[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
