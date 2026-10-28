import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Play, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { startQuiz } from "@/lib/actions";
import { setState, useStore } from "@/lib/store";
import { LEVELS, SUBJECTS, getSubject, titleCase, type Level, type SubjectId } from "@/lib/subjects";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Choose a subject — LearnMate AI" },
      { name: "description", content: "Pick Python, Java, R, JavaScript, C++ or C and a topic to start your adaptive quiz." },
      { property: "og:title", content: "Choose a subject — LearnMate AI" },
      { property: "og:description", content: "Pick a programming language and topic to start learning." },
    ],
  }),
  component: Learn,
});

function Learn() {
  const s = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<SubjectId | null>(null);
  const [topic, setTopic] = useState<string>("beginner");
  const subj = picked ? getSubject(picked) : null;
  const [level, setLevel] = useState<Level>("easy");

  const list = SUBJECTS.filter((x) => (x.name + x.description + x.topics.join(" ")).toLowerCase().includes(q.toLowerCase()));

  const choose = (id: SubjectId) => {
    setPicked(id);
    setTopic("beginner");
    setLevel(s.levels[id] ?? "easy");
    setState({ subject: id });
  };

  const begin = () => {
    if (!picked) return;
    startQuiz(picked, topic, level);
    navigate({ to: "/quiz" });
  };

  if (subj) {
    return (
      <div>
        <button onClick={() => setPicked(null)} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Change language</button>
        <PageHeader eyebrow={`${subj.emoji} ${subj.name}`} title="What do you want to learn?" subtitle="Start as a complete beginner, or focus on one topic. You can change this any time." />
        <Panel className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {["beginner", ...subj.topics].map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`rounded-xl border p-4 text-left transition ${topic === t ? "border-primary bg-primary/15 shadow-glow" : "border-border bg-muted/40 hover:border-primary/50"}`}
              >
                <p className="font-semibold">{t === "beginner" ? "🌱 Complete Beginner" : titleCase(t)}</p>
                <p className="text-xs text-muted-foreground">{t === "beginner" ? "A mix of all fundamentals" : "Focused questions on this topic"}</p>
              </button>
            ))}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => {
                const unlocked = LEVELS.indexOf(l) <= LEVELS.indexOf(s.levels[subj.id] ?? "easy");
                return (
                  <button key={l} disabled={!unlocked} onClick={() => setLevel(l)} className={`rounded-full px-4 py-1.5 text-sm capitalize transition disabled:opacity-40 ${level === l ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {l}{!unlocked && " 🔒"}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">New levels unlock when you score 4/5 or higher.</p>
          </div>
          <Button variant="hero" size="lg" onClick={begin}><Play /> Start {level} quiz · 5 questions</Button>
        </Panel>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="My Learning" title="Choose your language" subtitle="Each language has its own question bank across Easy, Moderate and Hard levels.">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search languages or topics…" className="h-11 rounded-xl pl-9" />
        </div>
      </PageHeader>
      {list.length === 0 && <p className="text-muted-foreground">No language matches "{q}".</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((x) => (
          <div key={x.id} className="flex flex-col rounded-2xl glass card-hover p-6">
            <div className="flex items-center justify-between">
              <span className="grid size-14 place-items-center rounded-2xl bg-accent text-3xl">{x.emoji}</span>
              {s.levels[x.id] && <span className="rounded-full bg-primary/20 px-3 py-1 text-xs capitalize text-cyan">{s.levels[x.id]}</span>}
            </div>
            <h3 className="mt-4 text-xl font-semibold">{x.name}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{x.description}</p>
            <Button variant="hero" className="mt-5" onClick={() => choose(x.id)}>Start</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
