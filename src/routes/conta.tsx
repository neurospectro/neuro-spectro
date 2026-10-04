import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/conta")({
  head: () => ({ meta: [{ title: "Minha conta — NeuroSpectro" }, { name: "robots", content: "noindex,nofollow,noarchive" }] }),
  component: Conta,
});

function Conta() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    })();
  }, []);

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f9fb", padding: "24px 16px", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", color: "#172033" }}>
      <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#526174", textDecoration: "none", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
          <ArrowLeft size={17} /> Voltar
        </Link>

        <section style={{ background: "#fff", border: "1px solid #dce5eb", borderRadius: 24, overflow: "hidden", boxShadow: "0 16px 50px rgba(22,50,70,.07)" }}>
          <header style={{ background: "linear-gradient(135deg, #003b5c, #008b78)", color: "#fff", padding: "28px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,.14)", flex: "0 0 auto" }}>
                <UserCircle2 size={25} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ margin: 0, fontSize: 25, lineHeight: 1.2, fontWeight: 700 }}>Minha conta</h1>
                {email && <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,.76)", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</p>}
              </div>
            </div>
          </header>

          <div style={{ padding: 20 }}>
            <p style={{ margin: "0 0 18px", color: "#526174", fontSize: 14, textAlign: "center" }}>
              Você já está conectado.
            </p>

            <Link
              to="/login"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 14, background: "#00769f", color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 700 }}
            >
              Ir para o login
            </Link>

            <button type="button" onClick={() => void logout()} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", boxSizing: "border-box", marginTop: 12, padding: "13px 16px", border: 0, borderRadius: 14, background: "#fef5f5", color: "#a44b4b", font: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              <LogOut size={17} /> Sair da conta
            </button>

            <Link to="/" style={{ display: "block", marginTop: 16, color: "#68788a", textDecoration: "none", textAlign: "center", fontSize: 13 }}>
              Voltar ao início
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
