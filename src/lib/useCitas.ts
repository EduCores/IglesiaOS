// ==========================================================================
// useCitasNube — Pastoral (citas) conectada (mismo patrón piloto).
// Lee `pastoral_appointments` con sesión cloud; sin nube devuelve null y la
// pantalla usa sus citas iniciales (reemplazo). El formulario "Programar
// Nueva Cita" inserta (RLS exige ver_todos_pastoral o ver_directorio; si lo
// niega, toast honesto y la cita queda local).
// Las etiquetas de fecha/hora son texto libre ("Mañana"/"10:00 AM"), igual
// que cells.schedule — espejo del formulario de la pantalla.
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { CitaPastoral } from "./tipos";

export interface CitaUI {
  id: string;
  initials: string;
  name: string;
  type: string;
  status: string; // "Programado" | "Confirmado"
  date: string;
  time: string;
  location: string;
  icon: string;
}

export function inicialesDe(nombre: string): string {
  const letras = nombre
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  return letras || "AP";
}

export function mapCitaToUI(row: CitaPastoral): CitaUI {
  const status = row.status === "confirmado" ? "Confirmado" : "Programado";
  return {
    id: row.id,
    initials: inicialesDe(row.person_name),
    name: row.person_name,
    type: row.purpose ?? "Consejería espiritual",
    status,
    date: row.date_label ?? "Por agendar",
    time: row.time_label ?? "",
    location: row.location ?? "Presencial",
    icon: (row.location ?? "Presencial") === "Hogar" ? "home" : "calendar_month",
  };
}

export function useCitasNube(): { sincronizado: boolean; filas: CitaPastoral[] | null } {
  const nube = useAuth();
  const [filas, setFilas] = useState<CitaPastoral[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("pastoral_appointments")
      .select("id, member_id, person_name, purpose, status, date_label, time_label, location, author_id")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as unknown as CitaPastoral[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
