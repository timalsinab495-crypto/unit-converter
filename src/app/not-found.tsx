import Link from "next/link";
import { Mountains } from "@/components/decor";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-6 text-center sm:px-6">
        <p aria-hidden className="font-display text-[7rem] leading-none font-extrabold text-ink/10">४०४</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">This page got lost on the trail</h1>
        <p className="mt-3 text-lg text-ink-soft">
          There&apos;s no conversion at this address. Head back and pick one from the list.
        </p>
        <Link
          href="/#conversions"
          className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 font-display text-lg font-bold text-white shadow-[4px_4px_0_0_#14245e]"
        >
          See all conversions
        </Link>
      </div>
      <Mountains className="mt-8 h-32 sm:h-44" id="notfound-snow" />
    </div>
  );
}
