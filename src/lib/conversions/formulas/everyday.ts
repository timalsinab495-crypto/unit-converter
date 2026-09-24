import { formatNumber as fmt } from "@/lib/format";
import { linear, roughCount, type Formula } from "./helpers";

const CM_PER_FOOT = 30.48;
const KM_PER_KOS = 3.2;
const LITRES_PER_MANA = 0.5683; // 8 mana = 1 pathi ≈ 4.546 L
const WALKING_KM_PER_HOUR = 4;

function feetAndInches(feet: number): string | undefined {
  if (feet <= 0) return undefined;
  let whole = Math.floor(feet);
  let inches = Math.round((feet - whole) * 12 * 10) / 10;
  if (inches >= 12) {
    whole += 1;
    inches = 0;
  }
  return `${fmt(feet)} ft is ${whole} ft ${fmt(inches)} in.`;
}

function walkingTime(km: number): string | undefined {
  if (km <= 0) return undefined;
  const hours = km / WALKING_KM_PER_HOUR;
  if (hours < 1) return `About ${Math.max(1, Math.round(hours * 60))} minutes on foot at a steady 4 km/h.`;
  return `About ${roughCount(hours, "hour")} on foot at a steady 4 km/h.`;
}

function inPathi(mana: number): string | undefined {
  if (mana <= 0) return undefined;
  if (mana < 8) return "Less than one pathi (8 mana).";
  return `That's ${roughCount(mana / 8, "pathi", "pathi")}, at 8 mana per pathi.`;
}

export const everydayFormulas: Record<string, Formula> = {
  "feet-to-cm": linear({
    from: "ft",
    to: "cm",
    toPerFrom: CM_PER_FOOT,
    insight: ({ fromValue }) => feetAndInches(fromValue),
  }),

  "km-to-kos": linear({
    from: "km",
    to: "kos",
    fromPerTo: KM_PER_KOS,
    insight: ({ fromValue }) => walkingTime(fromValue),
  }),

  "litre-to-mana": linear({
    from: "L",
    to: "mana",
    fromPerTo: LITRES_PER_MANA,
    insight: ({ toValue }) => inPathi(toValue),
  }),
};
