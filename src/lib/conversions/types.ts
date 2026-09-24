// Types shared by the server (API route) and the browser (converter UI).
// Nothing in this file runs any code, so it is safe to import anywhere.

export type CategoryId = "land" | "weight" | "money" | "temperature" | "everyday";

/** "forward" converts from → to. "reverse" converts to → from (after pressing swap). */
export type Direction = "forward" | "reverse";

export type IconName =
  | "land-plot"
  | "grid"
  | "sprout"
  | "mountain"
  | "scale"
  | "weight"
  | "gem"
  | "thermometer"
  | "ruler"
  | "footprints"
  | "wheat"
  | "dollar"
  | "rupee"
  | "coins"
  | "fuel";

export interface Unit {
  /** Short label shown next to numbers, e.g. "sq ft" */
  symbol: string;
  /** Full English name, e.g. "Square feet" */
  name: string;
  /** Nepali name in Devanagari, e.g. "वर्ग फिट" */
  nepali: string;
}

export interface ConversionMeta {
  slug: string;
  /** e.g. "Ropani to square feet" */
  title: string;
  category: CategoryId;
  icon: IconName;
  from: Unit;
  to: Unit;
  /** One-line explanation shown under the page title */
  summary: string;
  /** Short reference shown on the home page card, e.g. "1 ropani = 5,476 sq ft" */
  example: string;
  funFact: string;
  /** A traditional unit family, e.g. 1 ropani = 16 aana = 64 paisa = 256 daam */
  ladder?: { title: string; steps: string[]; visual?: "hill-grid" | "terai-grid" };
  quickValues: number[];
  /** Negative numbers only make sense for a few conversions (temperature). */
  allowNegative?: boolean;
  /** Name of the environment variable this conversion depends on, if any. */
  rateEnv?: RateName;
}

export type RateName =
  | "USD_TO_NPR"
  | "INR_TO_NPR"
  | "GOLD_PRICE_PER_TOLA_NPR"
  | "SILVER_PRICE_PER_TOLA_NPR"
  | "PETROL_PRICE_PER_LITRE_NPR";

export interface RateInfo {
  name: RateName;
  label: string;
  value: number;
  /** "env" = read from process.env, "fallback" = the variable was missing or invalid */
  source: "env" | "fallback";
}

/** JSON body returned by POST /api/convert/[slug] */
export type ConvertResponse =
  | {
      ok: true;
      requestId: string;
      input: { value: number; unit: Unit };
      output: { value: number; unit: Unit };
      formula: string;
      insight?: string;
      rate?: RateInfo;
      durationMs: number;
    }
  | { ok: false; requestId: string; error: string };
