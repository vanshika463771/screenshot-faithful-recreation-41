import { describe, expect, it } from "vitest";
import { classify, nextLevel } from "./adaptive";
import { buildQuiz } from "./questions";

describe("adaptive rules", () => {
  it("4/5 and 5/5 are strong (recommend moderate)", () => {
    expect(classify(4)).toBe("strong");
    expect(classify(5)).toBe("strong");
    expect(nextLevel("easy")).toBe("moderate");
  });
  it("2/5 and 3/5 are partial", () => {
    expect(classify(2)).toBe("partial");
    expect(classify(3)).toBe("partial");
  });
  it("0/5 and 1/5 need support", () => {
    expect(classify(0)).toBe("support");
    expect(classify(1)).toBe("support");
  });
  it("quizzes have exactly 5 questions and differ by language", () => {
    const py = buildQuiz("python", "easy");
    const c = buildQuiz("c", "easy");
    expect(py).toHaveLength(5);
    expect(py.some((q) => c.find((x) => x.text === q.text))).toBe(false);
  });
});
