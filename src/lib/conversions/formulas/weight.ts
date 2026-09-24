import { formatNumber as fmt } from "@/lib/format";
import { getRate } from "@/lib/rates";
import { linear, roughCount, type Formula } from "./helpers";

const KG_PER_DHARNI = 2.3942;
const G_PER_PAU = KG_PER_DHARNI * 1000 / 12; // 12 pau in a dharni ≈ 199.52 g
const G_PER_TOLA = 11.664;

const LPG_CYLINDER_KG = 14.2;
const NOODLE_PACKET_G = 75;

function weightInsight(grams: number): string | undefined {
  if (grams <= 0) return undefined;
  if (grams >= LPG_CYLINDER_KG * 1000) {
    return `As heavy as the gas in ${roughCount(grams / 1000 / LPG_CYLINDER_KG, "full LPG cylinder")} (14.2 kg each).`;
  }
  return `About ${roughCount(grams / NOODLE_PACKET_G, "packet")} of Wai Wai (75 g each).`;
}

export const weightFormulas: Record<string, Formula> = {
  "kg-to-dharni": linear({
    from: "kg",
    to: "dharni",
    fromPerTo: KG_PER_DHARNI,
    insight: ({ fromValue }) => weightInsight(fromValue * 1000),
  }),

  "gram-to-pau": linear({
    from: "g",
    to: "pau",
    fromPerTo: G_PER_PAU,
    insight: ({ fromValue }) => weightInsight(fromValue),
  }),

  // Tola is how gold is sold, so we also show what that much gold would cost.
  "tola-to-gram": (value, direction) => {
    const gold = getRate("GOLD_PRICE_PER_TOLA_NPR");
    return linear({
      from: "tola",
      to: "g",
      toPerFrom: G_PER_TOLA,
      rate: gold,
      insight: ({ fromValue }) =>
        fromValue > 0 ? `That much gold costs about Rs ${fmt(Math.round(fromValue * gold.value))} at today's price.` : undefined,
    })(value, direction);
  },
};
