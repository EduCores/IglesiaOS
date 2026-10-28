import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { OnboardingPillar } from "./tipos";
import type { PilarUI } from "../data/onboarding";

export function mapPilarToUI(row: OnboardingPillar): PilarUI {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    icon: row.icon ?? "task_alt",
    status: row.status,
    actionText: row.action_text ?? "Configurar",
  };
}

export function useOnboardingNube(): {
  sincronizado: boolean;
  filas: OnboardingPillar[] | null;
} {
  const nube = useAuth();
  const [filas, setFilas] = useState<OnboardingPillar[] | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setFilas(null);
      return;
    }
    let vivo = true;
    supabase
      .from("onboarding_pillars")
      .select("id, title, subtitle, icon, status, action_text, sort")
      .order("sort", { ascending: true, nullsFirst: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!vivo) return;
        setFilas(!error && data ? (data as OnboardingPillar[]) : null);
      });
    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: filas !== null, filas };
}
