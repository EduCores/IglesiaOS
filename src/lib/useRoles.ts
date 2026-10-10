// ==========================================================================
// useRolesNube — Fase 4 (piloto). Lee los roles desde Supabase cuando hay
// sesión en la nube; si no, devuelve null y la pantalla usa ROLES_INICIALES.
//
// Merge (mapRowToUI): por `title` con la lista local para conservar el
// estilo exacto (badge/icon/detail/members) de los 17 roles sembrados;
// los roles creados solo en la nube reciben estilo por `type` (el mismo
// que usa "Crear Nuevo Rol"). `checked` siempre viene de la BD.
// Escrituras: optimistas en local + intento en la nube; si RLS lo niega,
// toast honesto y el cambio queda solo local (nunca se revierte a ciegas).
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import { ROLES_INICIALES, type RolLocal } from "../data/roles";
import type { Rol } from "./tipos";

export interface RolUI {
  id: number | string;
  title: string;
  tag: string;
  type: "liderazgo" | "ministerios" | "apoyo";
  desc: string;
  badgeColor: string;
  checked: boolean;
  icon: string;
  bgIconColor: string;
  iconColor: string;
  detailText: string;
  members: number;
}

type Local = RolLocal;

function estiloPorTipo(type: Local["type"]): Pick<RolUI, "badgeColor" | "icon" | "bgIconColor" | "iconColor"> {
  if (type === "liderazgo")
    return { badgeColor: "bg-[#386458]/10 text-[#386458]", icon: "admin_panel_settings", bgIconColor: "bg-[#bdeddd]", iconColor: "text-[#386458]" };
  if (type === "ministerios")
    return { badgeColor: "bg-[#cde5ff] text-[#294964]", icon: "palette", bgIconColor: "bg-[#cde5ff]", iconColor: "text-[#42617d]" };
  return { badgeColor: "bg-slate-200 text-slate-700", icon: "support_agent", bgIconColor: "bg-slate-100", iconColor: "text-slate-600" };
}

export function mapRowToUI(row: Rol, locales: readonly Local[] = ROLES_INICIALES): RolUI {
  const local = locales.find((r) => r.title === row.title);
  const est = estiloPorTipo(row.type as Local["type"]);
  return {
    id: row.id,
    title: row.title,
    tag: row.tag ?? row.type.charAt(0).toUpperCase() + row.type.slice(1),
    type: row.type as Local["type"],
    desc: row.description ?? local?.desc ?? "",
    badgeColor: local?.badgeColor ?? est.badgeColor,
    checked: row.is_active,
    icon: row.icon ?? local?.icon ?? est.icon,
    bgIconColor: local?.bgIconColor ?? est.bgIconColor,
    iconColor: local?.iconColor ?? est.iconColor,
    detailText: local?.detailText ?? "Rol de la congregación",
    members: local?.members ?? 0,
  };
}

export function useRolesNube(): { sincronizado: boolean; filas: Rol[] | null } {
  const nube = useAuth();
  const [filas, setFilas] = useState<Rol[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("roles")
      .select("id, title, tag, type, description, icon, is_active")
      .order("title")
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as Rol[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
