import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const offers: Record<string, { product: string; total: number; installments: number; installment: number }> = {
  "report-full-2490": { product: "relatorio-completo", total: 2490, installments: 1, installment: 2490 },
  "pdf-report-1490": { product: "relatorio-pdf", total: 1490, installments: 1, installment: 1490 },
  "community-6x-1490": { product: "comunidade-apoio", total: 8940, installments: 6, installment: 1490 },
};

function centsToAmount(cents: number) {
  return (cents / 100).toFixed(2);
}

function paymentType(paymentTypeId: string | undefined) {
  if (paymentTypeId === "credit_card") return "credit_card";
  if (paymentTypeId === "debit_card") return "debit_card";
  if (paymentTypeId === "prepaid_card") return "prepaid_card";
  if (paymentTypeId === "bank_transfer") return "bank_transfer";
  if (paymentTypeId === "ticket") return "ticket";
  if (paymentTypeId === "account_money") return "account_money";
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const authHeader = req.headers.get("Authorization");
  const accessToken = authHeader?.replace(/^Bearer\s+/i, "");
  if (!accessToken) return json({ error: "Autenticação necessária." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const mpToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN")!;

  if (!mpToken) return json({ error: "Mercado Pago ainda não está configurado no servidor." }, 503);

  const authClient = createClient(supabaseUrl, anonKey);
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);
  if (userError || !userData.user) return json({ error: "Sessão inválida ou expirada." }, 401);

  const body = await req.json().catch(() => null);
  const offerId = body?.offerId;
  const formData = body?.formData ?? {};
  const configured = offers[offerId];

  if (!configured) return json({ error: "Oferta inválida." }, 400);

  const { data: offer, error: offerError } = await admin
    .from("ofertas")
    .select("id,slug,nome,total_cents,installment_count,installment_cents,produto_id,produtos(slug)")
    .eq("slug", offerId)
    .eq("active", true)
    .maybeSingle();

  if (offerError || !offer) return json({ error: "Oferta não disponível." }, 400);
  if (offer.total_cents !== configured.total || offer.installment_count !== configured.installments) {
    return json({ error: "A configuração da oferta não corresponde ao catálogo seguro." }, 409);
  }

  const productSlug = String(offer?.produtos?.slug ?? configured.product);

  if (productSlug === "relatorio-pdf") {
    const { data: reportProduct } = await admin
      .from("produtos")
      .select("id")
      .eq("slug", "relatorio-completo")
      .maybeSingle();

    const { data: reportAccess } = reportProduct
      ? await admin
          .from("acessos")
          .select("id")
          .eq("user_id", userData.user.id)
          .eq("produto_id", reportProduct.id)
          .eq("status", "active")
          .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
          .limit(1)
      : { data: [] };

    if (!reportAccess?.length) {
      return json({ error: "O Relatório PDF é um complemento do Relatório Completo." }, 403);
    }
  }

  const payerEmail = String(formData?.payer?.email ?? userData.user.email ?? "").trim();
  if (!payerEmail) return json({ error: "E-mail do pagador é obrigatório." }, 400);

  const selectedPaymentType = String(formData?.payment_type_id ?? formData?.paymentTypeId ?? "");
  const selectedPaymentMethod = String(formData?.payment_method_id ?? "");
  const normalizedType = paymentType(selectedPaymentType);

  if (!normalizedType || !selectedPaymentMethod) {
    return json({ error: "Forma de pagamento não reconhecida." }, 400);
  }

  if (configured.installments > 1 && normalizedType.includes("card")) {
    const selectedInstallments = Number(formData?.installments ?? 0);
    if (selectedInstallments !== configured.installments) {
      return json({ error: `Esta oferta deve ser paga em ${configured.installments}x de R$ ${(configured.installment / 100).toFixed(2).replace(".", ",")}.` }, 400);
    }
  }

  const amount = centsToAmount(configured.total);
  const pedidoInsert = {
    user_id: userData.user.id,
    oferta_id: offer.id,
    status: "pending",
    provider: "mercadopago",
    amount_cents: configured.total,
    installments: Number(formData?.installments ?? 1),
  };

  const { data: pedido, error: pedidoError } = await admin
    .from("pedidos")
    .insert(pedidoInsert)
    .select("id")
    .single();

  if (pedidoError || !pedido) return json({ error: "Não foi possível criar o pedido." }, 500);

  const paymentMethod: Record<string, unknown> = {
    id: selectedPaymentMethod,
    type: normalizedType,
  };

  if (formData?.token) paymentMethod.token = String(formData.token);
  if (normalizedType === "credit_card" || normalizedType === "debit_card" || normalizedType === "prepaid_card") {
    paymentMethod.installments = Number(formData?.installments ?? 1);
  }

  const orderPayload: Record<string, unknown> = {
    type: "online",
    processing_mode: "automatic",
    total_amount: amount,
    external_reference: `ns_${pedido.id}`,
    description: offer.nome,
    payer: {
      email: payerEmail,
      ...(formData?.payer?.identification
        ? { identification: formData.payer.identification }
        : {}),
    },
    transactions: {
      payments: [
        {
          amount,
          payment_method: paymentMethod,
          ...(normalizedType === "bank_transfer"
            ? { expiration_time: "P1D" }
            : {}),
        },
      ],
    },
  };

  const mpResponse = await fetch("https://api.mercadopago.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${mpToken}`,
      "X-Idempotency-Key": pedido.id,
    },
    body: JSON.stringify(orderPayload),
  });

  const mpData = await mpResponse.json().catch(() => ({}));

  if (!mpResponse.ok) {
    await admin.from("pedidos").update({ status: "failed" }).eq("id", pedido.id);
    return json({
      error: "O Mercado Pago recusou a criação do pagamento.",
      detail: mpData?.message ?? mpData?.error ?? "Erro no provedor.",
    }, 400);
  }

  const payment = mpData?.transactions?.payments?.[0];
  await admin
    .from("pedidos")
    .update({ provider_order_id: mpData.id, status: mpData.status === "processed" ? "paid" : "pending", paid_at: mpData.status === "processed" ? new Date().toISOString() : null })
    .eq("id", pedido.id);

  if (payment?.id) {
    await admin.from("pagamentos").insert({
      pedido_id: pedido.id,
      provider: "mercadopago",
      provider_payment_id: payment.id,
      status: payment.status ?? mpData.status ?? "pending",
      amount_cents: configured.total,
      installment_number: payment?.payment_method?.installments ?? null,
      raw_status_detail: payment?.status_detail ?? mpData.status_detail ?? null,
      paid_at: payment?.status === "processed" ? new Date().toISOString() : null,
    });
  }

  return json({
    ok: true,
    orderId: mpData.id,
    orderStatus: mpData.status,
    paymentStatus: payment?.status ?? mpData.status,
    paymentStatusDetail: payment?.status_detail ?? mpData.status_detail,
    paymentId: payment?.id ?? null,
    pix: normalizedType === "bank_transfer" ? {
      qrCode: payment?.payment_method?.qr_code ?? null,
      qrCodeBase64: payment?.payment_method?.qr_code_base64 ?? null,
      ticketUrl: payment?.payment_method?.ticket_url ?? null,
    } : null,
  });
});
