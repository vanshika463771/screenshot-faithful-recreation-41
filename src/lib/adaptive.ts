import type { Level } from "./subjects";

export type Rule = "strong" | "partial" | "support";

/** Rule A: 4–5 → strong; Rule B: 2–3 → partial; Rule C: 0–1 → support. */
export function classify(score: number): Rule {
  if (score >= 4) return "strong";
  if (score >= 2) return "partial";
  return "support";
}

export function nextLevel(level: Level): Level | null {
  return level === "easy" ? "moderate" : level === "moderate" ? "hard" : null;
}
