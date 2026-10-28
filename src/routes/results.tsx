import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Bot, CalendarCheck, CheckCircle2, ListChecks, PartyPopper, RotateCcw, Rocket, XCircle, HeartHandshake, Flag } from "lucide-react";
import { CodeBlock, EmptyState, PageHeader, Panel, ProgressBar } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { startQuiz } from "@/lib/actions";
import { classify, nextLevel } from "@/lib/adaptive";
import { useStore } from "@/lib/store";
import { CONCEPTS, codeExample, getSubject, titleCase } from "@/lib/subjects";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your quiz results — LearnMate AI" },
      { name: "description", content: "See your score, explanations and your personalised next step." },
      { property: "og:title", content: "Quiz results — LearnMate AI" },
      { property: "og:description", content: "Score, explanations and an adaptive recommendation." },
    ],
  }),
  component: Results,
});

function Results() {
  const { attempts } = useStore();
  const navigate = useNavigate();
  const a = attempts.at(-1);
  if (!a) return <EmptyState icon={<ListChecks />} title="No results yet" text="Finish a quiz to see your score and recommendations." action={<Button asChild variant="hero"><Link to="/learn">Start Learning</Link></Button>} />;

  const subj = getSubject(a.subject)!;
  const rule = classify(a.score);
  const pct = Math.round((a.score / a.total) * 100);
  const up = nextLevel(a.level);

  const go = (level = a.level, focus: string[] = [], retake = false) => {
    startQuiz(a.subject, a.topic, level, focus, retake);
    navigate({ to: "/quiz" });
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={`${subj.emoji} ${subj.name} · ${a.level}`} title="Your results" />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Panel className="flex flex-col items-center text-center">
          <div className="relative grid size-40 place-items-center rounded-full bg-glow p-1.5 shadow-glow">
            <div className="grid size-full place-items-center rounded-full bg-card">
              <div>
                <p className="font-display text-5xl font-bold">{a.score}<span className="text-2xl text-muted-foreground">/{a.total}</span></p>
                <p className="text-sm text-muted-foreground">{pct}%</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{a.score} correct answer{a.score === 1 ? "" : "s"}</p>
          {a.wrongConcepts.length > 0 && (
            <div className="mt-4 w-full text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Needs improvement</p>
              <div className="flex flex-wrap gap-2">{a.wrongConcepts.map((c) => <span key={c} className="rounded-full bg-destructive/20 px-3 py-1 text-xs">{titleCase(c)}</span>)}</div>
            </div>
          )}
        </Panel>

        {rule === "strong" && (
          <Panel className="border-success/40">
            <PartyPopper className="size-8 text-success" />
            <h2 className="mt-3 text-2xl font-semibold">Brilliant work! 🎉</h2>
            <p className="mt-2 text-muted-foreground">
              {up ? <>You've shown strong understanding at <b className="capitalize">{a.level}</b> level. You're ready for <b className="capitalize">{up}</b> — new, more challenging questions on applying and tracing code.</> : <>You've conquered the <b>Hard</b> level in {subj.name}. Try another language or a new topic!</>}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {up && <Button variant="hero" onClick={() => go(up)}><Rocket /> Start {up} quiz</Button>}
              <Button variant="glass" onClick={() => go(a.level)}><RotateCcw /> Practise more at {a.level}</Button>
              <Button asChild variant="glass"><Link to="/feedback"><Flag /> Finish session</Link></Button>
            </div>
          </Panel>
        )}

        {rule === "partial" && (
          <Panel className="border-warning/40">
            <BookOpen className="size-8 text-warning" />
            <h2 className="mt-3 text-2xl font-semibold">You're getting there!</h2>
            <p className="mt-2 text-muted-foreground">You understand part of this. Let's strengthen the concepts you missed, then try a fresh set of questions.</p>
            <div className="mt-5 space-y-5">
              {a.wrongConcepts.map((c) => (
                <div key={c} className="rounded-xl bg-muted/40 p-4">
                  <p className="font-semibold text-cyan">{titleCase(c)}</p>
                  <p className="mt-1 text-sm">{CONCEPTS[c]?.simple}</p>
                  <p className="mt-1 text-sm text-muted-foreground">💡 {CONCEPTS[c]?.analogy}</p>
                  <div className="mt-3"><CodeBlock code={codeExample(a.subject, c)} /></div>
                  <p className="mt-3 text-sm"><b>Practice:</b> predict the output of the code above, then change one value and predict again.</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="hero" onClick={() => go(a.level, a.wrongConcepts, true)}><RotateCcw /> Try another attempt</Button>
              <Button asChild variant="glass"><Link to="/plan"><CalendarCheck /> View study plan</Link></Button>
              <Button asChild variant="glass"><Link to="/feedback"><Flag /> Finish session</Link></Button>
            </div>
          </Panel>
        )}

        {rule === "support" && (
          <Panel className="border-violet/40">
            <HeartHandshake className="size-8 text-violet" />
            <h2 className="mt-3 text-2xl font-semibold">Every expert started here 💜</h2>
            <p className="mt-2 text-muted-foreground">Learning takes practice, and mistakes show us exactly what to focus on. Let's slow down and understand {a.wrongConcepts.map(titleCase).join(", ")} together.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="hero"><Link to="/support"><Bot /> Open AI Tutor explanation</Link></Button>
              <Button asChild variant="glass"><Link to="/plan"><CalendarCheck /> View study plan</Link></Button>
            </div>
          </Panel>
        )}
      </div>

      <Panel>
        <h2 className="mb-4 text-xl font-semibold">Answer review</h2>
        <div className="space-y-4">
          {a.questions.map((q, i) => {
            const ok = a.answers[i] === q.answer;
            return (
              <div key={q.id} className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  {ok ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" /> : <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />}
                  <div className="flex-1 space-y-2">
                    <p className="font-medium">{i + 1}. {q.text}</p>
                    {q.code && <CodeBlock code={q.code} />}
                    {!ok && <p className="text-sm text-destructive">Your answer: <span className="font-mono">{q.options[a.answers[i]]}</span></p>}
                    <p className="text-sm text-success">Correct: <span className="font-mono">{q.options[q.answer]}</span></p>
                    <p className="text-sm text-muted-foreground">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4"><ProgressBar value={pct} /></div>
      </Panel>
    </div>
  );
}
