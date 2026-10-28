import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Flame, PlayCircle, Sparkles, Target, Trophy, BookOpen } from "lucide-react";
import mascot from "@/assets/mascot.png";
import { EmptyState, Panel, ProgressBar } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { computeStats } from "@/lib/actions";
import { useStore } from "@/lib/store";
import { LEVELS, SUBJECTS, getSubject, titleCase } from "@/lib/subjects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LearnMate AI — Learn smarter. Grow faster." },
      { name: "description", content: "Your adaptive programming coach: quizzes that adjust to you, an AI tutor and a personal study plan." },
      { property: "og:title", content: "LearnMate AI — Learn smarter. Grow faster." },
      { property: "og:description", content: "Adaptive programming quizzes, an AI tutor and personalised study plans." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const s = useStore();
  const st = computeStats(s.attempts);
  const last = s.attempts.at(-1);
  const subj = s.subject ? getSubject(s.subject) : null;
  const level = s.subject ? s.levels[s.subject] : undefined;
  const planDone = s.plan ? s.plan.tasks.filter((t) => t.done).length : 0;

  const cards = [
    { label: "Quizzes completed", value: st.total, icon: Trophy },
    { label: "Average score", value: st.total ? `${st.avg}%` : "—", icon: Target },
    { label: "Strongest topic", value: st.strongest ? titleCase(st.strongest) : "—", icon: Sparkles },
    { label: "Learning streak", value: `${st.streak} day${st.streak === 1 ? "" : "s"}`, icon: Flame },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl glass p-6 md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-violet/30 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-medium text-cyan">Welcome back, Learner! 👋</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">
              Learn smarter.<br /><span className="text-gradient">Grow faster.</span>
            </h1>
            <p className="mt-4 max-w-lg text-muted-foreground">The AI that learns how you learn — quizzes adapt to your answers, and your study plan is built from your real mistakes.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg"><Link to="/learn"><PlayCircle /> Start Learning</Link></Button>
              <Button asChild variant="glass" size="lg"><Link to="/tutor"><Bot /> Ask AI Tutor</Link></Button>
            </div>
          </div>
          <img src={mascot} alt="LearnMate tutor robot" width={1024} height={1024} className="mx-auto w-44 animate-float drop-shadow-2xl md:w-64" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl glass card-hover p-5">
            <Icon className="size-5 text-cyan" />
            <p className="mt-3 font-display text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-xl font-semibold">Continue Learning</h2>
          {subj && level ? (
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-accent text-2xl">{subj.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold">{subj.name}</p>
                <p className="text-sm text-muted-foreground">{s.topic === "beginner" ? "Complete Beginner" : titleCase(s.topic ?? "")} · {titleCase(level)} level</p>
              </div>
              <Button asChild variant="hero"><Link to="/learn">Resume <ArrowRight /></Link></Button>
            </div>
          ) : (
            <EmptyState icon={<BookOpen />} title="Nothing started yet" text="Pick a language and take a 5-question diagnostic quiz to begin." action={<Button asChild variant="hero"><Link to="/learn">Choose a subject</Link></Button>} />
          )}
        </Panel>

        <Panel>
          <h2 className="mb-4 text-xl font-semibold">Your Learning Journey</h2>
          {subj && level ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                {LEVELS.map((l, i) => {
                  const reached = LEVELS.indexOf(level) >= i;
                  return (
                    <div key={l} className="flex flex-1 flex-col items-center gap-2">
                      <span className={`grid size-10 place-items-center rounded-full font-display font-bold ${reached ? "bg-brand text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                      <span className="text-xs capitalize text-muted-foreground">{l}</span>
                    </div>
                  );
                })}
              </div>
              <ProgressBar value={((LEVELS.indexOf(level) + 1) / 3) * 100} />
              {s.plan && <p className="text-sm text-muted-foreground">Study plan: {planDone}/{s.plan.tasks.length} tasks done</p>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Your Easy → Moderate → Hard path appears here after your first quiz.</p>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-xl font-semibold">Recommended for You</h2>
          {st.weak.length && last ? (
            <ul className="space-y-2">
              {st.weak.slice(0, 3).map((c) => (
                <li key={c} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                  <span>Revise <b>{titleCase(c)}</b></span>
                  <Link to="/plan" className="text-sm text-cyan hover:underline">Study plan →</Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {SUBJECTS.slice(0, 3).map((x) => (
                <Link key={x.id} to="/learn" className="rounded-xl bg-muted/50 card-hover p-3 text-center">
                  <div className="text-2xl">{x.emoji}</div>
                  <div className="mt-1 text-xs font-medium">{x.name.split(" ")[0]}</div>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel>
          <h2 className="mb-4 text-xl font-semibold">Recent Quiz Results</h2>
          {s.attempts.length ? (
            <ul className="space-y-2">
              {s.attempts.slice(-4).reverse().map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-xl bg-muted/50 p-3 text-sm">
                  <span>{getSubject(a.subject)?.emoji} {getSubject(a.subject)?.name} · <span className="capitalize">{a.level}</span></span>
                  <span className={`font-display font-bold ${a.score >= 4 ? "text-success" : a.score >= 2 ? "text-warning" : "text-destructive"}`}>{a.score}/{a.total}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No quizzes yet — your results will appear here.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
