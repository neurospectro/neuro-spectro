import { createMiddleware } from "@tanstack/react-start";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
].join("; ");

export const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  const headers = result.response.headers;

  headers.set("Content-Security-Policy", contentSecurityPolicy);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set("X-DNS-Prefetch-Control", "off");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");
  headers.set("Strict-Transport-Security", "max-age=31536000");

  return result;
});
