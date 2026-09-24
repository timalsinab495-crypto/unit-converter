import Link from "next/link";
import { DhakaBand, Pennant } from "./decor";

export function SiteHeader() {
  return (
    <header className="relative z-20">
      <DhakaBand className="h-2.5" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 rounded-lg" aria-label="Naptaul home">
          <Pennant className="h-9 w-8 transition-transform duration-300 group-hover:-rotate-6" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl font-extrabold tracking-tight">Naptaul</span>
            <span className="font-display text-sm font-semibold text-ink-soft">नापतौल</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-[15px] font-medium sm:gap-2">
          <Link href="/#conversions" className="rounded-full px-3 py-1.5 hover:bg-glacier">
            Conversions
          </Link>
          <Link href="/#behind-the-scenes" className="hidden rounded-full px-3 py-1.5 hover:bg-glacier sm:inline-block">
            How it works
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24">
      <DhakaBand className="h-4" />
      <div className="bg-ink text-glacier">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <Pennant className="h-10 w-9" />
            <div>
              <p className="font-display text-xl font-bold text-white">Naptaul</p>
              <p className="text-sm text-glacier/80">Nepali units, converted on a Vercel Function.</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-glacier/70">
            Built for learning Vercel. Money rates are sample values read from environment variables, so check a bank or
            the gold association before buying anything.
          </p>
        </div>
      </div>
    </footer>
  );
}
