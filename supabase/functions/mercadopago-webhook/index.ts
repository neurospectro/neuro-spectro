import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function verifySignature(req: Request, dataId: string) {
  const secret = Deno.env.get("MERCADOPAGO_WEBHOOK_SECRET");
  if (!secret) return false;

  const signature = req.headers.get("x-signature") ?? "";
  const requestId = req.headers.get("x-request-id") ?? "";
  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, rest.join("=")];
    }).filter(([key]) => key),
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1 || !requestId || !dataId) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = await hmacHex(secret, manifest);
  return constantTimeEqual(expected, v1);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: true });

  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id") ?? "";
  const valid = await verifySignature(req, dataId);
  if (!valid) return json({ error: "Assinatura inválida." }, 401);

  const body = await req.json().catch(() => ({}));
  const eventId = String(body?.id ?? `${body?.type ?? "order"}:${dataId}`);
  const eventType = String(body?.type ?? "order");

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const mpToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN")!;
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: existing } = await admin
    .from("webhook_events")
    .select("id,processed_at")
    .eq("provider", "mercadopago")
    .eq("event_id", eventId)
    .maybeSingle();

  if (existing?.processed_at) return json({ ok: true, duplicate: true });

  await admin.from("webhook_events").upsert({
    provider: "mercadopago",
    event_id: eventId,
    event_type: eventType,
    payload: body,
  }, { onConflict: "provider,event_id" });

  if (eventType !== "order" || !dataId) {
    await admin.from("webhook_events").update({ processed_at: new Date().toISOString() }).eq("provider", "mercadopago").eq("event_id", eventId);
    return json({ ok: true });
  }

  const orderResponse = await fetch(`https://api.mercadopago.com/v1/orders/${encodeURIComponent(dataId)}`, {
    headers: { Authorization: `Bearer ${mpToken}` },
  });
  if (!orderResponse.ok) return json({ error: "Não foi possível consultar a order." }, 502);

  const order = await orderResponse.json();
  const externalReference = String(order?.external_reference ?? "");
  if (!externalReference.startsWith("ns_")) {
    await admin.from("webhook_events").update({ processed_at: new Date().toISOString() }).eq("provider", "mercadopago").eq("event_id", eventId);
    return json({ ok: true });
  }

  const pedidoId = externalReference.slice(3);
  const { data: pedido } = await admin
    .from("pedidos")
    .select("id,user_id,oferta_id,amount_cents,ofertas(produto_id,slug,access_days,auto_renew)")
    .eq("id", pedidoId)
    .maybeSingle();

  if (!pedido) return json({ error: "Pedido não encontrado." }, 404);

  const payment = order?.transactions?.payments?.[0];
  const status = payment?.status ?? order?.status ?? "pending";
  const statusDetail = payment?.status_detail ?? order?.status_detail ?? null;
  const paid = status === "processed" || status === "approved";
  const failed = ["rejected", "failed", "cancelled"].includes(status);

  await admin.from("pedidos").update({
    provider_order_id: order.id,
    status: paid ? "paid" : failed ? "failed" : "pending",
    paid_at: paid ? new Date().toISOString() : null,
  }).eq("id", pedido.id);

  if (payment?.id) {
    await admin.from("pagamentos").upsert({
      pedido_id: pedido.id,
      provider: "mercadopago",
      provider_payment_id: payment.id,
      status,
      amount_cents: pedido.amount_cents,
      installment_number: payment?.payment_method?.installments ?? null,
      raw_status_detail: statusDetail,
      paid_at: paid ? new Date().toISOString() : null,
    }, { onConflict: "provider,provider_payment_id" });
  }

  if (paid && pedido.user_id) {
    const productId = pedido.ofertas?.produto_id;
    const accessDays = pedido.ofertas?.access_days ?? null;

    if (productId) {
      const startsAt = new Date();
      const expiresAt = accessDays ? new Date(startsAt.getTime() + accessDays * 86400000).toISOString() : null;

      await admin.from("acessos").upsert({
        user_id: pedido.user_id,
        produto_id: productId,
        pedido_id: pedido.id,
        starts_at: startsAt.toISOString(),
        expires_at: expiresAt,
        status: "active",
      }, { onConflict: "user_id,produto_id,pedido_id" });
    }
  }

  await admin.from("webhook_events")
    .update({ processed_at: new Date().toISOString() })
    .eq("provider", "mercadopago")
    .eq("event_id", eventId);

  return json({ ok: true });
});
