// ==========================================================================
// useRepertorioNube — Eventos conectado: canciones + ensayos (mismo patrón
// piloto). Lee `songs` y `rehearsals` con sesión cloud; sin nube devuelve
// null y la pantalla usa CANCIONES_INICIALES / ENSAYOS_INICIALES (reemplazo).
//
// Ensayos: la confirmación es POR USUARIO (rehearsal_confirmations). Como la
// policy deja ver/marcar solo la propia fila, el select anidado devuelve []
// (sin confirmar) o [propia] (confirmada) y eso ES el estado del toggle.
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { Cancion, EnsayoCompleto } from "./tipos";
import type { CancionUI, EnsayoUI } from "../data/repertorio";

const DIAS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function mapCancionToUI(row: Cancion): CancionUI {
  return {
    id: row.id,
    numberTag: row.number_tag ?? "",
    title: row.title,
    artist: row.artist ?? "", // el guion • separa artista y arreglo
    key: row.musical_key ?? "—",
    bpm: row.bpm ?? 0,
    timeSignature: row.time_signature ?? "",
    comment: row.comment ?? "",
    // Quitamos tildes defensivo (por si la BD trae 'contemporáneo').
    atmosphere: (row.atmosphere ?? "calma").normalize("NFD").replace(/[\u0300-\u036f]/g, "") as CancionUI["atmosphere"],
  };
}

export function mapEnsayoToUI(row: EnsayoCompleto): EnsayoUI {
  const cuando = new Date(row.starts_at);
  const valida = !Number.isNaN(cuando.getTime());
  const hh = valida ? String(cuando.getHours()).padStart(2, "0") : "--";
  const mm = valida ? String(cuando.getMinutes()).padStart(2, "0") : "--";
  return {
    id: row.id,
    dayName: valida ? DIAS_ES[cuando.getDay()] : "—",
    dayNumber: valida ? cuando.getDate() : 0,
    title: row.title,
    time: valida ? `${hh}:${mm}` : "",
    location: row.location ?? "Por definir",
    locationIcon: row.location_icon ?? "event",
    confirmed: (row.rehearsal_confirmations ?? []).length > 0,
  };
}

export function useCancionesNube(): { sincronizado: boolean; filas: Cancion[] | null } {
  const nube = useAuth();
  const [filas, setFilas] = useState<Cancion[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("songs")
      .select("id, number_tag, title, artist, musical_key, bpm, time_signature, comment, atmosphere")
      .order("number_tag", { ascending: true, nullsFirst: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as Cancion[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}

export function useEnsayosNube(): { sincronizado: boolean; filas: EnsayoCompleto[] | null } {
  const nube = useAuth();
  const [filas, setFilas] = useState<EnsayoCompleto[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("rehearsals")
      .select("id, title, starts_at, location, location_icon, rehearsal_confirmations ( user_id )")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(10)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as unknown as EnsayoCompleto[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
