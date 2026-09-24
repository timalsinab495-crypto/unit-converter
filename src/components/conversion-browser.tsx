"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import type { Category } from "@/lib/conversions/catalog";
import type { CategoryId, ConversionMeta } from "@/lib/conversions/types";
import { ConversionIcon, categoryStyle } from "./conversion-icon";

type Filter = "all" | CategoryId;

export function ConversionBrowser({
  conversions,
  categories,
}: {
  conversions: ConversionMeta[];
  categories: Category[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversions.filter((c) => {
      if (filter !== "all" && c.category !== filter) return false;
      if (!q) return true;
      const haystack = [c.title, c.from.name, c.to.name, c.from.symbol, c.to.symbol, c.from.nepali, c.to.nepali, c.summary, c.slug]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [conversions, filter, query]);

  const groups = categories
    .map((cat) => ({ cat, items: visible.filter((c) => c.category === cat.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" count={conversions.length} />
          {categories.map((cat) => (
            <FilterChip
              key={cat.id}
              active={filter === cat.id}
              onClick={() => setFilter(cat.id)}
              label={cat.name}
              nepali={cat.nepali}
              count={conversions.filter((c) => c.category === cat.id).length}
              style={categoryStyle(cat.id)}
            />
          ))}
        </div>

        <label className="relative block lg:w-80">
          <span className="sr-only">Search conversions</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ropani, tola, dollar…"
            className="w-full rounded-full border-2 border-line bg-paper py-2.5 pr-10 pl-10 text-[15px] placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-glacier"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
      </div>

      {groups.length === 0 ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-line px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold">Nothing matches &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-ink-soft">Try a unit name like aana, dharni or petrol, or clear the search.</p>
        </div>
      ) : (
        <div className="mt-10 space-y-14">
          {groups.map(({ cat, items }) => (
            <section key={cat.id} aria-labelledby={`cat-${cat.id}`} style={categoryStyle(cat.id)}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b-2 border-ink/10 pb-3">
                <h3 id={`cat-${cat.id}`} className="flex items-baseline gap-3 font-display text-2xl font-bold sm:text-3xl">
                  <span className="relative top-0.5 inline-block size-3.5 rotate-45 rounded-[3px] bg-[var(--cat)]" aria-hidden />
                  {cat.name}
                  <span className="text-xl font-semibold text-[var(--cat-ink)] sm:text-2xl">{cat.nepali}</span>
                </h3>
                <p className="text-[15px] text-ink-soft">{cat.blurb}</p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <li key={c.slug}>
                    <ConversionCard conversion={c} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  nepali,
  count,
  style,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  nepali?: string;
  count: number;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={style}
      className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-[15px] font-semibold transition-colors ${
        active ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink hover:border-ink/40"
      }`}
    >
      {style && <span aria-hidden className="size-2.5 rounded-full bg-[var(--cat)]" />}
      {label}
      {nepali && <span className={active ? "text-white/70" : "text-ink-soft"}>{nepali}</span>}
      <span className={`text-xs tabular-nums ${active ? "text-white/60" : "text-ink-faint"}`}>{count}</span>
    </button>
  );
}

function ConversionCard({ conversion: c }: { conversion: ConversionMeta }) {
  return (
    <Link
      href={`/convert/${c.slug}`}
      style={categoryStyle(c.category)}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-line bg-paper p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--cat)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--cat-soft)] text-[var(--cat-ink)]">
          <ConversionIcon name={c.icon} className="size-6" />
        </span>
        <ArrowRight
          aria-hidden
          className="size-5 -translate-x-1 text-ink-faint opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-[var(--cat)] group-hover:opacity-100"
        />
      </div>

      <h4 className="mt-4 font-display text-xl leading-tight font-bold">
        {c.title}
      </h4>
      <p className="mt-0.5 font-display text-[15px] font-medium text-ink-soft">
        {c.from.nepali} → {c.to.nepali}
      </p>

      <p className="mt-auto pt-5">
        <span className="inline-block rounded-lg bg-[var(--cat-soft)] px-2.5 py-1 font-display text-[15px] font-semibold text-[var(--cat-ink)]">
          {c.example}
        </span>
      </p>
    </Link>
  );
}
