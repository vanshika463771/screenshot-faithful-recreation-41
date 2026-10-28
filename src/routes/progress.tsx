import { createFileRoute, Link } from "@tanstack/react-router";
import { LineChart, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageHeader, Panel, ProgressBar } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { computeStats } from "@/lib/actions";
import { resetProgress, useStore } from "@/lib/store";
import { getSubject, titleCase, type SubjectId } from "@/lib/subjects";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress & analytics — LearnMate AI" },
      { name: "description", content: "Quiz history, score trends and performance by topic, calculated from your real attempts." },
      { property: "og:title", content: "Progress — LearnMate AI" },
      { property: "og:description", content: "Track your learning progress across topics and levels." },
    ],
  }),
  component: Progress,
});

function Progress() {
  const s = useStore();
  const st = computeStats(s.attempts);

  if (!s.attempts.length) return (
    <div>
      <PageHeader eyebrow="Progress" title="Learning analytics" />
      <EmptyState icon={<LineChart />} title="No data yet" text="Your score trends and topic strengths appear after your first quiz. No fake stats here!" action={<Button asChild variant="hero"><Link to="/learn">Take your first quiz</Link></Button>} />
    </div>
  );

  const pts = s.attempts.slice(-10);
  const W = 600, H = 180;
  const x = (i: number) => (pts.length === 1 ? W / 2 : (i / (pts.length - 1)) * (W - 40) + 20);
  const y = (a: (typeof pts)[number]) => H - 20 - (a.score / a.total) * (H - 40);
  const planDone = s.plan ? s.plan.tasks.filter((t) => t.done).length : 0;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Progress" title="Learning analytics" subtitle="Everything here is calculated from your actual quiz attempts.">
        <Button variant="ghost" size="sm" onClick={() => { if (confirm("Reset all progress?")) { resetProgress(); toast.success("Progress reset"); } }}><RotateCcw /> Reset</Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Quizzes", st.total],
          ["Average", `${st.avg}%`],
          ["Strongest", st.strongest ? titleCase(st.strongest) : "—"],
          ["Plan done", s.plan ? `${planDone}/${s.plan.tasks.length}` : "—"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl glass p-5"><p className="font-display text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>
        ))}
      </div>

      <Panel>
        <h2 className="mb-4 text-xl font-semibold">Score over time</h2>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="var(--cyan)" /><stop offset="1" stopColor="var(--violet)" /></linearGradient></defs>
          {[0, 0.5, 1].map((f) => <line key={f} x1="0" x2={W} y1={H - 20 - f * (H - 40)} y2={H - 20 - f * (H - 40)} stroke="var(--border)" strokeDasharray="4 4" />)}
          <polyline fill="none" stroke="url(#lg)" strokeWidth="3" points={pts.map((a, i) => `${x(i)},${y(a)}`).join(" ")} />
          {pts.map((a, i) => <circle key={a.id} cx={x(i)} cy={y(a)} r="6" fill="var(--primary)" stroke="var(--background)" strokeWidth="2" />)}
        </svg>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-xl font-semibold">Performance by topic</h2>
          <div className="space-y-3">
            {st.concepts.map((c) => (
              <div key={c.concept}>
                <div className="mb-1 flex justify-between text-sm"><span>{titleCase(c.concept)}</span><span className={c.pct >= 60 ? "text-success" : "text-warning"}>{c.pct}%</span></div>
                <ProgressBar value={c.pct} />
              </div>
            ))}
          </div>
          {st.weak.length > 0 && <p className="mt-4 text-sm text-muted-foreground">Needs more practice: {st.weak.map(titleCase).join(", ")}</p>}
        </Panel>

        <Panel>
          <h2 className="mb-4 text-xl font-semibold">Current level</h2>
          <ul className="space-y-2">
            {(Object.entries(s.levels) as [SubjectId, string][]).map(([id, l]) => (
              <li key={id} className="flex justify-between rounded-xl bg-muted/40 p-3 text-sm"><span>{getSubject(id)?.emoji} {getSubject(id)?.name}</span><span className="capitalize text-cyan">{l}</span></li>
            ))}
          </ul>
          <h2 className="mb-3 mt-6 text-xl font-semibold">Quiz history</h2>
          <ul className="max-h-72 space-y-2 overflow-y-auto">
            {[...s.attempts].reverse().map((a) => (
              <li key={a.id} className="flex justify-between rounded-xl bg-muted/40 p-3 text-sm">
                <span>{getSubject(a.subject)?.emoji} <span className="capitalize">{a.level}</span> · {new Date(a.date).toLocaleDateString()}</span>
                <span className="font-display font-bold">{a.score}/{a.total}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
