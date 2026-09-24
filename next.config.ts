import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Makes server error stack traces point at our source files
    // (e.g. src/lib/conversions/formulas/land.ts:21) instead of compiled chunks,
    // which makes the Vercel Logs tab far more useful.
    serverSourceMaps: true,
  },
};

export default nextConfig;
