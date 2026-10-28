import { buildQuiz } from "./questions";
import { generatePlan, getState, setState, type Attempt } from "./store";
import type { Level, SubjectId } from "./subjects";

export function startQuiz(subject: SubjectId, topic: string, level: Level, focus: string[] = [], retake = false) {
  const s = getState();
  const recent = s.attempts.filter((a) => a.subject === subject && a.level === level).slice(-2).flatMap((a) => a.questionIds);
  const f = focus.length ? focus : topic !== "beginner" ? [topic] : [];
  const questions = buildQuiz(subject, level, f, recent);
  setState({ subject, topic, quiz: { subject, topic, level, questions, retake } });
}

export function submitQuiz(answers: number[]): Attempt | null {
  const { quiz, levels } = getState();
  if (!quiz) return null;
  const score = quiz.questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const wrongConcepts = [...new Set(quiz.questions.filter((q, i) => answers[i] !== q.answer).map((q) => q.concept))];
  const attempt: Attempt = {
    id: crypto.randomUUID(),
    date: Date.now(),
    subject: quiz.subject,
    topic: quiz.topic,
    level: quiz.level,
    score,
    total: quiz.questions.length,
    wrongConcepts,
    questionIds: quiz.questions.map((q) => q.id),
    answers,
    questions: quiz.questions,
  };
  setState((s) => ({
    attempts: [...s.attempts, attempt],
    quiz: null,
    levels: { ...levels, [quiz.subject]: quiz.level },
    plan: wrongConcepts.length ? generatePlan(quiz.subject, wrongConcepts) : s.plan,
  }));
  return attempt;
}

export function computeStats(attempts: Attempt[]) {
  const total = attempts.length;
  const avg = total ? Math.round((attempts.reduce((n, a) => n + a.score / a.total, 0) / total) * 100) : 0;
  const byConcept: Record<string, { right: number; total: number }> = {};
  attempts.forEach((a) =>
    a.questions.forEach((q, i) => {
      const c = (byConcept[q.concept] ??= { right: 0, total: 0 });
      c.total++;
      if (a.answers[i] === q.answer) c.right++;
    }),
  );
  const concepts = Object.entries(byConcept)
    .map(([concept, v]) => ({ concept, pct: Math.round((v.right / v.total) * 100), total: v.total }))
    .sort((a, b) => b.pct - a.pct || b.total - a.total);
  const strongest = concepts.find((c) => c.pct >= 60)?.concept ?? null;
  const weak = concepts.filter((c) => c.pct < 60).map((c) => c.concept);

  const days = new Set(attempts.map((a) => new Date(a.date).toDateString()));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }

  return { total, avg, concepts, strongest, weak, streak };
}
