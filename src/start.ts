import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { securityHeadersMiddleware } from "./lib/security-headers";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    console.error("SSR_REQUEST_ERROR", error);
    throw error;
  }
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware, securityHeadersMiddleware],
}));
