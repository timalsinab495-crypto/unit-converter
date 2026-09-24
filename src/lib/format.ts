// Number formatting shared by server logs and the UI.
// Nepal (like India) groups digits as lakh and crore: 1,00,000 and 1,00,00,000.

export function fractionDigitsFor(n: number): number {
  const abs = Math.abs(n);
  if (abs === 0 || abs >= 1000) return 2;
  if (abs >= 1) return 3;
  if (abs >= 0.01) return 4;
  return 6;
}

/** 245000 → "2,45,000" · 3.14159 → "3.142" */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: fractionDigitsFor(n),
  }).format(n);
}

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

/** 245000 → "२,४५,०००" (Devanagari digits). Swapped by hand because not every browser ships Nepali locale data. */
export function formatNepaliDigits(n: number): string {
  return formatNumber(n).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

/** 245000 → "2.45 lakh" · 34500000 → "3.45 crore". Returns undefined below 1 lakh. */
export function inLakhCrore(n: number): string | undefined {
  const abs = Math.abs(n);
  const fmt = (x: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(x);
  if (abs >= 1_00_00_000) return `${fmt(n / 1_00_00_000)} crore`;
  if (abs >= 1_00_000) return `${fmt(n / 1_00_000)} lakh`;
  return undefined;
}

/** A plain string that can go back into the input box, e.g. after pressing swap. */
export function toInputString(n: number): string {
  if (!Number.isFinite(n)) return "";
  return String(Number(n.toPrecision(10)));
}
