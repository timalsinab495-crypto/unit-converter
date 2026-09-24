import Link from "next/link";
import { ConversionBrowser } from "@/components/conversion-browser";
import { Mountains, PrayerFlags } from "@/components/decor";
import { RateBoard } from "@/components/rate-board";
import { CATEGORIES, CONVERSIONS } from "@/lib/conversions/catalog";
import type { ConversionMeta, RateName } from "@/lib/conversions/types";
import { formatNumber } from "@/lib/format";
import { getAllRates, getRatesUpdatedOn } from "@/lib/rates";
import { logPageView } from "@/lib/visitor";

// Home page cards for money conversions show the live rate from process.env.
const LIVE_EXAMPLES: Partial<Record<RateName, (rate: number) => string>> = {
  USD_TO_NPR: (r) => `1 USD = Rs ${formatNumber(r)}`,
  INR_TO_NPR: (r) => `1 INR = Rs ${formatNumber(r)}`,
  GOLD_PRICE_PER_TOLA_NPR: (r) => `1 tola = Rs ${formatNumber(r)}`,
  SILVER_PRICE_PER_TOLA_NPR: (r) => `1 tola = Rs ${formatNumber(r)}`,
  PETROL_PRICE_PER_LITRE_NPR: (r) => `1 litre = Rs ${formatNumber(r)}`,
};

export default async function HomePage() {
  await logPageView("/");

  const rates = getAllRates();
  const conversions: ConversionMeta[] = CONVERSIONS.map((c) => {
    const live = c.category === "money" && c.rateEnv ? LIVE_EXAMPLES[c.rateEnv] : undefined;
    const rate = rates.find((r) => r.name === c.rateEnv);
    return live && rate ? { ...c, example: live(rate.value) } : c;
  });

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative -mt-2 overflow-hidden bg-gradient-to-b from-snow via-glacier/60 to-glacier">
        <PrayerFlags className="pointer-events-none absolute inset-x-0 top-0 h-20 opacity-90 sm:h-24" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-24 pb-10 sm:px-6 sm:pt-28 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <h1 className="font-display leading-[0.85] font-extrabold tracking-tight">
              <span className="block text-[clamp(4.5rem,15vw,9.5rem)] text-ink">नापतौल</span>
              <span className="mt-4 block max-w-xl text-[clamp(1.75rem,3.6vw,2.6rem)] leading-[1.1] font-bold text-ink">
                A unit converter for the way Nepal measures
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
              Land in ropani and bigha, market weights in dharni and pau, gold in tola, and today&apos;s rupee rates.
              Pick a conversion and the maths runs on a Vercel Function.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#conversions"
                className="rounded-full bg-crimson px-6 py-3 font-display text-lg font-bold text-white shadow-[4px_4px_0_0_#14245e] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0_0_#14245e]"
              >
                Browse conversions
              </Link>
              <Link
                href="/convert/ropani-to-sq-feet"
                className="rounded-full border-2 border-ink px-5 py-2.5 font-display text-lg font-semibold hover:bg-ink hover:text-white"
              >
                Try ropani to sq ft
              </Link>
            </div>
          </div>

          <RateBoard rates={rates} updatedOn={getRatesUpdatedOn()} />
        </div>

        <Mountains className="h-28 sm:h-40 lg:h-52" id="hero-snow" />
      </section>

      {/* ─── Conversions ──────────────────────────────────────────────── */}
      <section id="conversions" className="mx-auto max-w-6xl scroll-mt-6 px-4 pt-16 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Pick a conversion</h2>
          <p className="mt-2 text-lg text-ink-soft">
            {CONVERSIONS.length} conversions across land, weight, money and everyday life. Each one opens its own page
            where you can swap the units either way.
          </p>
        </div>
        <ConversionBrowser conversions={conversions} categories={CATEGORIES} />
      </section>

      {/* ─── How it works (for the classroom) ─────────────────────────── */}
      <BehindTheScenes />
    </>
  );
}

const SAMPLE_LOGS = [
  { level: "info", text: '👀 page_view | GET /convert/usd-to-npr from 27.34.68.112 (Kathmandu, NP) on Chrome 140, Android' },
  { level: "info", text: "🔁 convert_request | usd-to-npr: 100 USD → NPR" },
  { level: "info", text: "✅ convert_success | 100 USD = 14,150 NPR (took 0.61 ms)" },
  { level: "warn", text: "🔑 env_fallback | GOLD_PRICE_PER_TOLA_NPR is not set. Using fallback 245000." },
  { level: "error", text: "💥 convert_crash | … crashed while converting 2 … → …" },
] as const;

const LEVEL_STYLES = {
  info: "text-glacier",
  warn: "text-marigold",
  error: "text-[#ff6b86]",
};

function BehindTheScenes() {
  const steps = [
    {
      title: "You press Convert",
      body: "Your browser sends the number to /api/convert/<conversion> with a POST request.",
    },
    {
      title: "A Vercel Function does the maths",
      body: "The route handler checks your input, reads any rate it needs from environment variables, and converts.",
    },
    {
      title: "Every step is logged",
      body: "Visits, IP addresses, results, warnings and crashes are printed with console.log, and show up in the project's Logs tab.",
    },
  ];

  return (
    <section id="behind-the-scenes" className="mx-auto mt-24 max-w-6xl scroll-mt-6 px-4 sm:px-6">
      <div className="grid gap-10 rounded-[32px] border-2 border-ink bg-paper p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        <div>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">What happens when you press Convert</h2>
          <ol className="mt-8 space-y-6">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-marigold font-display text-lg font-bold text-ink">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold">{step.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <figure className="flex min-w-0 flex-col">
          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-ink shadow-[8px_8px_0_0_#f4a417]">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="size-3 rounded-full bg-crimson" />
              <span className="size-3 rounded-full bg-marigold" />
              <span className="size-3 rounded-full bg-paddy" />
              <span className="ml-3 text-sm text-glacier/70">Vercel, Project, Logs</span>
            </div>
            <ul className="space-y-2.5 overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed sm:p-5 sm:text-[13px]">
              {SAMPLE_LOGS.map((log) => (
                <li key={log.text} className={`whitespace-pre ${LEVEL_STYLES[log.level]}`}>
                  {log.text}
                </li>
              ))}
            </ul>
          </div>
          <figcaption className="mt-4 text-sm leading-relaxed text-ink-soft">
            A sample of what this site writes to the logs. Yellow lines are warnings, red lines are errors. Each line
            ends with JSON details (IP, location, browser, request ID) that you can search.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
