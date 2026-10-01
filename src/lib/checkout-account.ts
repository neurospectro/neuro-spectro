import { supabase } from "@/lib/supabase";

export async function linkCheckoutEmail(email: string) {
  if (!supabase || !email.trim()) {
    return { error: new Error("E-mail inválido.") };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) {
    return { error: new Error("Sessão de compra não encontrada.") };
  }

  if (!user.is_anonymous) {
    return { data: { user }, error: null };
  }

  return supabase.auth.updateUser(
    { email: email.trim() },
    { emailRedirectTo: `${window.location.origin}/dashboard` },
  );
}
