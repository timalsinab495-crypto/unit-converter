import "server-only";
import type { Direction } from "../types";
import type { Formula, FormulaResult } from "./helpers";
import { everydayFormulas } from "./everyday";
import { landFormulas } from "./land";
import { moneyFormulas } from "./money";
import { temperatureFormulas } from "./temperature";
import { weightFormulas } from "./weight";

const FORMULAS: Record<string, Formula> = {
  ...landFormulas,
  ...weightFormulas,
  ...temperatureFormulas,
  ...everydayFormulas,
  ...moneyFormulas,
};

export function runFormula(slug: string, value: number, direction: Direction): FormulaResult {
  const formula = FORMULAS[slug];
  if (!formula) throw new Error(`No formula registered for "${slug}"`);
  return formula(value, direction);
}
