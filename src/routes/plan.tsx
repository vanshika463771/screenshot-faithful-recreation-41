import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, Check, RotateCcw } from "lucide-react";
import { CodeBlock, EmptyState, PageHeader, Panel, ProgressBar } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { startQuiz } from "@/lib/actions";
import { conceptNote, setState, useStore } from "@/lib/store";
import { codeExample, getSubject, titleCase } from "@/lib/subjects";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Your study plan — LearnMate AI" },
      { name: "description", content: "A personalised 3-day study plan built from your actual quiz mistakes." },
      { property: "og:title", content: "Study plan — LearnMate AI" },
      { property: "og:description", content: "Daily tasks, revision notes and practice for your weak concepts." },
    ],
  }),
  component: Plan,
});

function Plan() {
  const { plan, attempts } = useStore();
  const navigate = useNavigate();
  if (!plan) return <EmptyState icon={<CalendarCheck />} title="No study plan yet" text="When you miss questions in a quiz, we build a plan from your exact mistakes." action={<Button asChild variant="hero"><Link to="/learn">Take a quiz</Link></Button>} />;

  const subj = getSubject(plan.subject)!;
  const done = plan.tasks.filter((t) => t.done).length;
  const toggle = (id: string) => setState((s) => ({ plan: s.plan && { ...s.plan, tasks: s.plan.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) } }));
  const last = attempts.filter((a) => a.subject === plan.subject).at(-1);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={`${subj.emoji} ${subj.name}`} title="Your personalised study plan" subtitle="Built from the questions you answered incorrectly." />

      <Panel>
        <div className="flex items-center justify-between text-sm"><span>Plan completion</span><span className="font-display font-bold">{done}/{plan.tasks.length}</span></div>
        <div className="mt-2"><ProgressBar value={(done / plan.tasks.length) * 100} /></div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-semibold">Weak concepts — learn in this order</h2>
          <ol className="mt-4 space-y-3">
            {plan.weak.map((c, i) => (
              <li key={c} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground">{i + 1}</span>
                <div><p className="font-semibold">{titleCase(c)}</p><p className="text-sm text-muted-foreground">{conceptNote(c)}</p></div>
              </li>
            ))}
          </ol>
          {plan.weak[0] && <p className="mt-4 rounded-xl bg-accent/50 p-3 text-sm"><b>Understand first:</b> {titleCase(plan.weak[0])} — later concepts build on it.</p>}
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold">Revision notes & practice</h2>
          <div className="mt-4 space-y-4">
            {plan.weak.map((c) => (
              <div key={c}>
                <p className="mb-2 text-sm font-semibold text-cyan">{titleCase(c)}</p>
                <CodeBlock code={codeExample(plan.subject, c)} />
                <p className="mt-2 text-sm text-muted-foreground">Exercise: rewrite this example from memory, then modify it to produce a different output.</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <h2 className="text-xl font-semibold">3-day schedule</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((d) => (
            <div key={d} className="rounded-xl bg-muted/40 p-4">
              <p className="mb-3 font-display font-bold">Day {d}</p>
              <ul className="space-y-2">
                {plan.tasks.filter((t) => t.day === d).map((t) => (
                  <li key={t.id}>
                    <button onClick={() => toggle(t.id)} className="flex w-full items-start gap-2 text-left text-sm">
                      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border ${t.done ? "border-success bg-success text-primary-foreground" : "border-border"}`}>{t.done && <Check className="size-3" />}</span>
                      <span className={t.done ? "text-muted-foreground line-through" : ""}>{t.label}</span>
                    </button>
                  </li>
                ))}
                {plan.tasks.filter((t) => t.day === d).length === 0 && <li className="text-sm text-muted-foreground">Light review day.</li>}
              </ul>
            </div>
          ))}
        </div>
        {last && (
          <Button className="mt-5" variant="hero" onClick={() => { startQuiz(plan.subject, last.topic, last.level, plan.weak, true); navigate({ to: "/quiz" }); }}>
            <RotateCcw /> Retake quiz on weak concepts
          </Button>
        )}
      </Panel>
    </div>
  );
}
