"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, ClipboardCheck, GitBranch, MessageCircleQuestion, ScanSearch, Sparkles } from "lucide-react";
import { useState } from "react";

const INTERVIEW_FLOW = [
  { step: "01", title: "Start with the learner", label: "Candidate context", detail: "The session begins with the candidate's completed missions, skipped topics, retries, and experience level — so the first question has a real reason to exist.", prompt: "You completed RAG basics, but skipped production monitoring. Where would you like to begin?", outcome: "Questions are anchored to actual learning, not a generic question bank.", icon: ScanSearch },
  { step: "02", title: "Keep the thread", label: "Conversation context", detail: "Each response remains part of the active interview, so the agent can continue the same line of reasoning instead of resetting at every turn.", prompt: "You mentioned chunking strategy. What trade-off did you make between recall and answer precision?", outcome: "The conversation feels continuous and gives candidates room to explain their reasoning.", icon: MessageCircleQuestion },
  { step: "03", title: "Probe with purpose", label: "Adaptive follow-up", detail: "Short or vague answers trigger one clarifying follow-up. Strong answers move to another relevant curriculum area, preserving momentum while testing depth.", prompt: "Before we move on, give me one concrete example of how you would validate that choice.", outcome: "The interview adapts to the answer instead of feeling like a scripted questionnaire.", icon: GitBranch },
  { step: "04", title: "Leave with a plan", label: "Actionable recap", detail: "After a rigorous eight-question conversation across the curriculum, the candidate receives strengths, focus areas, and next steps they can use immediately.", prompt: "Your interview recap is ready: keep your retrieval examples, strengthen production-readiness stories.", outcome: "Every practice session ends with a useful next move, not just a score.", icon: ClipboardCheck },
];

export default function ArchitectureSection() {
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeFlow = INTERVIEW_FLOW[activeStep];
  const ActiveIcon = activeFlow.icon;

  return (
    <section id="architecture" className="relative w-full border-t border-aqua-spotlight/20 bg-slate-midnight px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5 }} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-baseline space-x-4"><span className="font-mono text-sm font-bold tracking-widest text-cyan-accent">03 —</span><h2 className="font-display text-6xl font-bold tracking-wider text-cream-paper uppercase md:text-8xl">A real <span className="text-cyan-accent">interview flow</span></h2></div>
            <p className="max-w-2xl text-base leading-relaxed text-cream-muted">The experience is designed to feel like a thoughtful technical conversation: context first, follow-up where it matters, and a practical recap at the end.</p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-aqua-spotlight/50 bg-slate-deep px-4 py-2 font-mono text-xs text-cream-muted md:self-auto"><Sparkles className="h-4 w-4 text-cyan-accent" />One question at a time</div>
        </motion.div>

        <div className="mt-12 rounded-3xl border border-aqua-spotlight/40 bg-gradient-to-b from-slate-deep to-slate-midnight p-5 shadow-2xl md:p-8">
          <div className="grid gap-3 md:grid-cols-4">
            {INTERVIEW_FLOW.map((flow, index) => {
              const Icon = flow.icon;
              const isActive = activeStep === index;
              return <button key={flow.step} type="button" onClick={() => setActiveStep(index)} aria-pressed={isActive} className={`group rounded-2xl border p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent ${isActive ? "border-cyan-accent bg-cyan-accent/10 shadow-glow-cyan" : "border-aqua-spotlight/30 bg-slate-midnight/50 hover:-translate-y-1 hover:border-cyan-accent/55"}`}>
                <div className="flex items-center justify-between"><span className="font-mono text-[11px] font-bold tracking-widest text-cyan-accent">STEP {flow.step}</span><Icon className={`h-4 w-4 ${isActive ? "text-cyan-accent" : "text-cream-muted group-hover:text-cyan-accent"}`} /></div>
                <div className="mt-5 text-sm font-bold text-cream-paper">{flow.label}</div>
                <div className={`mt-3 h-1 rounded-full transition-colors ${isActive ? "bg-cyan-accent" : "bg-aqua-spotlight/50 group-hover:bg-cyan-accent/50"}`} />
              </button>;
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-aqua-spotlight/40 bg-slate-midnight/80 p-6 md:p-8">
            <AnimatePresence mode="wait" initial={!shouldReduceMotion}>
              <motion.div key={activeFlow.step} initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -18 }} transition={{ duration: shouldReduceMotion ? 0 : 0.28 }} className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3 text-cyan-accent"><div className="rounded-xl border border-cyan-accent/30 bg-cyan-accent/10 p-2.5"><ActiveIcon className="h-5 w-5" /></div><span className="font-mono text-xs font-bold tracking-widest uppercase">{activeFlow.label}</span></div>
                  <h3 className="mt-5 text-3xl font-bold text-cream-paper">{activeFlow.title}</h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-cream-muted">{activeFlow.detail}</p>
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan-accent/20 bg-cyan-accent/5 p-4 text-sm text-cream-paper"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-accent" /><span>{activeFlow.outcome}</span></div>
                </div>
                <div className="relative rounded-2xl border border-aqua-spotlight/40 bg-slate-deep/70 p-6">
                  <div className="flex items-center justify-between border-b border-aqua-spotlight/30 pb-4 font-mono text-[11px] tracking-wider text-cream-muted uppercase"><span>What the candidate experiences</span><span className="text-cyan-accent">LIVE THREAD</span></div>
                  <div className="mt-6 flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-accent/30 bg-cyan-accent/10 text-cyan-accent"><ActiveIcon className="h-4 w-4" /></div><p className="rounded-2xl rounded-tl-none border border-aqua-spotlight/40 bg-slate-midnight px-5 py-4 text-sm leading-relaxed text-cream-paper">{activeFlow.prompt}</p></div>
                  <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-cyan-accent"><span className="h-1.5 w-1.5 rounded-full bg-cyan-accent animate-pulse" />SESSION CONTEXT ACTIVE</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex items-center justify-between font-mono text-xs text-cream-muted"><span>INTERVIEW PROGRESS</span><span className="text-cyan-accent">{activeStep + 1} / {INTERVIEW_FLOW.length}</span></div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-aqua-spotlight/35"><motion.div animate={{ width: `${((activeStep + 1) / INTERVIEW_FLOW.length) * 100}%` }} transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: "easeOut" }} className="h-full rounded-full bg-cyan-accent" /></div>
        </div>
      </div>
    </section>
  );
}
