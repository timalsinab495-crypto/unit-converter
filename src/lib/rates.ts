import "server-only";
import type { RateInfo, RateName } from "./conversions/types";
import { logger } from "./logger";

// Some conversions never change (1 ropani is always 5,476 sq ft).
// Others do: the dollar rate moves every day, gold every few hours.
// Those values live in environment variables so they can be updated
// without touching the code:
//   • locally  → the .env file in the project root
//   • on Vercel → Project → Settings → Environment Variables (then redeploy)
//
// If a variable is missing or isn't a number, we use the fallback below
// and write a warning to the logs so someone notices.

const RATES: Record<RateName, { label: string; fallback: number }> = {
  USD_TO_NPR: { label: "1 US dollar in rupees", fallback: 141.5 },
  INR_TO_NPR: { label: "1 Indian rupee in Nepali rupees", fallback: 1.6 },
  GOLD_PRICE_PER_TOLA_NPR: { label: "Gold, per tola", fallback: 245000 },
  SILVER_PRICE_PER_TOLA_NPR: { label: "Silver, per tola", fallback: 3100 },
  PETROL_PRICE_PER_LITRE_NPR: { label: "Petrol, per litre", fallback: 157 },
};

export function getRate(name: RateName, { quiet = false } = {}): RateInfo {
  const { label, fallback } = RATES[name];
  const raw = process.env[name];
  const value = Number(raw);

  if (raw && Number.isFinite(value) && value > 0) {
    return { name, label, value, source: "env" };
  }

  if (!quiet) {
    logger.warn(
      "env_fallback",
      raw
        ? `${name}="${raw}" is not a positive number. Using fallback ${fallback}.`
        : `${name} is not set. Using fallback ${fallback}. Add it in Vercel → Settings → Environment Variables.`,
      { variable: name, received: raw ?? null, fallback },
    );
  }
  return { name, label, value: fallback, source: "fallback" };
}

export function getAllRates(): RateInfo[] {
  return (Object.keys(RATES) as RateName[]).map((name) => getRate(name, { quiet: true }));
}

/** Optional date string (e.g. "2026-09-24") telling visitors when rates were last updated. */
export function getRatesUpdatedOn(): string | null {
  return process.env.RATES_UPDATED_ON || null;
}
