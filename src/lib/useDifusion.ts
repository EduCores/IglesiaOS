// ==========================================================================
// useDifusionNube — Comunicaciones + Difusión conectadas (mismo patrón).
// Lee `broadcasts` con sesión cloud; sin nube devuelve null y las pantallas
// usan sus datos iniciales (reemplazo). Escrituras (requieren
// `gestionar_roles`): Difusión confirma envío, Comunicaciones envía el
// mensaje rápido; ambas guardan {title, channel, body, status, sent_at}.
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { Difusion } from "./tipos";
import { fechaCorta } from "./useTransacciones";
import type { ComunicacionUI } from "../data/comunicaciones";

function etiquetaCanal(channel: string): string {
  const c = channel.toLowerCase();
  if (c === "whatsapp") return "WhatsApp";
  if (c === "email") return "Email";
  if (c === "boletin") return "Boletín";
  return channel.charAt(0).toUpperCase() + channel.slice(1);
}

function etiquetaEstado(status: Difusion["status"]): string {
  if (status === "enviado") return "Enviado";
  if (status === "programado") return "Programado";
  return "Borrador";
}

export function mapDifusionToUI(row: Difusion): ComunicacionUI {
  const estado = etiquetaEstado(row.status);
  const estilo =
    estado === "Enviado"
      ? { badgeColor: "bg-[#bdeddd] text-[#214e43]", dotColor: "bg-[#386458]", bgIconColor: "bg-[#bdeddd]/45", textColor: "text-[#386458]" }
      : estado === "Programado"
        ? { badgeColor: "bg-[#cde5ff] text-[#294964]", dotColor: "bg-[#42617d]", bgIconColor: "bg-[#cde5ff]/60", textColor: "text-[#42617d]" }
        : { badgeColor: "bg-[#ffd9de] text-[#663a42]", dotColor: "bg-[#7f4e57]", bgIconColor: "bg-[#ffd9de]/80", textColor: "text-[#7f4e57]" };
  const icon =
    estado === "Borrador" ? "draft" : estado === "Programado" ? "upcoming"
    : row.channel.toLowerCase() === "whatsapp" ? "mark_chat_read" : "notifications_active";
  const fecha = row.sent_at ?? row.scheduled_at;
  return {
    id: row.id,
    title: row.title,
    channel: `${etiquetaCanal(row.channel)}${row.recipients != null ? ` • ${row.recipients.toLocaleString("es-CL")} contactos` : ""}`,
    date: fecha ? fechaCorta(fecha) : "",
    status: estado,
    ...estilo,
    icon,
  };
}

export function useDifusionNube(): { sincronizado: boolean; filas: Difusion[] | null } {
  const nube = useAuth();
  const [filas, setFilas] = useState<Difusion[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("broadcasts")
      .select("id, title, channel, body, status, scheduled_at, sent_at, recipients, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as unknown as Difusion[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
