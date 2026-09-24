/**
 * Thrown in the browser when the convert API answers with a 5xx error.
 * Throwing it while rendering hands control to app/convert/[slug]/error.tsx,
 * which shows the crash screen with the request ID to look up in the logs.
 */
export class ConversionCrashError extends Error {
  readonly requestId: string;
  readonly slug: string;
  readonly status: number;

  constructor(requestId: string, slug: string, status: number) {
    super(`The ${slug} conversion crashed on the server (HTTP ${status}, request ${requestId})`);
    this.name = "ConversionCrashError";
    this.requestId = requestId;
    this.slug = slug;
    this.status = status;
  }
}

/** Pulls the request ID back out of the message, in case the error object was copied. */
export function requestIdFrom(error: Error): string | null {
  if (error instanceof ConversionCrashError) return error.requestId;
  return error.message.match(/request ([\w-]+)\)/)?.[1] ?? null;
}
