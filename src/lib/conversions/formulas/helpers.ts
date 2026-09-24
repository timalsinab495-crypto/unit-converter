import type { Direction, RateInfo } from "../types";
import { formatNumber as fmt } from "@/lib/format";

export interface FormulaResult {
  result: number;
  /** Human readable working, e.g. "1 ropani = 5,476 sq ft, so 3 × 5,476 = 16,428 sq ft" */
  formula: string;
  /** A relatable comparison, e.g. "About 6 badminton courts" */
  insight?: string;
  /** Set when the conversion used a rate from an environment variable */
  rate?: RateInfo;
}

export type Formula = (value: number, direction: Direction) => FormulaResult;

/** Values in both units, whichever direction the user converted in. */
export interface BothSides {
  fromValue: number;
  toValue: number;
  direction: Direction;
}

interface LinearOptions {
  from: string;
  to: string;
  /** Use when the natural fact is "1 <from> = N <to>" */
  toPerFrom?: number;
  /** Use when the natural fact is "1 <to> = N <from>" */
  fromPerTo?: number;
  insight?: (sides: BothSides) => string | undefined;
  rate?: RateInfo;
}

/** Builds a formula for conversions that are a single multiply or divide. */
export function linear(opts: LinearOptions): Formula {
  return (value, direction) => {
    const { from, to } = opts;
    let result: number;
    let formula: string;

    if (opts.toPerFrom !== undefined) {
      const k = opts.toPerFrom;
      result = direction === "forward" ? value * k : value / k;
      formula =
        direction === "forward"
          ? `1 ${from} = ${fmt(k)} ${to}, so ${fmt(value)} × ${fmt(k)} = ${fmt(result)} ${to}`
          : `1 ${from} = ${fmt(k)} ${to}, so ${fmt(value)} ÷ ${fmt(k)} = ${fmt(result)} ${from}`;
    } else if (opts.fromPerTo !== undefined) {
      const k = opts.fromPerTo;
      result = direction === "forward" ? value / k : value * k;
      formula =
        direction === "forward"
          ? `1 ${to} = ${fmt(k)} ${from}, so ${fmt(value)} ÷ ${fmt(k)} = ${fmt(result)} ${to}`
          : `1 ${to} = ${fmt(k)} ${from}, so ${fmt(value)} × ${fmt(k)} = ${fmt(result)} ${from}`;
    } else {
      throw new Error("linear() needs either toPerFrom or fromPerTo");
    }

    const sides: BothSides =
      direction === "forward"
        ? { fromValue: value, toValue: result, direction }
        : { fromValue: result, toValue: value, direction };

    return { result, formula, insight: opts.insight?.(sides), rate: opts.rate };
  };
}

/** "3 badminton courts", rounding to something friendly to read. */
export function roughCount(n: number, singular: string, plural = `${singular}s`): string {
  const rounded = n >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
  return `${fmt(rounded)} ${rounded === 1 ? singular : plural}`;
}
