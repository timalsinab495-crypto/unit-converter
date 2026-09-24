import { formatNumber as fmt } from "@/lib/format";
import { linear, roughCount, type Formula } from "./helpers";

// ─── Hill system: ropani → aana → paisa → daam ──────────────────────────────
const SQ_FT_PER_ROPANI = 5476;
const SQ_FT_PER_AANA = 342.25;
const SQ_M_PER_SQ_FT = 0.09290304;
const SQ_M_PER_AANA = SQ_FT_PER_AANA * SQ_M_PER_SQ_FT; // ≈ 31.796

// ─── Terai system: bigha → kattha → dhur ────────────────────────────────────
const SQ_FT_PER_BIGHA = 72900;

// Every Terai unit, measured in kattha.
const TERAI_UNITS: Record<string, { name: string; inKattha: number }> = {
  bhiga: { name: "bigha", inKattha: 20 },
  kattha: { name: "kattha", inKattha: 1 },
  dhur: { name: "dhur", inKattha: 1 / 20 },
};

function convertTerai(value: number, from: string, to: string): number {
  const kattha = value * TERAI_UNITS[from].inKattha;
  return kattha / TERAI_UNITS[to].inKattha;
}

// ─── Relatable comparisons ──────────────────────────────────────────────────
const BADMINTON_COURT_SQ_M = 13.4 * 6.1; // ≈ 81.7
const FOOTBALL_PITCH_SQ_M = 105 * 68; // ≈ 7,140

function areaInsight(squareMetres: number): string | undefined {
  if (squareMetres <= 0) return undefined;
  if (squareMetres < BADMINTON_COURT_SQ_M) {
    return `Smaller than a badminton court (about ${Math.round((squareMetres / BADMINTON_COURT_SQ_M) * 100)}% of one).`;
  }
  if (squareMetres < FOOTBALL_PITCH_SQ_M) {
    return `About ${roughCount(squareMetres / BADMINTON_COURT_SQ_M, "badminton court")} laid side by side.`;
  }
  return `About ${roughCount(squareMetres / FOOTBALL_PITCH_SQ_M, "football pitch", "football pitches")}.`;
}

export const landFormulas: Record<string, Formula> = {
  "sq-meter-to-aana": linear({
    from: "sq m",
    to: "aana",
    fromPerTo: SQ_M_PER_AANA,
    insight: ({ fromValue }) => areaInsight(fromValue),
  }),

  "ropani-to-sq-feet": linear({
    from: "ropani",
    to: "sq ft",
    toPerFrom: SQ_FT_PER_ROPANI,
    insight: ({ toValue }) => areaInsight(toValue * SQ_M_PER_SQ_FT),
  }),

  "bigha-to-kattha": (value, direction) => {
    const [from, to] = direction === "forward" ? ["bigha", "kattha"] : ["kattha", "bigha"];
    const result = convertTerai(value, from, to);
    const bigha = direction === "forward" ? value : result;

    return {
      result,
      formula:
        direction === "forward"
          ? `1 bigha = 20 kattha, so ${fmt(value)} × 20 = ${fmt(result)} kattha`
          : `1 bigha = 20 kattha, so ${fmt(value)} ÷ 20 = ${fmt(result)} bigha`,
      insight: areaInsight(bigha * SQ_FT_PER_BIGHA * SQ_M_PER_SQ_FT),
    };
  },

  "bigha-to-ropani": linear({
    from: "bigha",
    to: "ropani",
    toPerFrom: SQ_FT_PER_BIGHA / SQ_FT_PER_ROPANI,
    insight: ({ fromValue }) => areaInsight(fromValue * SQ_FT_PER_BIGHA * SQ_M_PER_SQ_FT),
  }),
};
