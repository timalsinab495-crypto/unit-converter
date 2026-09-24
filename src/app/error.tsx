"use client";

import Link from "next/link";

export default function SomethingBroke({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 text-center sm:px-6">
      <p aria-hidden className="font-display text-8xl font-extrabold text-crimson/20">ओहो!</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">Something broke on this page</h1>
      <p className="mt-3 text-lg text-ink-soft">
        The error was written to the server logs
        {error.digest ? (
          <>
            {" "}
            with the ID <code className="rounded bg-glacier px-1.5 py-0.5 font-mono text-ink">{error.digest}</code>
          </>
        ) : null}
        .
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-crimson px-5 py-2.5 font-display text-lg font-bold text-white hover:bg-crimson-deep"
        >
          Try again
        </button>
        <Link href="/" className="rounded-full border-2 border-ink px-5 py-2 font-display text-lg font-semibold hover:bg-ink hover:text-white">
          Go home
        </Link>
      </div>
    </div>
  );
}
