import { CONCEPTS, codeExample, getSubject, titleCase, type SubjectId } from "./subjects";

export interface TutorReply { text: string; code?: string; followUp: string }

/**
 * DEMO MODE tutor: rule-based, topic-specific responses.
 * To connect a real AI later, replace this with a call to a secure server function
 * (keys stay on the server) that returns the same TutorReply shape.
 */
export function demoTutorReply(opts: {
  message: string;
  subject: SubjectId;
  topic: string;
  weak: string[];
  hinglish: boolean;
}): TutorReply {
  const subj = getSubject(opts.subject)!;
  const msg = opts.message.toLowerCase();
  const mentioned = subj.topics.find((t) => msg.includes(t)) ?? Object.keys(CONCEPTS).find((t) => msg.includes(t));
  const concept = mentioned ?? (opts.topic !== "beginner" ? opts.topic : opts.weak[0] ?? subj.topics[0]);
  const info = CONCEPTS[concept] ?? CONCEPTS.variables;
  const code = codeExample(opts.subject, concept);
  const name = titleCase(concept);
  const weakNote = opts.weak.length
    ? `\n\nI noticed from your last quiz you found ${opts.weak.map(titleCase).join(", ")} tricky, so I'm keeping this simple.`
    : "";
  const intro = opts.hinglish ? info.hinglish : info.simple;

  if (/practice|exercise|question/.test(msg)) {
    return {
      text: `Here's a ${subj.name} practice question on ${name}:\n\n1. Look at the code below. Predict the output before running it.\n2. Now change one value and predict again.${weakNote}`,
      code,
      followUp: "Tell me your predicted output and I'll check your reasoning.",
    };
  }
  if (/line by line|explain this code/.test(msg)) {
    const lines = code.split("\n").filter(Boolean);
    return {
      text: `Let's go line by line through a ${subj.name} ${name} example:\n\n` + lines.map((l, i) => `Line ${i + 1}: \`${l.trim()}\` — ${i === 0 ? "sets things up" : i === lines.length - 1 ? "produces the final result" : "continues the logic step by step"}.`).join("\n"),
      code,
      followUp: "Which line felt the least clear?",
    };
  }
  if (/example/.test(msg)) {
    return { text: `A simple ${subj.name} example of ${name}:${weakNote}`, code, followUp: "Want me to change this example so you can predict a new output?" };
  }
  return {
    text: `${name} in ${subj.name}\n\n${intro}\n\nAnalogy: ${info.analogy}${weakNote}`,
    code,
    followUp: `Can you think of where you'd use ${name} in a small program?`,
  };
}
