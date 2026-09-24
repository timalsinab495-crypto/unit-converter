import { formatNumber as fmt, inLakhCrore } from "@/lib/format";
import { getRate } from "@/lib/rates";
import { linear, type Formula } from "./helpers";

// These rates change over time, so they are read from environment variables
// on every request (see src/lib/rates.ts) instead of being written in the code.

const G_PER_TOLA = 11.664;
const SCOOTER_KM_PER_LITRE = 45;

function rupeesInWords(npr: number): string | undefined {
  const words = inLakhCrore(npr);
  return words ? `That's Rs ${words}.` : undefined;
}

export const moneyFormulas: Record<string, Formula> = {
  "usd-to-npr": (value, direction) => {
    const rate = getRate("USD_TO_NPR");
    return linear({
      from: "USD",
      to: "NPR",
      toPerFrom: rate.value,
      rate,
      insight: ({ toValue }) => rupeesInWords(toValue),
    })(value, direction);
  },

  "inr-to-npr": (value, direction) => {
    const rate = getRate("INR_TO_NPR");
    return linear({
      from: "INR",
      to: "NPR",
      toPerFrom: rate.value,
      rate,
      insight: ({ toValue }) => rupeesInWords(toValue),
    })(value, direction);
  },

  "npr-to-gold-tola": (value, direction) => {
    const rate = getRate("GOLD_PRICE_PER_TOLA_NPR");
    return linear({
      from: "NPR",
      to: "tola",
      fromPerTo: rate.value,
      rate,
      insight: ({ toValue }) =>
        toValue > 0 ? `That's about ${fmt(toValue * G_PER_TOLA)} g of gold, before the making charge.` : undefined,
    })(value, direction);
  },

  "npr-to-silver-tola": (value, direction) => {
    const rate = getRate("SILVER_PRICE_PER_TOLA_NPR");
    return linear({
      from: "NPR",
      to: "tola",
      fromPerTo: rate.value,
      rate,
      insight: ({ toValue }) => (toValue > 0 ? `That's about ${fmt(toValue * G_PER_TOLA)} g of silver.` : undefined),
    })(value, direction);
  },

  "npr-to-petrol-litre": (value, direction) => {
    const rate = getRate("PETROL_PRICE_PER_LITRE_NPR");
    return linear({
      from: "NPR",
      to: "L",
      fromPerTo: rate.value,
      rate,
      insight: ({ toValue }) =>
        toValue > 0
          ? `Enough for about ${fmt(Math.round(toValue * SCOOTER_KM_PER_LITRE))} km on a scooter doing 45 km per litre.`
          : undefined,
    })(value, direction);
  },
};
