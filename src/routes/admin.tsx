import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, LogOut, RefreshCw, ShieldCheck, ShoppingBag, Users, WalletCards, Webhook } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { IntegrationsCenter } from "@/components/integrations-center";

type Customer = {
  id: string;
  nome: string | null;
  email: string | null;
  whatsapp: string | null;
  whatsapp_marketing_opt_in: boolean;
  created_at: string;
};

type Order = {
  id: string;
  user_id: string | null;
  status: string;
  amount_cents: number;
  installments: number;
  provider: string | null;
  provider_order_id: string | null;
  created_at: string;
  paid_at: string | null;
  ofertas?: { nome: string; slug: string } | null;
};

type Payment = {
  id: string;
  pedido_id: string;
  provider_payment_id: string | null;
  status: string;
  amount_cents: number;
  raw_status_detail: string | null;
  paid_at: string | null;
  created_at: string;
};

type WebhookEvent = {
  id: string;
  event_id: string;
  event_type: string | null;
  processed_at: string | null;
  created_at: string;
};

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    if (!supabase) {
      setError("Supabase não está configurado.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      await navigate({ to: "/login" });
      return;
    }

    setEmail(auth.user.email ?? "");

    const adminQuery = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (adminQuery.error || !adminQuery.data) {
      setAuthorized(false);
      setError("Acesso administrativo não autorizado.");
      setLoading(false);
      return;
    }

    setAuthorized(true);

    const [customersQuery, ordersQuery, paymentsQuery, webhookQuery] = await Promise.all([
      supabase.from("usuarios").select("id,nome,email,whatsapp,whatsapp_marketing_opt_in,created_at").order("created_at", { ascending: false }),
      supabase.from("pedidos").select("id,user_id,status,amount_cents,installments,provider,provider_order_id,created_at,paid_at,ofertas(nome,slug)").order("created_at", { ascending: false }).limit(200),
      supabase.from("pagamentos").select("id,pedido_id,provider_payment_id,status,amount_cents,raw_status_detail,paid_at,created_at").order("created_at", { ascending: false }).limit(200),
      supabase.from("webhook_events").select("id,event_id,event_type,processed_at,created_at").order("created_at", { ascending: false }).limit(50),
    ]);

    const firstError = customersQuery.error ?? ordersQuery.error ?? paymentsQuery.error ?? webhookQuery.error;
    if (firstError) setError(firstError.message);

    setCustomers((customersQuery.data ?? []) as Customer[]);
    setOrders((ordersQuery.data ?? []) as unknown as Order[]);
    setPayments((paymentsQuery.data ?? []) as Payment[]);
    setWebhooks((webhookQuery.data ?? []) as WebhookEvent[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    await navigate({ to: "/" });
  }

  const metrics = useMemo(() => {
    const paid = orders.filter((o) => o.status === "paid");
    const pending = orders.filter((o) => o.status === "pending");
    const failed = orders.filter((o) => o.status === "failed");
    const revenue = paid.reduce((sum, o) => sum + o.amount_cents, 0);
    return {
      revenue,
      paid: paid.length,
      pending: pending.length,
      failed: failed.length,
      customers: customers.length,
      avgTicket: paid.length ? Math.round(revenue / paid.length) : 0,
    };
  }, [orders, customers.length]);

  const customerById = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers]);

  function exportCsv() {
    const header = ["nome", "email", "whatsapp", "whatsapp_marketing_opt_in", "produto", "valor", "status", "data_compra"];
    const rows = orders.map((order) => {
      const customer = order.user_id ? customerById.get(order.user_id) : undefined;
      return [
        customer?.nome ?? "",
        customer?.email ?? "",
        customer?.whatsapp ?? "",
        customer?.whatsapp_marketing_opt_in ? "sim" : "nao",
        order.ofertas?.nome ?? "",
        (order.amount_cents / 100).toFixed(2).replace(".", ","),
        order.status,
        new Date(order.created_at).toLocaleString("pt-BR"),
      ];
    });
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `neurospectro-clientes-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-muted-foreground">Carregando painel administrativo...</main>;
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <section className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-soft">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Área restrita</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{error || "Sua conta não possui acesso administrativo."}</p>
          <Link to="/dashboard" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Voltar ao dashboard</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 font-sans sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-display text-xl font-semibold text-ink">NeuroSpectro Admin</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-ink"><RefreshCw className="h-4 w-4" /> Atualizar</button>
            <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" /> Exportar CSV</button>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-ink"><LogOut className="h-4 w-4" /> Sair</button>
          </div>
        </header>

        {error && <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric icon={<WalletCards />} label="Faturamento pago" value={formatBRL(metrics.revenue)} />
          <Metric icon={<ShoppingBag />} label="Vendas pagas" value={String(metrics.paid)} />
          <Metric icon={<ShoppingBag />} label="Pendentes" value={String(metrics.pending)} />
          <Metric icon={<Users />} label="Clientes" value={String(metrics.customers)} />
          <Metric icon={<WalletCards />} label="Ticket médio" value={formatBRL(metrics.avgTicket)} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Panel title="Vendas recentes">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead><tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><th className="px-3 py-3">Cliente</th><th className="px-3 py-3">Produto</th><th className="px-3 py-3">Valor</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Data</th></tr></thead>
                <tbody>
                  {orders.slice(0, 30).map((order) => {
                    const customer = order.user_id ? customerById.get(order.user_id) : undefined;
                    return <tr key={order.id} className="border-b border-border/60 last:border-0"><td className="px-3 py-3"><div className="font-medium text-ink">{customer?.nome || "Sem nome"}</div><div className="text-xs text-muted-foreground">{customer?.email || "Sem e-mail"}</div></td><td className="px-3 py-3">{order.ofertas?.nome || "Oferta"}</td><td className="px-3 py-3 font-semibold">{formatBRL(order.amount_cents)}</td><td className="px-3 py-3"><Status status={order.status} /></td><td className="px-3 py-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString("pt-BR")}</td></tr>;
                  })}
                </tbody>
              </table>
              {orders.length === 0 && <p className="p-4 text-sm text-muted-foreground">Nenhuma venda registrada.</p>}
            </div>
          </Panel>

          <Panel title="Status dos pagamentos">
            <div className="space-y-3">
              {payments.slice(0, 12).map((payment) => <div key={payment.id} className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/50 p-3"><div><p className="text-sm font-medium text-ink">{payment.provider_payment_id || payment.id.slice(0, 8)}</p><p className="text-xs text-muted-foreground">{payment.raw_status_detail || "Sem detalhe"}</p></div><div className="text-right"><p className="text-sm font-semibold">{formatBRL(payment.amount_cents)}</p><Status status={payment.status} /></div></div>)}
              {payments.length === 0 && <p className="text-sm text-muted-foreground">Nenhum pagamento registrado.</p>}
            </div>
          </Panel>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Panel title="Clientes / compradores">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead><tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><th className="px-3 py-3">Nome</th><th className="px-3 py-3">E-mail</th><th className="px-3 py-3">WhatsApp</th><th className="px-3 py-3">Marketing</th></tr></thead>
                <tbody>
                  {customers.slice(0, 50).map((customer) => <tr key={customer.id} className="border-b border-border/60 last:border-0"><td className="px-3 py-3 font-medium text-ink">{customer.nome || "Sem nome"}</td><td className="px-3 py-3">{customer.email || "—"}</td><td className="px-3 py-3">{customer.whatsapp || "—"}</td><td className="px-3 py-3">{customer.whatsapp_marketing_opt_in ? "Autorizado" : "Não autorizado"}</td></tr>)}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Webhooks recentes">
            <div className="space-y-3">
              {webhooks.slice(0, 12).map((event) => <div key={event.id} className="flex gap-3 rounded-2xl bg-secondary/50 p-3"><Webhook className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-sm font-medium text-ink">{event.event_type || "Evento"}</p><p className="text-xs text-muted-foreground">{event.event_id} · {event.processed_at ? "processado" : "pendente"}</p></div></div>)}
              {webhooks.length === 0 && <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>}
            </div>
          </Panel>
        </section>

        <IntegrationsCenter />

        <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground"><Link to="/dashboard" className="inline-flex items-center gap-2 hover:text-ink"><ArrowLeft className="h-4 w-4" /> Dashboard do cliente</Link><span>•</span><span>Admin protegido por allowlist no Supabase.</span></div>
      </div>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-3xl border border-border bg-card p-5 shadow-soft"><div className="flex items-center gap-2 text-primary">{icon}<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span></div><p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p></div>;
}

function Status({ status }: { status: string }) {
  const positive = ["paid", "approved", "approved"].includes(status);
  const pending = ["pending", "in_process"].includes(status);
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${positive ? "bg-primary/10 text-primary" : pending ? "bg-secondary text-muted-foreground" : "bg-destructive/10 text-destructive"}`}>{status}</span>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6"><h2 className="font-semibold text-ink">{title}</h2><div className="mt-4">{children}</div></section>;
}

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
