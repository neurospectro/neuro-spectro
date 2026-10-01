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

function paymentType(paymentTypeId: string | undefined, paymentMethodId: string | undefined) {
  if (paymentTypeId === "credit_card" || paymentTypeId === "debit_card" || paymentTypeId === "bank_transfer") {
    return paymentTypeId;
  }
  if (paymentMethodId === "pix") return "bank_transfer";
  return null;
}

function isProcessed(status: string | null | undefined, statusDetail: string | null | undefined) {
  return status === "processed" || status === "approved" || statusDetail === "accredited";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const authHeader = req.headers.get("Authorization");
  const accessToken = authHeader?.replace(/^Bearer\s+/i, "");
  if (!accessToken) return json({ error: "Autenticação necessária." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim();
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  const mpToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN")?.trim();

  if (!supabaseUrl || !anonKey || !serviceKey) {
    console.error("PROCESS_PAYMENT_CONFIG_ERROR: Supabase server configuration is incomplete.");
    return json({ error: "O servidor ainda não está configurado corretamente." }, 503);
  }

  if (!mpToken) {
    console.error("PROCESS_PAYMENT_CONFIG_ERROR: Mercado Pago Access Token is missing.");
    return json({ error: "Mercado Pago ainda não está configurado no servidor." }, 503);
  }

  const authClient = createClient(supabaseUrl, anonKey);
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);
  if (userError || !userData.user) return json({ error: "Sessão inválida ou expirada." }, 401);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "Dados de pagamento inválidos." }, 400);

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

  if (offerError) {
    console.error("PROCESS_PAYMENT_OFFER_ERROR", offerError);
    return json({ error: "Não foi possível validar a oferta." }, 500);
  }
  if (!offer) return json({ error: "Oferta não disponível." }, 400);
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
  if (!payerEmail || !/^\S+@\S+\.\S+$/.test(payerEmail)) {
    return json({ error: "E-mail do pagador é obrigatório e deve ser válido." }, 400);
  }

  const paymentMethodId = String(formData?.payment_method_id ?? "");
  const selectedPaymentType = String(formData?.payment_type_id ?? formData?.paymentTypeId ?? "");
  const normalizedType = paymentType(selectedPaymentType, paymentMethodId);

  if (!normalizedType || !paymentMethodId) {
    return json({ error: "Forma de pagamento não reconhecida." }, 400);
  }

  if (normalizedType === "credit_card" || normalizedType === "debit_card") {
    if (!formData?.token) return json({ error: "Não foi possível validar os dados do cartão." }, 400);

    const selectedInstallments = Number(formData?.installments ?? 1);
    if (!Number.isInteger(selectedInstallments) || selectedInstallments < 1) {
      return json({ error: "Número de parcelas inválido." }, 400);
    }
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

  // Checkout Transparente atual do Mercado Pago usa a Orders API (/v1/orders).
  // O Payment Brick fornece payment_method_id, payment_type_id, token e installments.
  const paymentMethod: Record<string, unknown> = {
    id: paymentMethodId,
    type: normalizedType,
  };

  if (formData?.token) paymentMethod.token = String(formData.token);
  if (normalizedType === "credit_card" || normalizedType === "debit_card") {
    paymentMethod.installments = Number(formData?.installments ?? 1);
  }

  const orderPayload: Record<string, unknown> = {
    type: "online",
    processing_mode: "automatic",
    total_amount: amount,
    external_reference: `ns_${pedido.id}`,
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
        },
      ],
    },
  };

  let mpResponse: Response;
  let mpData: any;

  try {
    mpResponse = await fetch("https://api.mercadopago.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mpToken}`,
        "X-Idempotency-Key": pedido.id,
      },
      body: JSON.stringify(orderPayload),
    });
    mpData = await mpResponse.json().catch(() => ({}));
  } catch (error) {
    console.error("PROCESS_PAYMENT_MP_NETWORK_ERROR", error);
    return json({ error: "Não foi possível conectar ao Mercado Pago. Tente novamente.", orderId: pedido.id, retryable: true }, 502);
  }

  if (!mpResponse.ok) {
    const causeDetails = Array.isArray(mpData?.cause)
      ? mpData.cause
          .map((item: unknown) => {
            if (!item || typeof item !== "object") return "";
            const cause = item as Record<string, unknown>;
            return String(cause.description ?? cause.code ?? "").trim();
          })
          .filter(Boolean)
      : [];

    const detail =
      String(
        mpData?.message ??
        mpData?.error ??
        causeDetails[0] ??
        mpData?.details ??
        "Erro retornado pelo Mercado Pago.",
      ).trim();

    const errorCode = String(mpData?.error ?? mpData?.code ?? mpData?.cause?.[0]?.code ?? "").trim();

    console.error("PROCESS_PAYMENT_MP_ERROR", {
      status: mpResponse.status,
      errorCode,
      detail,
      causes: causeDetails,
      orderId: pedido.id,
    });

    await admin.from("pedidos").update({
      status: mpResponse.status >= 500 || mpResponse.status === 429 ? "pending" : "failed",
    }).eq("id", pedido.id);

    if (mpResponse.status === 401 || mpResponse.status === 403) {
      return json({ error: "A credencial do Mercado Pago não foi aceita pelo servidor." }, 503);
    }
    if (mpResponse.status === 429 || mpResponse.status >= 500) {
      return json({ error: "O Mercado Pago está temporariamente indisponível. Tente novamente.", retryable: true }, 502);
    }

    return json({
      error: detail,
      code: errorCode || null,
      causes: causeDetails,
      details: mpData?.details ?? null,
      message: mpData?.message ?? null,
      error: mpData?.error ?? null,
      status: mpResponse.status,
      mercadoPagoResponse: mpData,
      orderId: pedido.id,
    }, 400);
  }

  const payment = mpData?.transactions?.payments?.[0] ?? null;
  const paymentStatus = String(payment?.status ?? mpData?.status ?? "pending");
  const paymentStatusDetail = payment?.status_detail ?? mpData?.status_detail ?? null;
  const paid = isProcessed(paymentStatus, paymentStatusDetail);

  await admin
    .from("pedidos")
    .update({
      provider_order_id: String(mpData.id),
      status: paid ? "paid" : "pending",
      paid_at: paid ? new Date().toISOString() : null,
    })
    .eq("id", pedido.id);

  if (payment?.id) {
    const { error: paymentError } = await admin.from("pagamentos").upsert({
      pedido_id: pedido.id,
      provider: "mercadopago",
      provider_payment_id: String(payment.id),
      status: paymentStatus,
      amount_cents: configured.total,
      installment_number: payment?.payment_method?.installments ?? Number(formData?.installments ?? 1),
      raw_status_detail: paymentStatusDetail,
      paid_at: paid ? new Date().toISOString() : null,
    }, { onConflict: "provider,provider_payment_id" });

    if (paymentError) console.error("PROCESS_PAYMENT_PAYMENT_DB_ERROR", paymentError);
  }

  if (paid) {
    const productId = offer.produto_id;
    if (productId) {
      await admin.from("acessos").upsert({
        user_id: userData.user.id,
        produto_id: productId,
        pedido_id: pedido.id,
        starts_at: new Date().toISOString(),
        expires_at: null,
        status: "active",
      }, { onConflict: "user_id,produto_id,pedido_id" });
    }
  }

  const paymentMethodData = payment?.payment_method ?? {};
  return json({
    ok: true,
    orderId: mpData.id,
    paymentId: payment?.id ?? null,
    paymentStatus,
    paymentStatusDetail,
    pix: normalizedType === "bank_transfer" ? {
      qrCode: paymentMethodData?.qr_code ?? null,
      qrCodeBase64: paymentMethodData?.qr_code_base64 ?? null,
      ticketUrl: paymentMethodData?.ticket_url ?? null,
    } : null,
  });
});
