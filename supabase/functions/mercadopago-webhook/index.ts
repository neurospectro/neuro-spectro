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
  const dataIdFromQuery = url.searchParams.get("data.id") ?? "";
  const typeFromQuery = url.searchParams.get("type") ?? "";
  const rawBody = await req.clone().json().catch(() => ({}));
  const dataId = dataIdFromQuery || String(rawBody?.data?.id ?? "");
  const valid = await verifySignature(req, dataId);
  if (!valid) return json({ error: "Assinatura inválida." }, 401);

  const body = rawBody;
  const eventId = String(body?.id ?? `${body?.type ?? typeFromQuery ?? "order"}:${dataId}`);
  const eventType = String(body?.type ?? typeFromQuery ?? "order");

  // O simulador do Mercado Pago usa dados sintéticos. Depois de validar a assinatura,
  // reconhecemos esses eventos sem consultar um recurso fictício na API.
  const notificationExternalReference = String(body?.data?.external_reference ?? "");
  if (notificationExternalReference && !notificationExternalReference.startsWith("ns_")) {
    return json({ ok: true, acknowledged: true, simulated: true });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  const mpToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN")?.trim();
  const webhookSecret = Deno.env.get("MERCADOPAGO_WEBHOOK_SECRET")?.trim();

  if (!supabaseUrl || !serviceKey || !mpToken || !webhookSecret) {
    console.error("MERCADOPAGO_WEBHOOK_CONFIG_ERROR: required server secrets are missing.");
    return json({ error: "Webhook do Mercado Pago ainda não está configurado no servidor." }, 503);
  }

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

  if (!dataId || !["payment", "order"].includes(eventType)) {
    await admin.from("webhook_events").update({ processed_at: new Date().toISOString() }).eq("provider", "mercadopago").eq("event_id", eventId);
    return json({ ok: true });
  }

  const resourcePath = eventType === "payment"
    ? `https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`
    : `https://api.mercadopago.com/v1/orders/${encodeURIComponent(dataId)}`;

  let resourceResponse: Response;

  try {
    resourceResponse = await fetch(resourcePath, {
      headers: { Authorization: `Bearer ${mpToken}` },
    });
  } catch (error) {
    console.error("MERCADOPAGO_WEBHOOK_NETWORK_ERROR", error);
    return json({ error: "Não foi possível consultar o Mercado Pago agora.", retryable: true }, 502);
  }

  if (!resourceResponse.ok) {
    // O Mercado Pago permite testar Webhooks informando manualmente um Data ID.
    // Esse ID pode não existir na conta de produção, mesmo com a assinatura válida.
    // Em 404, a notificação foi recebida e autenticada, então respondemos 200 para
    // evitar que o teste seja marcado como falha. Erros transitórios do provedor
    // continuam retornando 502 para permitir nova tentativa.
    if (resourceResponse.status === 404) {
      await admin.from("webhook_events")
        .update({ processed_at: new Date().toISOString() })
        .eq("provider", "mercadopago")
        .eq("event_id", eventId);
      return json({ ok: true, acknowledged: true, resource_not_found: true });
    }
    if (resourceResponse.status === 401 || resourceResponse.status === 403) {
      console.error("MERCADOPAGO_WEBHOOK_AUTH_ERROR", resourceResponse.status);
      return json({ error: "A credencial do Mercado Pago não foi aceita pelo servidor." }, 503);
    }

    if (resourceResponse.status === 429 || resourceResponse.status >= 500) {
      return json({ error: "O Mercado Pago está temporariamente indisponível.", retryable: true }, 502);
    }

    console.error("MERCADOPAGO_WEBHOOK_RESOURCE_ERROR", { status: resourceResponse.status, eventId });
    return json({ error: "O recurso notificado pelo Mercado Pago não pôde ser consultado." }, 502);
  }

  const resource = await resourceResponse.json().catch(() => null);
  if (!resource) return json({ error: "Resposta inválida do Mercado Pago." }, 502);
  const externalReference = String(resource?.external_reference ?? "");
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

  const payment = eventType === "payment"
    ? resource
    : resource?.transactions?.payments?.[0];
  const status = payment?.status ?? resource?.status ?? "pending";
  const statusDetail = payment?.status_detail ?? resource?.status_detail ?? null;
  const paid = status === "processed" || status === "approved";
  const failed = ["rejected", "failed", "cancelled"].includes(status);

  await admin.from("pedidos").update({
    provider_order_id: String(resource?.id ?? dataId),
    status: paid ? "paid" : failed ? "failed" : "pending",
    paid_at: paid ? new Date().toISOString() : null,
  }).eq("id", pedido.id);

  if (payment?.id) {
    const { data: existingPayment } = await admin
      .from("pagamentos")
      .select("id")
      .eq("provider", "mercadopago")
      .eq("provider_payment_id", payment.id)
      .maybeSingle();

    const paymentPayload = {
      pedido_id: pedido.id,
      provider: "mercadopago",
      provider_payment_id: String(payment.id),
      status,
      amount_cents: pedido.amount_cents,
      installment_number: payment?.payment_method?.installments ?? null,
      raw_status_detail: statusDetail,
      paid_at: paid ? new Date().toISOString() : null,
    };

    if (existingPayment) {
      await admin.from("pagamentos").update(paymentPayload).eq("id", existingPayment.id);
    } else {
      await admin.from("pagamentos").insert(paymentPayload);
    }
  }

  if (paid && pedido.user_id) {
    const productId = pedido.ofertas?.produto_id;
    const accessDays = pedido.ofertas?.access_days ?? null;

    if (productId) {
      const startsAt = new Date();
      const expiresAt = accessDays ? new Date(startsAt.getTime() + accessDays * 86400000).toISOString() : null;

      const { data: existingAccess } = await admin
        .from("acessos")
        .select("id")
        .eq("user_id", pedido.user_id)
        .eq("produto_id", productId)
        .eq("pedido_id", pedido.id)
        .maybeSingle();

      const accessPayload = {
        user_id: pedido.user_id,
        produto_id: productId,
        pedido_id: pedido.id,
        starts_at: startsAt.toISOString(),
        expires_at: expiresAt,
        status: "active",
      };

      if (existingAccess) {
        await admin.from("acessos").update(accessPayload).eq("id", existingAccess.id);
      } else {
        await admin.from("acessos").insert(accessPayload);
      }
    }
  }

  await admin.from("webhook_events")
    .update({ processed_at: new Date().toISOString() })
    .eq("provider", "mercadopago")
    .eq("event_id", eventId);

  return json({ ok: true });
});
