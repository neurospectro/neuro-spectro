import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const origins = new Set(["https://neurospectro.com.br","https://www.neurospectro.com.br","https://hello-world-maker-6497.lovable.app"]);
const DISCLAIMER = "Este material é informativo e foi elaborado a partir das respostas fornecidas na avaliação NeuroSpectro. Não constitui diagnóstico, laudo, consulta ou avaliação psicológica e não substitui uma avaliação realizada por profissional habilitado.";

function cors(req: Request) {
  const origin = req.headers.get("Origin")?.trim() ?? "";
  return {"Access-Control-Allow-Origin": origins.has(origin) ? origin : "https://neurospectro.com.br","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"};
}
function json(req: Request, body: unknown, status=200) {
  return new Response(JSON.stringify(body),{status,headers:{...cors(req),"Content-Type":"application/json"}});
}
function clean(v: unknown) { return String(v ?? "").replace(/\s+/g," ").replace(/[–—]/g,"-").replace(/[“”]/g,'"').replace(/[‘’]/g,"'").trim(); }
function arr(v: unknown) { return Array.isArray(v) ? v.map(clean).filter(Boolean).slice(0,10) : []; }

function parseObject(value: unknown): Record<string,unknown>|null {
  const raw=clean(value);
  for (const candidate of [raw,raw.replace(/^\`\`\`json\s*/i,"").replace(/\s*\`\`\`$/i,"").trim()]) {
    try { const parsed=JSON.parse(candidate); if(parsed && typeof parsed==="object" && !Array.isArray(parsed)) return parsed; } catch {}
  }
  const start=raw.indexOf("{"), end=raw.lastIndexOf("}");
  if(start>=0 && end>start) { try { const parsed=JSON.parse(raw.slice(start,end+1)); return parsed && typeof parsed==="object" && !Array.isArray(parsed) ? parsed : null; } catch {} }
  return null;
}

function wrap(text:string,font:any,size:number,max:number) {
  const words=clean(text).split(" "), lines:string[]=[]; let line="";
  for(const word of words) {
    const candidate=line ? line+" "+word : word;
    if(font.widthOfTextAtSize(candidate,size)<=max) line=candidate;
    else { if(line) lines.push(line); line=word; }
  }
  if(line) lines.push(line);
  return lines;
}

async function makePdf(input:{name:string,email:string,resultId:string,createdAt:string,scores:any[],editorial:Record<string,unknown>}) {
  const pdf=await PDFDocument.create();
  const regular=await pdf.embedFont(StandardFonts.Helvetica);
  const bold=await pdf.embedFont(StandardFonts.HelveticaBold);
  const W=595.28,H=841.89,M=48,MW=W-M*2;
  let page=pdf.addPage([W,H]), y=H-M;
  const next=()=>{page=pdf.addPage([W,H]);y=H-M;};
  const ensure=(n:number)=>{if(y-n<M)next();};
  const heading=(s:string,size=18)=>{ensure(size+24);page.drawText(s.slice(0,120),{x:M,y,size,font:bold,color:rgb(.08,.11,.17)});y-=size+12;};
  const para=(s:string,size=10,gap=8)=>{const lines=wrap(s,regular,size,MW);ensure(lines.length*(size+4)+gap);for(const line of lines){page.drawText(line,{x:M,y,size,font:regular,color:rgb(.22,.25,.31)});y-=size+4;}y-=gap;};
  const bullets=(items:string[])=>{for(const item of items){const lines=wrap("• "+item,regular,10,MW-8);ensure(lines.length*14+5);for(const line of lines){page.drawText(line,{x:M+4,y,size:10,font:regular,color:rgb(.22,.25,.31)});y-=14;}y-=4;}};

  page.drawText("NEUROSPECTRO",{x:M,y,size:10,font:bold,color:rgb(.06,.46,.43)});y-=28;
  heading("Relatório Individual",26);
  para("Uma leitura aprofundada e organizada das respostas da sua autoavaliação.",13,16);
  para("Titular: "+(input.name||"Conta NeuroSpectro"));
  para("E-mail: "+input.email);
  para("Data: "+new Date(input.createdAt).toLocaleDateString("pt-BR"));
  para("ID: NS-"+input.resultId.slice(0,8).toUpperCase(),9,16);

  heading("Síntese personalizada");
  para(clean(input.editorial.summary)||"Este relatório organiza os principais pontos observados nas respostas fornecidas.");

  heading("Perfil por dimensões");
  const dimMap=typeof input.editorial.dimensions==="object" && input.editorial.dimensions ? input.editorial.dimensions as Record<string,unknown> : {};
  for(const score of input.scores) {
    const pct=score.max ? Math.round((Number(score.raw)/Number(score.max))*100) : 0;
    ensure(55);
    page.drawText(clean(score.label),{x:M,y,size:11,font:bold,color:rgb(.08,.11,.17)});
    page.drawText(pct+"%",{x:W-M-35,y,size:10,font:bold,color:rgb(.06,.46,.43)});y-=16;
    para(clean(dimMap[clean(score.label)])||"Esta pontuação representa a frequência das respostas nesta dimensão e deve ser interpretada em conjunto com o restante do relatório.",9.5,7);
  }

  heading("Padrões para observar"); bullets(arr(input.editorial.patterns));
  heading("Estratégias práticas"); bullets(arr(input.editorial.practicalSupports));
  heading("Perguntas para um profissional"); bullets(arr(input.editorial.professionalQuestions));
  heading("Fechamento"); para(clean(input.editorial.closing)||"Use este material como ponto de partida para autoconhecimento e para organizar perguntas sobre suas experiências.");
  heading("Limites e uso responsável"); para(DISCLAIMER); para("As pontuações não são diagnóstico e não devem ser tratadas como ponto de corte clínico. O conteúdo editorial é gerado a partir dos dados fornecidos e não substitui avaliação profissional.",9.5);

  return await pdf.save();
}

async function callAI(prompt:string) {
  const account=Deno.env.get("CLOUDFLARE_ACCOUNT_ID")?.trim();
  const token=Deno.env.get("CLOUDFLARE_API_TOKEN")?.trim();
  const model=Deno.env.get("CLOUDFLARE_AI_MODEL")?.trim() || "@cf/meta/llama-3.1-8b-instruct";
  if(!account||!token) throw new Error("PDF_AI_NOT_CONFIGURED");
  const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${model}`,{
    method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({prompt})
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok || payload?.success===false) { console.error("PDF_AI_PROVIDER_ERROR",response.status,payload?.errors??[]); throw new Error("PDF_AI_PROVIDER_ERROR"); }
  return payload?.result?.response ?? payload?.result ?? "";
}

function promptFor(name:string,scores:unknown[],analysis:unknown) {
  return `Você é o motor editorial do Relatório Individual NeuroSpectro.
Transforme os dados abaixo em uma narrativa aprofundada e acolhedora de autoconhecimento.

REGRAS:
- Não faça diagnóstico, classificação clínica ou conclusão sobre transtorno.
- Não invente sintomas, fatos biográficos ou características.
- Não altere, recalcule ou contradiga pontuações.
- Trate padrões como hipóteses de exploração, nunca como certezas.
- Não prescreva tratamento.
- Português do Brasil.
- Retorne SOMENTE JSON válido, sem markdown.
- Seja específico e individualizado.

SCHEMA:
{"summary":"3 a 5 parágrafos curtos em uma string","dimensions":{"nome exato da dimensão":"parágrafo curto"},"patterns":["5 a 8 observações"],"practicalSupports":["6 a 10 estratégias de baixo risco"],"professionalQuestions":["5 a 8 perguntas para profissional habilitado"],"closing":"1 a 2 parágrafos curtos"}

Nome: ${name||"não informado"}
Pontuações: ${JSON.stringify(scores)}
Análise NeuroSpectro existente: ${JSON.stringify(analysis)}
`;
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors(req)});
  if(req.method!=="POST") return json(req,{error:"Método não permitido."},405);
  const auth=req.headers.get("Authorization")?.replace(/^Bearer\s+/i,"");
  if(!auth) return json(req,{error:"Autenticação necessária."},401);

  const url=Deno.env.get("SUPABASE_URL")?.trim(), anon=Deno.env.get("SUPABASE_ANON_KEY")?.trim(), service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if(!url||!anon||!service) return json(req,{error:"Servidor não configurado."},503);
  const client=createClient(url,anon), admin=createClient(url,service);
  const {data:userData,error:userError}=await client.auth.getUser(auth);
  if(userError||!userData.user) return json(req,{error:"Sessão inválida ou expirada."},401);

  const body=await req.json().catch(()=>null);
  const requestedResultId=clean(body?.resultId);

  const {data:product}=await admin.from("produtos").select("id").eq("slug","relatorio-pdf").maybeSingle();
  if(!product) return json(req,{error:"Produto do PDF não configurado."},503);
  const {data:access}=await admin.from("acessos").select("id").eq("user_id",userData.user.id).eq("produto_id",product.id).eq("status","active").or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`).limit(1);
  if(!access?.length) return json(req,{error:"O acesso ao PDF não está ativo."},403);

  const resultQuery=admin.from("resultados").select("id,user_id,created_at,scores,analysis").eq("user_id",userData.user.id).order("created_at",{ascending:false}).limit(1);
  const {data:result,error:resultError}=requestedResultId ? await admin.from("resultados").select("id,user_id,created_at,scores,analysis").eq("id",requestedResultId).eq("user_id",userData.user.id).maybeSingle() : await resultQuery.maybeSingle();
  if(resultError||!result) return json(req,{error:"Resultado não encontrado."},404);

  const {data:existing}=await admin.from("pdf_report_jobs").select("id,status,storage_path,error_message").eq("user_id",userData.user.id).eq("result_id",result.id).maybeSingle();
  if(existing?.status==="completed"&&existing.storage_path) {
    const {data:signed}=await admin.storage.from("private-reports").createSignedUrl(existing.storage_path,3600);
    if(signed?.signedUrl) return json(req,{status:"completed",jobId:existing.id,signedUrl:signed.signedUrl});
  }

  const {data:job,error:jobError}=await admin.from("pdf_report_jobs").upsert({user_id:userData.user.id,result_id:result.id,status:"processing",error_message:null,updated_at:new Date().toISOString()},{onConflict:"user_id,result_id"}).select("id").single();
  if(jobError||!job) return json(req,{error:"Não foi possível iniciar a geração do PDF."},500);

  try {
    const email=userData.user.email??"";
    const name=clean(userData.user.user_metadata?.full_name||userData.user.user_metadata?.name||email.split("@")[0]||"Conta NeuroSpectro");
    const editorial=parseObject(await callAI(promptFor(name,result.scores,result.analysis)));
    if(!editorial||typeof editorial.summary!=="string") throw new Error("PDF_AI_INVALID_JSON");

    const bytes=await makePdf({name,email,resultId:result.id,createdAt:result.created_at,scores:Array.isArray(result.scores)?result.scores:[],editorial});
    const path=`${userData.user.id}/${result.id}.pdf`;
    const {error:uploadError}=await admin.storage.from("private-reports").upload(path,bytes,{contentType:"application/pdf",upsert:true});
    if(uploadError) throw uploadError;

    await admin.from("pdf_report_jobs").update({status:"completed",storage_path:path,error_message:null,completed_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",job.id).eq("user_id",userData.user.id);
    const {data:signed}=await admin.storage.from("private-reports").createSignedUrl(path,3600);
    if(!signed?.signedUrl) throw new Error("PDF_SIGNED_URL_ERROR");
    return json(req,{status:"completed",jobId:job.id,signedUrl:signed.signedUrl});
  } catch(error) {
    console.error("PDF_GENERATION_ERROR",error);
    await admin.from("pdf_report_jobs").update({status:"failed",error_message:error instanceof Error?error.message:"PDF_GENERATION_ERROR",updated_at:new Date().toISOString()}).eq("id",job.id).eq("user_id",userData.user.id);
    const message=error instanceof Error&&error.message==="PDF_AI_NOT_CONFIGURED"?"A geração inteligente do PDF ainda não foi configurada no servidor.":"Não foi possível gerar o PDF agora. Tente novamente.";
    return json(req,{error:message,retryable:true},502);
  }
});
