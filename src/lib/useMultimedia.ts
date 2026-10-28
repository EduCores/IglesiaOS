// ==========================================================================
// useMultimediaNube — pantalla Multimedia conectada (Lote G, mismo patrón
// piloto). Lee `media_channels` y `media_clips` con sesión cloud; sin nube
// devuelve null y la pantalla usa CANALES_INICIALES / CLIPS_INICIALES
// (reemplazo).
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { Canal, Clip } from "./tipos";
import type { CanalUI, ClipUI } from "../data/multimedia";

export function mapCanalToUI(row: Canal): CanalUI {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    icon: row.icon ?? "cast",
    bgColor: row.bg_color ?? "bg-[#bdeddd]",
    iconColor: row.icon_color ?? "text-[#214e43]",
    active: row.is_active,
  };
}

export function mapClipToUI(row: Clip): ClipUI {
  return {
    id: row.id,
    title: row.title,
    meta: row.meta_label ?? "",
    badge: row.badge ?? "HD",
    thumbnail: row.thumbnail_url ?? "",
    src: row.src_url ?? "",
  };
}

export function useCanalesNube(): {
  sincronizado: boolean;
  filas: Canal[] | null;
} {
  const nube = useAuth();
  const [filas, setFilas] = useState<Canal[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("media_channels")
      .select("id, name, description, icon, bg_color, icon_color, is_active, sort")
      .order("sort", { ascending: true, nullsFirst: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as Canal[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}

export function useClipsNube(): {
  sincronizado: boolean;
  filas: Clip[] | null;
} {
  const nube = useAuth();
  const [filas, setFilas] = useState<Clip[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("media_clips")
      .select("id, title, meta_label, badge, thumbnail_url, src_url, is_active, sort")
      .order("sort", { ascending: true, nullsFirst: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as Clip[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
