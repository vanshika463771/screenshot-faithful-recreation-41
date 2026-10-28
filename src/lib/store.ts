import { useSyncExternalStore } from "react";
import type { Question } from "./questions";
import { CONCEPTS, getSubject, titleCase, type Level, type SubjectId } from "./subjects";

export interface Attempt {
  id: string;
  date: number;
  subject: SubjectId;
  topic: string;
  level: Level;
  score: number;
  total: number;
  wrongConcepts: string[];
  questionIds: string[];
  answers: number[];
  questions: Question[];
}

export interface ActiveQuiz {
  subject: SubjectId;
  topic: string;
  level: Level;
  questions: Question[];
  retake: boolean;
}

export interface PlanTask { id: string; day: number; label: string; done: boolean }
export interface StudyPlan { subject: SubjectId; weak: string[]; createdAt: number; tasks: PlanTask[] }

export interface Feedback { date: number; ease: number; helped: string; strongest: string; confusing: string; liked: string; improve: string; recommend: string }

export interface State {
  subject: SubjectId | null;
  topic: string | null;
  levels: Partial<Record<SubjectId, Level>>;
  quiz: ActiveQuiz | null;
  attempts: Attempt[];
  plan: StudyPlan | null;
  feedback: Feedback[];
}

const KEY = "learnmate-ai-v1";
const initial: State = { subject: null, topic: null, levels: {}, quiz: null, attempts: [], plan: null, feedback: [] };

let state: State = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    state = initial;
  }
}

export function setState(update: Partial<State> | ((s: State) => Partial<State>)) {
  load();
  const patch = typeof update === "function" ? update(state) : update;
  state = { ...state, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or disabled */ }
  listeners.forEach((l) => l());
}

export function getState() { load(); return state; }

export function useStore(): State {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => { load(); return state; },
    () => initial,
  );
}

export function resetProgress() {
  state = initial;
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export function generatePlan(subject: SubjectId, weak: string[]): StudyPlan {
  const subj = getSubject(subject)!;
  const ordered = [...weak].sort((a, b) => subj.topics.indexOf(a) - subj.topics.indexOf(b));
  const tasks: PlanTask[] = [];
  let n = 0;
  const add = (day: number, label: string) => tasks.push({ id: `t${n++}`, day, label, done: false });
  ordered.forEach((c, i) => {
    const day = Math.min(i + 1, 2);
    add(day, `Read the revision note on ${titleCase(c)} and re-type the example code yourself`);
    add(day, `Ask the AI Tutor for a beginner explanation of ${titleCase(c)}`);
    add(day, `Solve 2 practice exercises on ${titleCase(c)}`);
  });
  if (!ordered.length) add(1, `Review ${subj.name} fundamentals`);
  add(3, "Summarise each weak concept in one sentence in your own words");
  add(3, "Retake the quiz on your weak concepts");
  return { subject, weak: ordered, createdAt: Date.now(), tasks };
}

export function conceptNote(c: string) {
  return CONCEPTS[c]?.simple ?? `Review the basics of ${c}.`;
}
