import type { RateInfo } from "@/lib/conversions/types";
import { formatNumber } from "@/lib/format";

const ROWS: Record<RateInfo["name"], { label: string; nepali: string; per: string }> = {
  USD_TO_NPR: { label: "US dollar", nepali: "अमेरिकी डलर", per: "per $1" },
  INR_TO_NPR: { label: "Indian rupee", nepali: "भारतीय रुपैयाँ", per: "per ₹1" },
  GOLD_PRICE_PER_TOLA_NPR: { label: "Gold", nepali: "सुन", per: "per tola" },
  SILVER_PRICE_PER_TOLA_NPR: { label: "Silver", nepali: "चाँदी", per: "per tola" },
  PETROL_PRICE_PER_LITRE_NPR: { label: "Petrol", nepali: "पेट्रोल", per: "per litre" },
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kathmandu" });
}

/** Styled after the rate boards in Nepali banks and gold shops. Every number comes from process.env. */
export function RateBoard({ rates, updatedOn }: { rates: RateInfo[]; updatedOn: string | null }) {
  const usingFallback = rates.some((r) => r.source === "fallback");

  return (
    <section
      aria-labelledby="rates-title"
      className="relative overflow-hidden rounded-[28px] border-4 border-ink bg-ink p-5 text-white shadow-[10px_10px_0_0_#d0103a] sm:p-6"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "10px 10px",
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="rates-title" className="font-display text-3xl leading-none font-bold text-marigold">
          आजको दर
        </h2>
        <p className="text-sm text-glacier/80">Today&apos;s rates, in rupees</p>
      </div>

      <dl className="mt-4 divide-y divide-white/10">
        {rates.map((rate) => {
          const row = ROWS[rate.name];
          return (
            <div key={rate.name} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="min-w-0">
                <span className="block font-medium leading-tight">
                  {row.label} <span className="text-glacier/60">{row.nepali}</span>
                </span>
                <code className="block truncate font-mono text-[11px] text-glacier/50">{rate.name}</code>
              </dt>
              <dd className="text-right">
                <span className="font-display text-2xl leading-none font-bold tabular-nums text-marigold">
                  {formatNumber(rate.value)}
                </span>
                <span className="block text-xs text-glacier/60">
                  {row.per}
                  {rate.source === "fallback" && <span className="ml-1 text-crimson">(fallback)</span>}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-glacier/70">
        {usingFallback
          ? "Some variables aren't set, so built-in fallbacks are showing. Add them in Vercel under Settings, Environment Variables."
          : `Read from environment variables${updatedOn ? `, last updated ${formatDate(updatedOn)}` : ""}.`}
      </p>
    </section>
  );
}
