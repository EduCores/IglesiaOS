// ==========================================================================
// Tipos del dominio IglesiaOS — espejo de supabase/schema.sql.
// Se usan al leer/escribir para no trabajar con `any`. Si generas tipos
// automaticos de la base (Supabase CLI -> `supabase gen types`), reemplaza
// este archivo por los generados y borra el resto.
// ==========================================================================

/** Roles: los mismos 9 de la pantalla Roles (App.tsx ROLES_INICIALES). */
export type RolType = "liderazgo" | "ministerios" | "apoyo";

export interface Rol {
  id: string;
  title: string;
  tag: string | null;
  type: RolType;
  description: string | null;
  icon: string | null;
  is_active: boolean;
}

/** Claves de permiso: deben coincidir con role_permissions.permission. */
export type Permiso =
  | "gestionar_roles"
  | "registrar_ofrendas"
  | "solicitar_gastos"
  | "ver_finanzas"
  | "ver_directorio"
  | "ver_todos_pastoral"
  | "checkin_ninos";

export interface RolPermiso {
  id: string;
  rol_id: string;
  permission: Permiso;
  allowed: boolean;
}

/** Perfil = usuario logueado (espejo de la sesión local actual). */
export interface Perfil {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  rol_id: string | null;
  congregation: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Miembros (Censo de Miembro + Directorio). */
export interface Miembro {
  id: string;
  full_name: string;
  doc_id: string | null;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  photo_url: string | null;
  spiritual_stage: string | null;
  is_family_head: boolean;
  family_members: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Celula {
  id: string;
  name: string;
  zone: string | null;
  leader_name: string | null;
  schedule: string | null;
  place: string | null;
  capacity: number | null;
  is_active: boolean;
}

/** Finanzas: `kind` separa ingresos de gastos (el signo sale de `kind`). */
export interface Transaccion {
  id: string;
  title: string;
  amount: number;
  kind: "oferta" | "diezmo" | "gasto";
  category: "ministerios" | "misiones" | "operaciones";
  team: string | null;
  occurred_at: string;
  member_id: string | null;
  note: string | null;
}

/** ⚠️ Contenido confidencial: la RLS filtra según `privacy`. */
export interface BitacoraPastoral {
  id: string;
  member_id: string | null;
  author_id: string | null;
  connection_place: string | null;
  duration_minutes: number | null;
  visited_at: string;
  mood: string | null;
  privacy: "solo_pastor" | "equipo";
  note: string | null;
  next_follow_up: string | null;
}

export interface MotivoOracion {
  id: string;
  log_id: string;
  petition: string;
  is_shared: boolean;
}

export interface RegistroSacramento {
  id: string;
  member_id: string | null;
  kind: "bautismo" | "confirmacion" | "presentacion" | "matrimonio" | "comunion" | "mayordomia";
  performed_at: string;
  notes: string | null;
  is_anonymous: boolean;
}

export interface Evento {
  id: string;
  title: string;
  kind: "culto" | "actividad" | "jovenes" | "retiro";
  atmosphere: string | null;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  place: string | null;
}

/** ⚠️ Contiene datos de SALUD de menores: RLS estricta. */
export interface CheckinNino {
  id: string;
  event_id: string;
  full_name: string;
  guardian_name: string | null;
  doc_id: string | null;
  health_notes: string | null;
  checked_in_at: string;
  checked_out_at: string | null;
}

export interface Difusion {
  id: string;
  title: string;
  channel: string;
  body: string;
  status: "borrador" | "programado" | "enviado";
  scheduled_at: string | null;
  sent_at: string | null;
  recipients: number | null;
}