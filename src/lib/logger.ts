// A tiny logger built on console.log / console.warn / console.error.
//
// On Vercel, anything a function prints to the console shows up in
// Project → Logs. The console method decides the log level Vercel shows:
//   console.log   → info    (white)
//   console.warn  → warning (yellow)
//   console.error → error   (red)
//
// Every line looks like:
//   👀 page_view | GET /convert/usd-to-npr from 103.10.28.5 (Kathmandu, NP) | {"ip":"103.10.28.5",...}
// The emoji + event name make lines easy to spot, and the JSON at the end
// is searchable in the Vercel log search box.

type Details = Record<string, unknown>;

const EVENT_ICONS: Record<string, string> = {
  cold_start: "🧊",
  page_view: "👀",
  convert_request: "🔁",
  convert_success: "✅",
  invalid_input: "✋",
  unknown_conversion: "❓",
  env_fallback: "🔑",
  convert_crash: "💥",
  unhandled_error: "🔥",
};

function line(event: string, message: string, details?: Details) {
  const icon = EVENT_ICONS[event] ?? "•";
  const json = details ? ` | ${JSON.stringify(details)}` : "";
  return `${icon} ${event} | ${message}${json}`;
}

export const logger = {
  info(event: string, message: string, details?: Details) {
    console.log(line(event, message, details));
  },
  warn(event: string, message: string, details?: Details) {
    console.warn(line(event, message, details));
  },
  /** Pass the original error so its stack trace (file + line number) is printed too. */
  error(event: string, message: string, error: unknown, details?: Details) {
    console.error(line(event, message, details), error);
  },
};
