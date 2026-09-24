// Small data visuals used on converter pages.

import type { ConversionMeta } from "@/lib/conversions/types";

const MIN_C = -10;
const MAX_C = 45;

function thermoColor(c: number) {
  if (c < 10) return "#2a55c2";
  if (c < 30) return "#e89a0c";
  if (c < 37.5) return "#f06a1d";
  return "#d0103a";
}

/** A thermometer that fills to the converted temperature. */
export function Thermometer({ celsius }: { celsius: number | null }) {
  const top = 16;
  const bottom = 214;
  const clamp = (c: number) => Math.min(MAX_C, Math.max(MIN_C, c));
  const y = (c: number) => bottom - ((clamp(c) - MIN_C) / (MAX_C - MIN_C)) * (bottom - top);
  const level = celsius === null ? bottom : y(celsius);
  const color = celsius === null ? "#c9d3e6" : thermoColor(celsius);
  const ticks = [
    { c: 0, label: "0°C", f: "32°F" },
    { c: 20, label: "20°C", f: "68°F" },
    { c: 37, label: "37°C", f: "98.6°F" },
  ];

  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 130 270" className="h-64 w-auto" role="img" aria-label={celsius === null ? "Thermometer, empty" : `Thermometer showing ${celsius.toFixed(1)} °C`}>
        {/* fever zone */}
        <rect x="50" y={y(45)} width="30" height={y(38) - y(45)} fill="#d0103a" opacity="0.08" />
        <rect x="52" y="8" width="26" height="220" rx="13" fill="#fff" stroke="#14245e" strokeWidth="3" />
        <rect
          x="58"
          y={top}
          width="14"
          height={226 - top}
          rx="7"
          fill={color}
          style={{
            transformBox: "fill-box",
            transformOrigin: "bottom",
            transform: `scaleY(${(226 - level) / (226 - top)})`,
            transition: "transform 700ms cubic-bezier(.2,.9,.3,1), fill 400ms",
          }}
        />
        <circle cx="65" cy="238" r="22" fill={color} stroke="#14245e" strokeWidth="3" style={{ transition: "fill 400ms" }} />
        <circle cx="58" cy="231" r="6" fill="#fff" opacity="0.45" />
        {ticks.map((t) => (
          <g key={t.c}>
            <line x1="78" x2="86" y1={y(t.c)} y2={y(t.c)} stroke="#14245e" strokeWidth="2" />
            <line x1="44" x2="52" y1={y(t.c)} y2={y(t.c)} stroke="#14245e" strokeWidth="2" />
            <text x="90" y={y(t.c) + 4} fontSize="11" fill="#14245e" fontWeight="600">
              {t.label}
            </text>
            <text x="40" y={y(t.c) + 4} fontSize="11" fill="#4e5a85" textAnchor="end">
              {t.f}
            </text>
          </g>
        ))}
        <text x="90" y={y(41.5) + 4} fontSize="10" fill="#d0103a" fontWeight="700">
          fever
        </text>
      </svg>
    </figure>
  );
}

/**
 * Draws how traditional land units nest inside each other.
 * Hill: 1 ropani = 16 aana (4×4), 1 aana = 4 paisa (2×2), 1 paisa = 4 daam (2×2)
 * Terai: 1 bigha = 20 kattha (5×4), 1 kattha = 20 dhur (5×4)
 */
export function LandGrid({ kind }: { kind: "hill-grid" | "terai-grid" }) {
  const size = 200;
  const hill = kind === "hill-grid";
  const cols = hill ? 4 : 5;
  const rows = 4;
  const cw = size / cols;
  const ch = size / rows;
  const subCols = hill ? 2 : 5;
  const subRows = hill ? 2 : 4;

  return (
    <svg viewBox={`-2 -2 ${size + 4} ${size + 4}`} className="h-auto w-full max-w-[220px]" role="img" aria-label={hill ? "One ropani split into 16 aana, one aana split into 4 paisa, one paisa split into 4 daam" : "One bigha split into 20 kattha, one kattha split into 20 dhur"}>
      <rect width={size} height={size} fill="#e2f1e7" stroke="#1d5a37" strokeWidth="3" rx="4" />
      {Array.from({ length: cols - 1 }, (_, i) => (
        <line key={`c${i}`} x1={(i + 1) * cw} x2={(i + 1) * cw} y1="0" y2={size} stroke="#2e7d4f" strokeOpacity="0.45" />
      ))}
      {Array.from({ length: rows - 1 }, (_, i) => (
        <line key={`r${i}`} y1={(i + 1) * ch} y2={(i + 1) * ch} x1="0" x2={size} stroke="#2e7d4f" strokeOpacity="0.45" />
      ))}
      {/* highlighted sub-unit in the bottom-left corner */}
      <rect x="0" y={size - ch} width={cw} height={ch} fill="#2e7d4f" />
      {Array.from({ length: subCols - 1 }, (_, i) => (
        <line key={`sc${i}`} x1={((i + 1) * cw) / subCols} x2={((i + 1) * cw) / subCols} y1={size - ch} y2={size} stroke="#fff" strokeOpacity="0.6" />
      ))}
      {Array.from({ length: subRows - 1 }, (_, i) => (
        <line key={`sr${i}`} y1={size - ch + ((i + 1) * ch) / subRows} y2={size - ch + ((i + 1) * ch) / subRows} x1="0" x2={cw} stroke="#fff" strokeOpacity="0.6" />
      ))}
      {hill && <rect x="0" y={size - ch / 2} width={cw / 2} height={ch / 2} fill="#f4a417" />}
    </svg>
  );
}

export function LandGridLegend({ kind }: { kind: "hill-grid" | "terai-grid" }) {
  const items =
    kind === "hill-grid"
      ? [
          { swatch: "bg-[#e2f1e7] border-2 border-[#1d5a37]", text: "1 ropani, split into 16 aana" },
          { swatch: "bg-paddy", text: "1 aana = 4 paisa" },
          { swatch: "bg-marigold", text: "1 paisa = 4 daam" },
        ]
      : [
          { swatch: "bg-[#e2f1e7] border-2 border-[#1d5a37]", text: "1 bigha, split into 20 kattha" },
          { swatch: "bg-paddy", text: "1 kattha = 20 dhur" },
        ];
  return (
    <ul className="space-y-2 text-sm">
      {items.map((i) => (
        <li key={i.text} className="flex items-center gap-2.5">
          <span aria-hidden className={`size-4 shrink-0 rounded ${i.swatch}`} />
          {i.text}
        </li>
      ))}
    </ul>
  );
}

/** Chain of equal amounts: 1 dharni = 3 ser = 12 pau = 48 chhatak */
export function UnitLadder({ ladder }: { ladder: NonNullable<ConversionMeta["ladder"]> }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {ladder.steps.map((step, i) => (
        <li key={step} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className="font-display text-lg font-bold text-ink-faint">
              =
            </span>
          )}
          <span className="rounded-lg bg-[var(--cat-soft)] px-2.5 py-1 font-display font-semibold text-[var(--cat-ink)]">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
