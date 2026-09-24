import type { NextRequest } from "next/server";
import { getConversion } from "@/lib/conversions/catalog";
import { runFormula } from "@/lib/conversions/formulas";
import type { ConvertResponse, Direction } from "@/lib/conversions/types";
import { formatNumber as fmt } from "@/lib/format";
import { logger } from "@/lib/logger";
import { getVisitor } from "@/lib/visitor";

// POST /api/convert/<slug>
// Body: { "value": "3.5", "direction": "forward" | "reverse" }
//
// On Vercel this file becomes a serverless function. Each time someone
// presses "Convert", it runs once and everything it logs appears in
// Project → Logs, grouped under this request.

const MAX_VALUE = 1e12;

export async function POST(request: NextRequest, ctx: RouteContext<"/api/convert/[slug]">) {
  const startedAt = performance.now();
  const requestId = crypto.randomUUID().slice(0, 8);
  const { slug } = await ctx.params;
  const visitor = getVisitor(request.headers);
  const who = { requestId, ip: visitor.ip, location: visitor.location, vercelId: visitor.vercelId };

  const reply = (body: ConvertResponse, status = 200) =>
    Response.json(body, { status, headers: { "x-request-id": requestId } });

  // 1. Does this conversion exist?
  const meta = getConversion(slug);
  if (!meta) {
    logger.warn("unknown_conversion", `Someone asked for "${slug}", which doesn't exist`, { slug, ...who });
    return reply({ ok: false, requestId, error: `There's no conversion called "${slug}".` }, 404);
  }

  // 2. Read and check the input.
  const body = await request.json().catch(() => null);
  const rawValue = String(body?.value ?? "").replace(/,/g, "").trim();
  const value = Number(rawValue);
  const direction: Direction = body?.direction === "reverse" ? "reverse" : "forward";
  const [fromUnit, toUnit] = direction === "forward" ? [meta.from, meta.to] : [meta.to, meta.from];

  let problem: string | null = null;
  if (rawValue === "" || !Number.isFinite(value)) problem = "Enter a number, like 12 or 3.5.";
  else if (value < 0 && !meta.allowNegative) problem = `${fromUnit.name} can't be negative.`;
  else if (Math.abs(value) > MAX_VALUE) problem = "That number is too big. Try something under 1,00,000 crore.";

  if (problem) {
    logger.warn("invalid_input", `${slug}: rejected input "${rawValue}" (${problem})`, {
      slug,
      received: body?.value ?? null,
      ...who,
    });
    return reply({ ok: false, requestId, error: problem }, 400);
  }

  logger.info("convert_request", `${slug}: ${fmt(value)} ${fromUnit.symbol} → ${toUnit.symbol}`, {
    slug,
    value,
    direction,
    ...who,
    browser: visitor.browser,
  });

  // 3. Do the maths.
  try {
    const out = runFormula(slug, value, direction);
    const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;

    logger.info(
      "convert_success",
      `${fmt(value)} ${fromUnit.symbol} = ${fmt(out.result)} ${toUnit.symbol} (took ${durationMs} ms)`,
      {
        slug,
        input: value,
        result: out.result,
        direction,
        durationMs,
        requestId,
        ...(out.rate && { rate: `${out.rate.name}=${out.rate.value} (${out.rate.source})` }),
      },
    );

    return reply({
      ok: true,
      requestId,
      input: { value, unit: fromUnit },
      output: { value: out.result, unit: toUnit },
      formula: out.formula,
      insight: out.insight,
      rate: out.rate,
      durationMs,
    });
  } catch (error) {
    // Something in the formula threw. Log everything we know so it can be
    // debugged from the Vercel Logs tab, then tell the browser it failed.
    logger.error("convert_crash", `${slug} crashed while converting ${fmt(value)} ${fromUnit.symbol} → ${toUnit.symbol}`, error, {
      slug,
      value,
      direction,
      ...who,
    });
    return reply({ ok: false, requestId, error: "The server crashed while doing this conversion." }, 500);
  }
}
