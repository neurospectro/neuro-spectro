import { supabase } from "@/lib/supabase";

export type SecureResultScore = { id: string; label: string; raw: number; max: number };
export type SecureResult = {
  id: string;
  created_at: string;
  total_raw: number;
  max_raw: number;
  scores: SecureResultScore[];
  analysis?: unknown | null;
};

export async function getSecureResult(requiredProductSlug?: string): Promise<SecureResult | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.functions.invoke("process-payment", {
    body: {
      action: "get_result",
      ...(requiredProductSlug ? { requiredProductSlug } : {}),
    },
  });

  if (error) throw error;
  return (data?.result ?? null) as SecureResult | null;
}
