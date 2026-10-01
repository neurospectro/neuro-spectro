import { supabase } from "@/lib/supabase";

export async function linkCheckoutEmail(email: string) {
  if (!supabase || !email) return { error: new Error("E-mail inválido.") };
  return supabase.auth.updateUser({ email });
}
