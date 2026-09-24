import { formatNumber as fmt } from "@/lib/format";
import type { Formula } from "./helpers";

function describe(celsius: number, fahrenheit: number): string {
  // Numbers between 95 °F and 110 °F are almost always a body temperature.
  if (fahrenheit >= 95 && fahrenheit <= 110) {
    if (celsius < 36) return "Below normal body temperature.";
    if (celsius < 37.5) return "Normal body temperature.";
    if (celsius < 38) return "A little warm. Check again in an hour.";
    if (celsius < 39.4) return "That's a fever (ज्वरो). Rest and drink plenty of water.";
    return "High fever. It's a good idea to see a health worker.";
  }
  if (celsius <= 0) return "Freezing. Himalayan winter territory.";
  if (celsius < 12) return "Cold, like a Kathmandu winter morning.";
  if (celsius < 24) return "Pleasant, like Kathmandu in spring.";
  if (celsius < 32) return "Warm, like a Pokhara summer afternoon.";
  if (celsius < 42) return "Hot, like the Terai before the monsoon.";
  return "Dangerously hot. Stay in the shade and drink water.";
}

export const temperatureFormulas: Record<string, Formula> = {
  "fahrenheit-to-celsius": (value, direction) => {
    if (direction === "forward") {
      const c = ((value - 32) * 5) / 9;
      return { result: c, formula: `(${fmt(value)} − 32) × 5 ÷ 9 = ${fmt(c)} °C`, insight: describe(c, value) };
    }
    const f = (value * 9) / 5 + 32;
    return { result: f, formula: `${fmt(value)} × 9 ÷ 5 + 32 = ${fmt(f)} °F`, insight: describe(value, f) };
  },
};
