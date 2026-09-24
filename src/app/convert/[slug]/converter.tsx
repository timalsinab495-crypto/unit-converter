"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpDown, Check, Copy, History, LoaderCircle, Server, Sparkles, X } from "lucide-react";
import { Thermometer } from "@/components/visuals";
import { ConversionCrashError } from "@/lib/conversions/crash";
import type { ConversionMeta, ConvertResponse, Direction } from "@/lib/conversions/types";
import { formatNepaliDigits, formatNumber, inLakhCrore, toInputString } from "@/lib/format";

type Success = Extract<ConvertResponse, { ok: true }>;

interface LastCall {
  path: string;
  status: number;
  ms: number;
  requestId: string;
}

interface RecentItem {
  input: string;
  direction: Direction;
  line: string;
}

/** Sends the number to our API route and times the round trip. Returns null if the network failed. */
async function callConvertApi(slug: string, value: string, direction: Direction) {
  const path = `/api/convert/${slug}`;
  const startedAt = performance.now();
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value, direction }),
    });
    const data = (await res.json().catch(() => null)) as ConvertResponse | null;
    const summary: LastCall = {
      path,
      status: res.status,
      ms: Math.round(performance.now() - startedAt),
      requestId: data?.requestId ?? res.headers.get("x-request-id") ?? "unknown",
    };
    return { res, data, summary };
  } catch {
    return null;
  }
}

export function Converter({ meta }: { meta: ConversionMeta }) {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<Direction>("forward");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Success | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crash, setCrash] = useState<Error | null>(null);
  const [lastCall, setLastCall] = useState<LastCall | null>(null);
  const [swapTurns, setSwapTurns] = useState(0);
  const [recent, addRecent, clearRecent] = useRecent(meta.slug);
  const inputRef = useRef<HTMLInputElement>(null);

  // A 5xx from the API means our server code broke. Throwing here, during
  // render, makes Next.js show the error.tsx screen for this page.
  if (crash) throw crash;

  const from = direction === "forward" ? meta.from : meta.to;
  const to = direction === "forward" ? meta.to : meta.from;
  // The answer no longer matches what's typed in the box.
  const stale = result !== null && Number(input.replace(/,/g, "")) !== result.input.value;

  async function convert(raw: string, dir: Direction = direction) {
    if (!raw.trim()) {
      setError("Type a number first.");
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError(null);

    const call = await callConvertApi(meta.slug, raw, dir);
    setLoading(false);
    if (!call) {
      setError("Couldn't reach the server. Check your connection and try again.");
      return;
    }

    const { res, data } = call;
    setLastCall(call.summary);

    if (res.status >= 500) {
      setCrash(new ConversionCrashError(call.summary.requestId, meta.slug, res.status));
      return;
    }
    if (!data || !data.ok) {
      setResult(null);
      setError(data && !data.ok ? data.error : "Something went wrong. Try again.");
      return;
    }

    setResult(data);
    addRecent({
      input: raw,
      direction: dir,
      line: `${formatNumber(data.input.value)} ${data.input.unit.symbol} = ${formatNumber(data.output.value)} ${data.output.unit.symbol}`,
    });
  }

  function swap() {
    setDirection((d) => (d === "forward" ? "reverse" : "forward"));
    setSwapTurns((n) => n + 1);
    setError(null);
    if (result) {
      // Move the answer up into the input so it can be converted back.
      setInput(toInputString(result.output.value));
      setResult(null);
    }
    inputRef.current?.focus();
  }

  function pick(value: string, dir: Direction = direction) {
    setInput(value);
    setDirection(dir);
    void convert(value, dir);
  }

  const celsius =
    meta.category === "temperature" && result
      ? result.output.unit.symbol === "°C"
        ? result.output.value
        : result.input.value
      : null;

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void convert(input);
        }}
        className="rounded-[28px] border-2 border-ink bg-paper p-5 shadow-[8px_8px_0_0_var(--cat)] sm:p-7"
      >
        <div className={meta.category === "temperature" ? "grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto]" : ""}>
          <div>
            {/* From */}
            <UnitField label="From" unit={from} htmlFor="convert-input">
              <input
                ref={inputRef}
                id="convert-input"
                inputMode="decimal"
                autoComplete="off"
                autoFocus
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="0"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "convert-error" : undefined}
                className="w-full min-w-0 bg-transparent font-display text-[clamp(2rem,6vw,3rem)] leading-none font-bold tabular-nums placeholder:text-ink/20 focus:outline-none focus-visible:outline-none"
              />
            </UnitField>

            {/* Swap */}
            <div className="relative z-10 -my-3 flex justify-center">
              <button
                type="button"
                onClick={swap}
                aria-label={`Swap: convert ${to.name} to ${from.name} instead`}
                title="Swap units"
                className="grid size-12 place-items-center rounded-full border-2 border-ink bg-marigold text-ink shadow-[3px_3px_0_0_#14245e] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0_0_#14245e]"
              >
                <ArrowUpDown
                  key={swapTurns}
                  className={`size-5 ${swapTurns > 0 ? "animate-spin-once" : ""}`}
                  strokeWidth={2.5}
                  aria-hidden
                />
              </button>
            </div>

            {/* To */}
            <UnitField label="To" unit={to} muted>
              <output
                aria-live="polite"
                className={`block min-h-[1em] font-display text-[clamp(2rem,6vw,3rem)] leading-none font-bold tabular-nums transition-opacity ${
                  stale ? "opacity-40" : ""
                }`}
              >
                {loading ? (
                  <span className="inline-block h-[0.8em] w-40 animate-shimmer rounded-lg bg-[linear-gradient(90deg,#e4ebf7_0%,#f4f6fb_50%,#e4ebf7_100%)] bg-[length:200%_100%]" />
                ) : result ? (
                  <CountUp key={result.requestId} value={result.output.value} />
                ) : (
                  <span className="text-ink/20">0</span>
                )}
              </output>
            </UnitField>

            <p id="convert-error" role="alert" className="min-h-6 pt-2 text-[15px] font-medium text-crimson">
              {error}
            </p>
          </div>

          {meta.category === "temperature" && <Thermometer celsius={celsius} />}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-crimson px-6 py-4 font-display text-xl font-bold text-white transition-colors hover:bg-crimson-deep disabled:cursor-wait disabled:opacity-80"
        >
          {loading && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
          {loading ? "Converting…" : stale ? "Convert again" : "Convert"}
        </button>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink-soft">Try</span>
          {meta.quickValues.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => pick(String(v))}
              className="rounded-full border-2 border-line px-3 py-1 font-display text-[15px] font-semibold tabular-nums hover:border-[var(--cat)] hover:bg-[var(--cat-soft)]"
            >
              {formatNumber(v)} {from.symbol}
            </button>
          ))}
        </div>

        {result && !stale && <ResultDetails result={result} />}
      </form>

      <RequestPanel lastCall={lastCall} />

      {recent.length > 0 && (
        <section className="rounded-2xl border-2 border-line bg-paper p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold">
              <History className="size-5 text-ink-soft" aria-hidden />
              Recent on this page
            </h2>
            <button
              type="button"
              onClick={clearRecent}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-ink-soft hover:bg-glacier"
            >
              <X className="size-3.5" aria-hidden /> Clear
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {recent.map((item) => (
              <li key={item.line + item.direction}>
                <button
                  type="button"
                  onClick={() => pick(item.input, item.direction)}
                  className="rounded-lg bg-glacier/70 px-3 py-1.5 text-left font-display font-medium tabular-nums hover:bg-[var(--cat-soft)]"
                >
                  {item.line}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function UnitField({
  label,
  unit,
  htmlFor,
  muted,
  children,
}: {
  label: string;
  unit: ConversionMeta["from"];
  htmlFor?: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border-2 px-4 pt-3 pb-4 transition-colors sm:px-5 ${
        muted ? "border-transparent bg-[var(--cat-soft)]" : "border-line bg-paper focus-within:border-ink"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-ink-soft">
          {label}
        </label>
        <span className="truncate text-sm text-ink-soft">
          {unit.name} <span className="font-display">{unit.nepali}</span>
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="min-w-0 flex-1">{children}</div>
        <span className="shrink-0 rounded-xl bg-ink px-3 py-1.5 font-display text-lg font-bold text-white">{unit.symbol}</span>
      </div>
    </div>
  );
}

function ResultDetails({ result }: { result: Success }) {
  const [copied, setCopied] = useState(false);
  const out = result.output;
  const words = out.unit.symbol === "NPR" ? inLakhCrore(out.value) : undefined;
  const text = `${formatNumber(result.input.value)} ${result.input.unit.symbol} = ${formatNumber(out.value)} ${out.unit.symbol}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (e.g. insecure context). Nothing useful to do.
    }
  }

  return (
    <div className="mt-6 animate-pop space-y-3 border-t-2 border-dashed border-line pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-semibold">
          {text}
          {words && <span className="ml-2 text-ink-soft">(Rs {words})</span>}
        </p>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-full border-2 border-line px-3 py-1 text-sm font-semibold hover:border-ink"
        >
          {copied ? <Check className="size-4 text-paddy" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="font-display text-ink-soft">
        In Nepali digits: <span className="font-semibold text-ink">{formatNepaliDigits(out.value)}</span> {out.unit.nepali}
      </p>

      <p className="rounded-xl bg-glacier/70 px-4 py-3 text-[15px] leading-relaxed">
        <span className="font-semibold">How it&apos;s worked out: </span>
        {result.formula}
      </p>

      {result.insight && (
        <p className="flex items-start gap-2.5 rounded-xl bg-[var(--cat-soft)] px-4 py-3 text-[15px] leading-relaxed text-[var(--cat-ink)]">
          <Sparkles className="mt-0.5 size-4.5 shrink-0" aria-hidden />
          {result.insight}
        </p>
      )}
    </div>
  );
}

function RequestPanel({ lastCall }: { lastCall: LastCall | null }) {
  const ok = lastCall && lastCall.status < 400;
  return (
    <section className="rounded-2xl bg-ink p-5 text-glacier">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
        <Server className="size-5 text-marigold" aria-hidden />
        Behind the scenes
      </h2>
      {lastCall ? (
        <>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-glacier/60">Request</dt>
            <dd className="font-mono break-all text-white">POST {lastCall.path}</dd>
            <dt className="text-glacier/60">Status</dt>
            <dd className="font-mono">
              <span className={ok ? "text-[#7fdca4]" : "text-marigold"}>{lastCall.status}</span>
              <span className="text-glacier/60"> in {lastCall.ms} ms, round trip</span>
            </dd>
            <dt className="text-glacier/60">Request ID</dt>
            <dd className="font-mono text-marigold">{lastCall.requestId}</dd>
          </dl>
          <p className="mt-3 text-sm leading-relaxed text-glacier/70">
            Search for this request ID in your Vercel project&apos;s Logs tab to see exactly what the server wrote while
            handling it.
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-glacier/70">
          Press Convert and the details of the request your browser sends to the Vercel Function show up here.
        </p>
      )}
    </section>
  );
}

/** Animates a number from 0 up to its value. Skipped when reduced motion is on. */
function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const start = performance.now();
    const duration = 650;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(t < 1 ? value * eased : value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{formatNumber(shown)}</span>;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Last few conversions on this page, kept in localStorage (this browser only). */
const recentListeners = new Set<() => void>();

function subscribeRecent(listener: () => void) {
  recentListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    recentListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // Storage can be unavailable (private mode). History just stays empty.
  }
}

function useRecent(slug: string) {
  const key = `naptaul:recent:${slug}`;
  const raw = useSyncExternalStore(subscribeRecent, () => readStorage(key), () => null);

  const items = useMemo<RecentItem[]>(() => {
    try {
      const saved = JSON.parse(raw ?? "[]");
      return Array.isArray(saved) ? saved.slice(0, 6) : [];
    } catch {
      return [];
    }
  }, [raw]);

  function save(next: RecentItem[]) {
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Ignore: history is a convenience.
    }
    recentListeners.forEach((l) => l());
  }

  const add = (item: RecentItem) =>
    save([item, ...items.filter((i) => !(i.line === item.line && i.direction === item.direction))].slice(0, 6));
  const clear = () => save([]);

  return [items, add, clear] as const;
}
