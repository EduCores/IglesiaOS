// ==========================================================================
// useMiembrosNube — Directorio + Censo conectados (mismo patrón piloto).
// Lee `members` desde Supabase con sesión cloud; sin nube devuelve null y
// las pantallas usan MIEMBROS_INICIALES. Fuente única (reemplazo, igual que
// Roles): con nube NO se muestran los datos de ejemplo.
//
// Privacidad: el SELECT pide solo columnas de directorio (sin RUT ni fecha
// de nacimiento); RLS exige `ver_directorio`, escritura `gestionar_roles`.
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { Miembro } from "./tipos";
import { AVATAR_POR_DEFECTO, type MiembroUI } from "../data/miembros";

export function mapMiembroToUI(row: Miembro): MiembroUI {
  const fams = row.is_family_head;
  return {
    id: row.id,
    name: row.full_name,
    role: [row.spiritual_stage, row.phone].filter(Boolean).join(" • ") || "Miembro",
    type: fams ? "familias" : "nuevos",
    tag: fams ? "Familia" : (row.spiritual_stage ?? "Nuevo Miembro"),
    badgeColor: fams ? "bg-[#bdeddd] text-[#214e43]" : "bg-[#cde5ff] text-[#294964]",
    img: row.photo_url ?? AVATAR_POR_DEFECTO,
    subtitle: row.address ?? "",
    noteIcon: row.notes ? "volunteer_activism" : undefined,
    noteText: row.notes ?? undefined,
    footerText: row.phone ?? "Sin contacto registrado",
    footerIcon: row.phone ? "call" : undefined,
    primaryBtnText: "WhatsApp",
    secondaryBtnIcon: "call",
  };
}

/** "12/05/1990" (texto libre del formulario) -> "1990-05-12" o null. */
export function parseFechaDMY(s: string): string | null {
  const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const d = Number(m[1]);
  const mes = Number(m[2]);
  const y = Number(m[3]);
  if (d < 1 || d > 31 || mes < 1 || mes > 12 || y < 1900 || y > 2100) return null;
  const iso = `${y}-${String(mes).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return Number.isNaN(new Date(iso).getTime()) ? null : iso;
}

export function useMiembrosNube(): { sincronizado: boolean; filas: Miembro[] | null } {
  const nube = useAuth();
  const [filas, setFilas] = useState<Miembro[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("members")
      .select("id, full_name, phone, email, address, photo_url, spiritual_stage, is_family_head, notes")
      .order("full_name")
      .limit(100)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as Miembro[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
