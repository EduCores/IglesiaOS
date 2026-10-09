// ==========================================================================
// Cliente de Supabase (PostgreSQL + Auth + RLS).
//
// ⚠️ IMPORTANTE — la app DEBE seguir funcionando SIN estas variables.
// Este módulo no lanza error si falta la configuración: exporta
// `supabase = null` y `isSupabaseReady = false`, para que los datos
// hardcodeados actuales sigan mostrando la app mientras la base de datos
// se conecta pantalla por pantalla. No borres los datos mock todavia.
//
// CÓMO CONFIGURAR (Supabase -> Project Settings -> API):
//   1) Crear archivo `.env` (NO se sube; ver .env.example):
//        VITE_SUPABASE_URL=https://<ref>.supabase.co
//        VITE_SUPABASE_ANON_KEY=<anon public key>
//   2) La anon key SÍ se publica en el bundle (es pública por diseño).
//      La seguridad real la dan las políticas RLS de schema.sql, NO la key.
//      NUNCA pongas la service_role key en el frontend: esa key ignora RLS.
//
// Variables con prefijo VITE_ son las únicas que Vite expone al cliente.
// ==========================================================================
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Configurado = hay URL + anon key válidas en el entorno. */
export const isSupabaseReady = Boolean(url && anonKey);

/**
 * Cliente null cuando no hay configuración. Consumir siempre con el guard:
 *
 *   if (!supabase) return null;
 *   const { data, error } = await supabase.from("members").select("*");
 */
export const supabase: SupabaseClient | null =
  isSupabaseReady && url && anonKey ? createClient(url, anonKey) : null;