import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import mascot from "@/assets/mascot.png";
import { CodeBlock, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setState, useStore } from "@/lib/store";
import { SUBJECTS, getSubject, titleCase, type SubjectId } from "@/lib/subjects";
import { demoTutorReply, type TutorReply } from "@/lib/tutor";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "Ask AI Tutor — LearnMate AI" },
      { name: "description", content: "Ask anything about Python, Java, R, JavaScript, C++ or C and get simple explanations with code." },
      { property: "og:title", content: "Ask AI Tutor — LearnMate AI" },
      { property: "og:description", content: "Beginner-friendly programming explanations, examples and practice." },
    ],
  }),
  component: Tutor,
});

type Msg = { role: "user"; text: string } | ({ role: "bot" } & TutorReply);
const PROMPTS = ["Explain this like I am a beginner", "Give me a simple example", "Explain this code line by line", "Give me a practice question"];

function Tutor() {
  const s = useStore();
  const [subject, setSubject] = useState<SubjectId>(s.subject ?? "python");
  const [topic, setTopic] = useState<string>(s.topic ?? "beginner");
  const [hinglish, setHinglish] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const subj = getSubject(subject)!;

  useEffect(() => { if (s.subject) setSubject(s.subject); if (s.topic) setTopic(s.topic); }, [s.subject]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, thinking]);

  const weak = [...new Set(s.attempts.filter((a) => a.subject === subject).slice(-2).flatMap((a) => a.wrongConcepts))];

  const send = (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", ...demoTutorReply({ message: t, subject, topic, weak, hinglish }) }]);
      setThinking(false);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col md:h-[calc(100vh-5rem)]">
      <PageHeader eyebrow="Ask AI Tutor" title="Your personal tutor">
        <span className="self-start rounded-full border border-warning/50 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">DEMO MODE · rule-based answers, no live AI</span>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        <select value={subject} onChange={(e) => { const v = e.target.value as SubjectId; setSubject(v); setTopic("beginner"); setState({ subject: v }); }} className="h-10 rounded-xl border border-input bg-card px-3 text-sm">
          {SUBJECTS.map((x) => <option key={x.id} value={x.id}>{x.emoji} {x.name}</option>)}
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="h-10 rounded-xl border border-input bg-card px-3 text-sm">
          <option value="beginner">All fundamentals</option>
          {subj.topics.map((t) => <option key={t} value={t}>{titleCase(t)}</option>)}
        </select>
        <div className="flex rounded-xl border border-input bg-card p-1 text-sm">
          {["English", "Hinglish"].map((l) => (
            <button key={l} onClick={() => setHinglish(l === "Hinglish")} className={`rounded-lg px-3 py-1 ${(l === "Hinglish") === hinglish ? "bg-brand text-primary-foreground" : "text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl glass p-4 md:p-6">
        {msgs.length === 0 && (
          <div className="flex flex-col items-center py-6 text-center">
            <img src={mascot} alt="" width={1024} height={1024} className="w-28 animate-float" />
            <p className="mt-3 font-display text-lg font-semibold">Hi! What should we learn in {subj.name}?</p>
            {weak.length > 0 && <p className="mt-1 text-sm text-muted-foreground">I'll focus on what you found tricky: {weak.map(titleCase).join(", ")}</p>}
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`grid size-8 shrink-0 place-items-center rounded-full ${m.role === "user" ? "bg-accent" : "bg-brand"}`}>{m.role === "user" ? <User className="size-4" /> : <Bot className="size-4 text-primary-foreground" />}</span>
            <div className={`max-w-[85%] space-y-3 rounded-2xl p-4 text-sm ${m.role === "user" ? "bg-primary/25" : "bg-muted/60"}`}>
              {m.role === "bot" && <span className="text-[10px] font-semibold uppercase tracking-wider text-warning">Demo response</span>}
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              {m.role === "bot" && m.code && <CodeBlock code={m.code} />}
              {m.role === "bot" && <p className="text-cyan">🤔 {m.followUp}</p>}
            </div>
          </div>
        ))}
        {thinking && <p className="animate-pulse text-sm text-muted-foreground">Tutor is thinking…</p>}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {PROMPTS.map((p) => <button key={p} onClick={() => send(p)} className="shrink-0 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs hover:border-primary">{p}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-2 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your programming topic…" className="h-12 rounded-xl" />
        <Button type="submit" variant="hero" size="lg" disabled={!input.trim() || thinking} aria-label="Send"><Send /></Button>
      </form>
    </div>
  );
}
