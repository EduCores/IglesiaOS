// ==========================================================================
// useSacramentosNube — pantalla Sacramentos conectada (Lote H, mismo patrón
// piloto). Lee `sacrament_records` (más recientes primero) con sesión cloud;
// sin nube devuelve null y la pantalla usa su lista demo (reemplazo).
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { SacramentRecord } from "./tipos";

export function mapSacramentToUI(row: SacramentRecord) {
  return {
    id: row.id,
    candidateName: row.candidate_name ?? "Candidato sin nombre",
    kind: row.kind,
    performedAt: row.performed_at,
    notes: row.notes ?? "",
    isAnonymous: row.is_anonymous,
  };
}

export function useSacramentosNube(): {
  sincronizado: boolean;
  filas: SacramentRecord[] | null;
} {
  const nube = useAuth();
  const [filas, setFilas] = useState<SacramentRecord[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("sacrament_records")
      .select("id, member_id, candidate_name, kind, performed_at, notes, is_anonymous, created_by, created_at")
      .order("performed_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as SacramentRecord[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
