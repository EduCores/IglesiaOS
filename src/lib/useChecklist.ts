// ==========================================================================
// useChecklistNube — CultoVivo (Checklist Pre-Culto) conectado (patrón piloto).
// Lee `worship_checklist` con sesión cloud; sin nube devuelve null y la
// pantalla usa sus ítems iniciales (reemplazo). El toggle escribe en nube:
// requiere `gestionar_roles`; si RLS lo niega la pantalla avisa con toast
// honesto y el cambio queda local (igual que Roles/Células).
// El checklist es GLOBAL: un ítem marcado lo ve todo el equipo.
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { ItemChecklistCulto } from "./tipos";

/** Fila y su confirmación del usuario autenticado (0 o 1 al mapear). */
export function mapChecklistToUI(row: ItemChecklistCulto) {
  return {
    id: row.id,
    text: row.item_text,
    checked: row.is_checked,
  };
}

export function useChecklistNube(): { sincronizado: boolean; filas: ItemChecklistCulto[] | null } {
  const nube = useAuth();
  const [filas, setFilas] = useState<ItemChecklistCulto[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("worship_checklist")
      .select("id, event_id, item_text, is_checked, checked_by, checked_at")
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as unknown as ItemChecklistCulto[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
