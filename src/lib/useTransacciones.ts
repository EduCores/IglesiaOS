// ==========================================================================
// useTransaccionesNube — Finanzas conectadas (mismo patrón que useRolesNube).
// Lee `transactions` desde Supabase cuando hay sesión en la nube; si no,
// devuelve null y la pantalla usa TRANSACCIONES_INICIALES.
//
// Mapeo fila -> UI: el estilo (badge/icono/colores) se deriva de `kind` +
// `category` con los mismos tokens que los datos locales, así lo que venga
// de la BD se ve idéntico a lo hardcodeado. `id` puede ser uuid (nube) o
// entero (local); la fecha se formatea como el resto ("Ayer, 18:30").
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { Transaccion } from "./tipos";
import type { TransaccionLocal } from "../data/transacciones";

export interface TransaccionUI extends Omit<TransaccionLocal, "id"> {
  id: number | string;
}

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/** "2026-10-10T18:30" -> "Hoy, 18:30" / "Ayer, 18:30" / "10 Oct, 18:30". */
export function fechaCorta(iso: string): string {
  const f = new Date(iso);
  if (Number.isNaN(f.getTime())) return "";
  const hora = f.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  const dia = new Date(f.getFullYear(), f.getMonth(), f.getDate());
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const diff = Math.round((hoy.getTime() - dia.getTime()) / 86400000);
  if (diff <= 0) return `Hoy, ${hora}`;
  if (diff === 1) return `Ayer, ${hora}`;
  return `${f.getDate()} ${MESES[f.getMonth()]}, ${hora}`;
}

function iconoGasto(team: string | null): string {
  if (team === "Aseo") return "cleaning_services";
  if (team === "Cocina") return "soup_kitchen";
  if (team === "Puerta") return "door_open";
  return "water_drop";
}

export function mapTxToUI(row: Transaccion): TransaccionUI {
  if (row.kind === "gasto") {
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      amount: Number(row.amount),
      type: "minus",
      date: fechaCorta(row.occurred_at),
      badgeText: "Gasto",
      badgeColor: "bg-[#ffd9de] text-[#663a42]",
      textColor: "text-[#7f4e57]",
      bgIconColor: "bg-[#ffd9de]",
      icon: iconoGasto(row.team),
    };
  }
  const esMisiones = row.category === "misiones";
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    amount: Number(row.amount),
    type: "plus",
    date: fechaCorta(row.occurred_at),
    badgeText: row.kind === "diezmo" ? "Diezmo" : "Ofrenda",
    badgeColor: esMisiones ? "bg-[#cde5ff] text-[#294964]" : "bg-[#bdeddd] text-[#214e43]",
    textColor: esMisiones ? "text-[#42617d]" : "text-[#386458]",
    bgIconColor: esMisiones ? "bg-[#cde5ff]/50" : "bg-[#bdeddd]/60",
    icon: esMisiones ? "public" : row.kind === "diezmo" ? "volunteer_activism" : "diversity_1",
  };
}

export function useTransaccionesNube(): { sincronizado: boolean; filas: Transaccion[] | null } {
  const nube = useAuth();
  const [filas, setFilas] = useState<Transaccion[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("transactions")
      .select("id, title, amount, kind, category, team, occurred_at, member_id, note")
      .order("occurred_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as Transaccion[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
