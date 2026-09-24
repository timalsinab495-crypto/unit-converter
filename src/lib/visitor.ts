import "server-only";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { logger } from "./logger";

// Vercel adds these headers to every request before it reaches our code:
//   x-forwarded-for / x-real-ip   → the visitor's IP address
//   x-vercel-ip-country / -city   → rough location, looked up from the IP
//   x-vercel-id                   → an ID for this request (also shown in the Logs tab)
// Locally (npm run dev) most of them are missing, so we fall back to "local".

export interface Visitor {
  ip: string;
  location: string;
  browser: string;
  os: string;
  device: string;
  isBot: boolean;
  referer: string | null;
  language: string | null;
  vercelId: string | null;
}

export function getVisitor(h: Headers): Visitor {
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";

  const city = h.get("x-vercel-ip-city");
  const country = h.get("x-vercel-ip-country");
  const location = country ? [city && decodeURIComponent(city), country].filter(Boolean).join(", ") : "local";

  const ua = userAgent({ headers: h });

  return {
    ip,
    location,
    browser: [ua.browser.name ?? "Unknown browser", ua.browser.major].filter(Boolean).join(" "),
    os: ua.os.name ?? "Unknown OS",
    device: ua.device.type ?? "desktop",
    isBot: ua.isBot,
    referer: h.get("referer"),
    language: h.get("accept-language")?.split(",")[0] ?? null,
    vercelId: h.get("x-vercel-id"),
  };
}

/** Call at the top of a page (Server Component) to log who opened it. */
export async function logPageView(path: string) {
  const h = await headers();

  // Next.js prefetches pages when links scroll into view. Those aren't real visits.
  if (h.get("next-router-prefetch")) return;

  const v = getVisitor(h);
  logger.info("page_view", `GET ${path} from ${v.ip} (${v.location}) on ${v.browser}, ${v.os}`, {
    path,
    ...v,
  });
}
