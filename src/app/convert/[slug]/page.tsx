import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, KeyRound, Lightbulb } from "lucide-react";
import { ConversionIcon, categoryStyle } from "@/components/conversion-icon";
import { LandGrid, LandGridLegend, UnitLadder } from "@/components/visuals";
import { CONVERSIONS, getCategory, getConversion } from "@/lib/conversions/catalog";
import { formatNumber } from "@/lib/format";
import { getRate } from "@/lib/rates";
import { logPageView } from "@/lib/visitor";
import { logger } from "@/lib/logger";
import { Converter } from "./converter";

export async function generateMetadata({ params }: PageProps<"/convert/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const meta = getConversion(slug);
  if (!meta) return { title: "Conversion not found" };
  return { title: `${meta.title} (${meta.from.nepali} → ${meta.to.nepali})`, description: meta.summary };
}

export default async function ConvertPage({ params }: PageProps<"/convert/[slug]">) {
  const { slug } = await params;
  const meta = getConversion(slug);

  if (!meta) {
    logger.warn("unknown_conversion", `Page /convert/${slug} doesn't exist, showing 404`, { slug });
    notFound();
  }

  await logPageView(`/convert/${slug}`);

  const category = getCategory(meta.category);
  const rate = meta.rateEnv ? getRate(meta.rateEnv, { quiet: true }) : null;
  const related = CONVERSIONS.filter((c) => c.category === meta.category && c.slug !== meta.slug);

  return (
    <div style={categoryStyle(meta.category)}>
      {/* ─── Page header ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--cat-soft)]">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -bottom-[0.3em] font-display text-[clamp(6rem,18vw,14rem)] leading-none font-extrabold whitespace-nowrap text-[var(--cat)] opacity-[0.08] select-none"
        >
          {meta.from.nepali}
        </span>

        <div className="relative mx-auto max-w-6xl px-4 pt-6 pb-12 sm:px-6 sm:pb-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[15px] font-medium text-ink-soft">
            <Link href="/#conversions" className="-ml-2 flex items-center gap-0.5 rounded-full px-2 py-1 hover:bg-white/60 hover:text-ink">
              <ChevronLeft className="size-4" aria-hidden />
              All conversions
            </Link>
            <span aria-hidden>/</span>
            <span className="px-1 text-[var(--cat-ink)]">
              {category.name} {category.nepali}
            </span>
          </nav>

          <div className="mt-6 flex items-start gap-4 sm:gap-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[var(--cat)] text-white shadow-[4px_4px_0_0_#14245e] sm:size-16">
              <ConversionIcon name={meta.icon} className="size-7 sm:size-8" />
            </span>
            <div>
              <h1 className="font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.02] font-extrabold tracking-tight">
                {meta.title}
              </h1>
              <p className="mt-1 font-display text-xl font-semibold text-[var(--cat-ink)] sm:text-2xl">
                {meta.from.nepali} → {meta.to.nepali}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{meta.summary}</p>
        </div>
      </section>

      {/* ─── Converter + side panels ──────────────────────────────────── */}
      <div className="relative mx-auto -mt-6 grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-8">
        <Converter meta={meta} />

        <aside className="space-y-5 lg:pt-6">
          {rate && (
            <section className="rounded-2xl border-2 border-ink bg-ink p-5 text-white">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-marigold">
                <KeyRound className="size-5" aria-hidden />
                This rate comes from an environment variable
              </h2>
              <p className="mt-3 overflow-x-auto rounded-lg bg-white/10 px-3 py-2 font-mono text-sm whitespace-nowrap">
                {rate.name}=<span className="text-marigold">{rate.value}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-glacier/80">
                {rate.source === "env" ? (
                  <>
                    {rate.label}: Rs {formatNumber(rate.value)}. To change it, edit <code>.env</code> locally, or update it in
                    Vercel under Settings, Environment Variables, then redeploy.
                  </>
                ) : (
                  <>
                    <strong className="text-crimson">{rate.name} isn&apos;t set</strong>, so a built-in fallback is used.
                    Add it in Vercel under Settings, Environment Variables, then redeploy.
                  </>
                )}
              </p>
            </section>
          )}

          {meta.ladder && (
            <section className="rounded-2xl border-2 border-line bg-paper p-5">
              <h2 className="font-display text-lg font-bold">{meta.ladder.title}</h2>
              <div className="mt-3">
                <UnitLadder ladder={meta.ladder} />
              </div>
              {meta.ladder.visual && (
                <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <LandGrid kind={meta.ladder.visual} />
                  <LandGridLegend kind={meta.ladder.visual} />
                </div>
              )}
            </section>
          )}

          <section className="rounded-2xl border-2 border-line bg-paper p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <Lightbulb className="size-5 text-marigold" aria-hidden />
              Did you know?
            </h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{meta.funFact}</p>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold">
            More in {category.name.toLowerCase()} <span className="text-[var(--cat-ink)]">{category.nepali}</span>
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {related.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/convert/${c.slug}`}
                  className="flex items-center gap-2 rounded-full border-2 border-line bg-paper py-2 pr-4 pl-2.5 font-medium hover:border-[var(--cat)]"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-[var(--cat-soft)] text-[var(--cat-ink)]">
                    <ConversionIcon name={c.icon} className="size-4" />
                  </span>
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
