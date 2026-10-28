import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { CodeBlock, EmptyState, Panel, ProgressBar } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { submitQuiz } from "@/lib/actions";
import { useStore } from "@/lib/store";
import { getSubject, titleCase } from "@/lib/subjects";
import { ListChecks } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz in progress — LearnMate AI" },
      { name: "description", content: "Answer 5 questions — LearnMate adapts what comes next." },
      { property: "og:title", content: "Quiz — LearnMate AI" },
      { property: "og:description", content: "A 5-question adaptive programming quiz." },
    ],
  }),
  component: Quiz,
});

function Quiz() {
  const { quiz } = useStore();
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (!quiz) {
    return <EmptyState icon={<ListChecks />} title="No quiz in progress" text="Choose a language and topic to start a 5-question quiz." action={<Button asChild variant="hero"><Link to="/learn">Start Learning</Link></Button>} />;
  }

  const q = quiz.questions[i];
  const selected = answers[i];
  const isLast = i === quiz.questions.length - 1;
  const subj = getSubject(quiz.subject)!;

  const next = () => {
    if (selected === undefined) return;
    if (isLast) {
      submitQuiz(answers);
      navigate({ to: "/results" });
    } else setI(i + 1);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-accent px-3 py-1">{subj.emoji} {subj.name}</span>
        <span className="rounded-full bg-accent px-3 py-1 capitalize">{quiz.level}</span>
        <span className="rounded-full bg-accent px-3 py-1">{quiz.topic === "beginner" ? "Complete Beginner" : titleCase(quiz.topic)}</span>
        {quiz.retake && <span className="rounded-full bg-violet/30 px-3 py-1">Retake · weak concepts</span>}
      </div>
      <div className="mb-2 flex justify-between text-sm text-muted-foreground">
        <span>Question {i + 1} of {quiz.questions.length}</span>
        <span>{titleCase(q.concept)}</span>
      </div>
      <ProgressBar value={((i + (selected !== undefined ? 1 : 0)) / quiz.questions.length) * 100} />

      <Panel className="mt-6 animate-rise" key={q.id}>
        <h2 className="text-xl font-semibold md:text-2xl">{q.text}</h2>
        {q.code && <div className="mt-4"><CodeBlock code={q.code} /></div>}
        <div className="mt-6 grid gap-3">
          {q.options.map((o, idx) => (
            <button
              key={idx}
              onClick={() => setAnswers((a) => { const n = [...a]; n[i] = idx; return n; })}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${selected === idx ? "border-primary bg-primary/15 shadow-glow" : "border-border bg-muted/40 hover:border-primary/50"}`}
            >
              <span className={`grid size-8 shrink-0 place-items-center rounded-lg font-display text-sm font-bold ${selected === idx ? "bg-brand text-primary-foreground" : "bg-muted"}`}>
                {selected === idx ? <Check className="size-4" /> : String.fromCharCode(65 + idx)}
              </span>
              <span className="font-mono text-sm md:text-base">{o}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" disabled={i === 0} onClick={() => setI(i - 1)}><ArrowLeft /> Back</Button>
          <div className="flex items-center gap-3">
            {selected === undefined && <span className="hidden text-xs text-muted-foreground sm:inline">Select an answer to continue</span>}
            <Button variant="hero" disabled={selected === undefined} onClick={next}>
              {isLast ? "Submit quiz" : "Next"} <ArrowRight />
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
