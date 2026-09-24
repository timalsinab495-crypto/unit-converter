import type { Metadata } from "next";
import { Baloo_2, Mukta } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

// Both families include Devanagari, so Nepali text matches the English around it.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "devanagari"],
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Naptaul, the Nepali unit converter",
    template: "%s | Naptaul",
  },
  description:
    "Convert ropani, aana, bigha, dharni, pau, tola and more. A unit converter for the way Nepal measures, with rupee rates from environment variables.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${baloo.variable} ${mukta.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
