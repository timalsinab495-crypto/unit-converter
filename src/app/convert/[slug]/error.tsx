"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { requestIdFrom } from "@/lib/conversions/crash";

// Shown when a converter page crashes. On purpose, it does NOT show the real
// error: that stays on the server. To find out what happened, look in the logs.
export default function ConverterCrashed({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const requestId = requestIdFrom(error);
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!requestId) return;
    try {
      await navigator.clipboard.writeText(requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked. The ID is still visible to copy by hand.
    }
  }

  const steps = [
    "Open this project on vercel.com.",
    "Go to the Logs tab.",
    requestId ? "Paste the request ID into the search box, or set Level to Error." : "Set Level to Error.",
    "Read the error message, then the file name and line number under it.",
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-16">
      <div className="relative overflow-hidden rounded-[32px] border-2 border-ink bg-paper p-6 shadow-[10px_10px_0_0_#d0103a] sm:p-10">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 -bottom-10 font-display text-[9rem] leading-none font-extrabold text-crimson opacity-10 select-none sm:text-[12rem]"
        >
          ओहो!
        </span>

        <p className="relative inline-flex items-center gap-2 rounded-full bg-crimson/10 px-3 py-1 text-sm font-semibold text-crimson-deep">
          <span className="size-2 rounded-full bg-crimson" aria-hidden />
          Server error (HTTP 500)
        </p>
        <h1 className="relative mt-4 font-display text-4xl leading-tight font-extrabold sm:text-5xl">
          This converter crashed
        </h1>
        <p className="relative mt-3 max-w-xl text-lg leading-relaxed text-ink-soft">
          The server ran into an error while converting your number. The page can&apos;t tell you what went wrong, but
          the server wrote everything down in the logs.
        </p>

        {requestId && (
          <div className="relative mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-white">
            <span className="text-sm text-glacier/70">Request ID</span>
            <code className="font-mono text-lg font-semibold text-marigold">{requestId}</code>
            <button
              type="button"
              onClick={copy}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1 text-sm font-semibold hover:bg-white/10"
            >
              {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}

        <h2 className="relative mt-8 font-display text-2xl font-bold">Find the error in the logs</h2>
        <ol className="relative mt-4 space-y-3">
          {steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-marigold font-display font-bold">
                {i + 1}
              </span>
              <span className="pt-0.5 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
        <p className="relative mt-4 text-sm text-ink-soft">
          Running it on your own computer? The same log lines are in the terminal where <code>npm run dev</code> is
          running.
        </p>

        <div className="relative mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 font-display text-lg font-bold text-white hover:bg-crimson-deep"
          >
            <RotateCcw className="size-4.5" aria-hidden />
            Try again
          </button>
          <Link
            href="/#conversions"
            className="rounded-full border-2 border-ink px-5 py-2 font-display text-lg font-semibold hover:bg-ink hover:text-white"
          >
            All conversions
          </Link>
        </div>
      </div>
    </div>
  );
}
