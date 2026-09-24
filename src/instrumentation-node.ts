// Node.js-only startup code, loaded from instrumentation.ts.

// Map production stack traces back to our TypeScript files, so an error in the
// logs says "src/lib/.../land.ts:21" instead of ".next/server/chunks/abc.js:1:31637".
// Works together with `serverSourceMaps: true` in next.config.ts.
process.setSourceMapsEnabled(true);

export {};
