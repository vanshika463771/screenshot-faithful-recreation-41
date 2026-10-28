import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { setState } from "@/lib/store";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Session feedback — LearnMate AI" },
      { name: "description", content: "Tell us how your learning session went." },
      { property: "og:title", content: "Feedback — LearnMate AI" },
      { property: "og:description", content: "Share feedback on your LearnMate AI session." },
    ],
  }),
  component: FeedbackPage,
});

function Choice({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => <button type="button" key={o} onClick={() => onChange(o)} className={`rounded-full px-4 py-1.5 text-sm transition ${value === o ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{o}</button>)}
    </div>
  );
}

function FeedbackPage() {
  const [f, setF] = useState({ ease: 0, helped: "", strongest: "", confusing: "", liked: "", improve: "", recommend: "" });
  const [sent, setSent] = useState(false);
  const up = (k: keyof typeof f) => (v: string | number) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.ease || !f.helped || !f.recommend) { toast.error("Please answer the rating, helpfulness and recommendation questions."); return; }
    try {
      setState((s) => ({ feedback: [...s.feedback, { ...f, date: Date.now() }] }));
      setSent(true);
    } catch {
      toast.error("Couldn't save your feedback. Please try again.");
    }
  };

  if (sent) return (
    <div className="mx-auto max-w-lg py-16 text-center animate-rise">
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-brand shadow-glow"><Heart className="size-9 text-primary-foreground" /></div>
      <h1 className="mt-6 text-4xl font-bold">Thank you! 💙</h1>
      <p className="mt-3 text-muted-foreground">Your feedback helps LearnMate learn how to teach you better.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild variant="hero"><Link to="/">Back to dashboard</Link></Button>
        <Button asChild variant="glass"><Link to="/progress">See progress</Link></Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader eyebrow="Session complete" title="How was your learning session?" subtitle="Takes under a minute." />
      <form onSubmit={submit}>
        <Panel className="space-y-6">
          <div>
            <p className="mb-2 font-medium">1. How easy was it to understand the explanation?</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => up("ease")(n)} aria-label={`${n} stars`}>
                  <Star className={`size-8 transition ${n <= f.ease ? "fill-warning text-warning" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>
          <div><p className="mb-2 font-medium">2. Did the personalised explanation help you?</p><Choice options={["Yes", "Somewhat", "No"]} value={f.helped} onChange={up("helped")} /></div>
          <div><p className="mb-2 font-medium">3. Which topic do you feel strongest in now?</p><Input value={f.strongest} onChange={(e) => up("strongest")(e.target.value)} placeholder="e.g. Loops" className="rounded-xl" /></div>
          <div><p className="mb-2 font-medium">4. Which topic still confuses you?</p><Input value={f.confusing} onChange={(e) => up("confusing")(e.target.value)} placeholder="e.g. Pointers" className="rounded-xl" /></div>
          <div><p className="mb-2 font-medium">5. What did you like most?</p><Textarea value={f.liked} onChange={(e) => up("liked")(e.target.value)} className="rounded-xl" /></div>
          <div><p className="mb-2 font-medium">6. What would you like us to improve?</p><Textarea value={f.improve} onChange={(e) => up("improve")(e.target.value)} className="rounded-xl" /></div>
          <div><p className="mb-2 font-medium">7. Would you recommend LearnMate AI to another student?</p><Choice options={["Yes", "No"]} value={f.recommend} onChange={up("recommend")} /></div>
          <Button type="submit" variant="hero" size="lg" className="w-full">Submit Feedback</Button>
        </Panel>
      </form>
    </div>
  );
}
