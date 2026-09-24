import type { Instrumentation } from "next";

// Next.js calls register() once whenever a new server instance boots.
// On Vercel that's a "cold start": the first request after a deploy or after
// the function has been idle for a while. Watch for 🧊 in the logs.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node");
  }

  console.log(
    `🧊 cold_start | New server instance started | ${JSON.stringify({
      runtime: process.env.NEXT_RUNTIME,
      region: process.env.VERCEL_REGION ?? "local",
      environment: process.env.VERCEL_ENV ?? "development",
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    })}`,
  );
}

// Called for any error our code didn't catch itself (in pages or API routes).
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `🔥 unhandled_error | ${request.method} ${request.path} failed: ${message} | ${JSON.stringify({
      route: context.routePath,
      type: context.routeType,
      ip: request.headers["x-forwarded-for"] ?? null,
    })}`,
  );
};
