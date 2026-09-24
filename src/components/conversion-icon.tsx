import {
  Coins,
  DollarSign,
  Footprints,
  Fuel,
  Gem,
  Grid3x3,
  IndianRupee,
  LandPlot,
  Mountain,
  Ruler,
  Scale,
  Sprout,
  Thermometer,
  Weight,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId, IconName } from "@/lib/conversions/types";

const ICONS: Record<IconName, LucideIcon> = {
  "land-plot": LandPlot,
  grid: Grid3x3,
  sprout: Sprout,
  mountain: Mountain,
  scale: Scale,
  weight: Weight,
  gem: Gem,
  thermometer: Thermometer,
  ruler: Ruler,
  footprints: Footprints,
  wheat: Wheat,
  dollar: DollarSign,
  rupee: IndianRupee,
  coins: Coins,
  fuel: Fuel,
};

export function ConversionIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon aria-hidden className={className} strokeWidth={2} />;
}

/** Each category gets its own colour. Used through CSS variables so Tailwind classes stay static. */
export const CATEGORY_COLORS: Record<CategoryId, { main: string; soft: string; ink: string }> = {
  land: { main: "#2e7d4f", soft: "#e2f1e7", ink: "#1d5a37" },
  weight: { main: "#b07a12", soft: "#f6ecd4", ink: "#76510a" },
  money: { main: "#e89a0c", soft: "#fdf0d5", ink: "#7f5200" },
  temperature: { main: "#d0103a", soft: "#fbe3e8", ink: "#a50b2d" },
  everyday: { main: "#2a55c2", soft: "#e2e9f8", ink: "#1d3f96" },
};

export function categoryStyle(id: CategoryId): React.CSSProperties {
  const c = CATEGORY_COLORS[id];
  return { "--cat": c.main, "--cat-soft": c.soft, "--cat-ink": c.ink } as React.CSSProperties;
}
