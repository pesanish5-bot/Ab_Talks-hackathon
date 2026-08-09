"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, Award, CheckCircle2, Target, type LucideIcon } from "lucide-react";

const FEEDBACK = {
  summary:
    "Sarah completed a rigorous interview across retrieval, prompting, application delivery, and production readiness. Her strongest answers connected implementation choices to measurable outcomes.",
  strengths: [
    "Explains vector-search trade-offs with confidence.",
    "Connects API design decisions to the user experience.",
    "Shows consistent progress across the cohort.",
  ],
  focus: [
    "Make monitoring and observability examples more concrete.",
    "Practice explaining prompt-safety decisions aloud.",
    "Rehearse deployment trade-offs with a real project story.",
  ],
  next: [
    "Pick one production incident or project decision to unpack.",
    "Revisit the observability mission and write down your approach.",
    "Run another practice interview to test the improvement.",
  ],
};

export default function FeedbackSection() {
  const shouldReduceMotion = useReducedMotion();
  const reveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="feedback" className="relative w-full overflow-hidden border-t border-aqua-spotlight/20 bg-slate-deep/40 px-6 py-28">
      <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-cyan-accent/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={reveal}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <div className="mb-2 flex items-baseline space-x-4">
              <span className="font-mono text-sm font-bold tracking-widest text-cyan-accent">04 —</span>
              <h2 className="font-display text-6xl font-bold tracking-wider text-cream-paper uppercase md:text-8xl">
                Ready for the <span className="text-cyan-accent">real room</span>
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-cream-muted">
              The interview ends with a clear picture of what you explain well, what needs another pass, and exactly how to prepare for the next conversation.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-accent/30 bg-cyan-accent/10 px-4 py-2 font-mono text-xs font-semibold tracking-wider text-cyan-accent uppercase md:self-auto">
            <Target className="h-4 w-4" />
            From reflection to action
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={reveal}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : 0.08 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-aqua-spotlight/50 bg-slate-midnight p-6 shadow-card-hover md:p-10"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent to-transparent" />
          <div className="flex flex-col justify-between gap-4 border-b border-aqua-spotlight/30 pb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-cyan-accent/30 bg-cyan-accent/10 p-2.5 text-cyan-accent"><Award className="h-6 w-6" /></div>
              <div>
                <h3 className="text-lg font-bold text-cream-paper">YOUR INTERVIEW RECAP</h3>
                <p className="mt-0.5 font-mono text-xs text-cream-muted">Sarah Johnson · Senior Data Engineer · Completed</p>
              </div>
            </div>
            <div className="rounded-full border border-cyan-accent/30 bg-cyan-accent/10 px-3 py-1.5 font-mono text-xs font-bold text-cyan-accent">8 QUESTIONS · 4+ TOPICS</div>
          </div>

          <div className="mt-6 rounded-2xl border border-aqua-spotlight/40 bg-slate-deep/70 p-6">
            <div className="font-mono text-xs tracking-[0.16em] text-cyan-accent uppercase">What came through</div>
            <p className="mt-3 max-w-4xl text-base leading-relaxed text-cream-paper/90">{FEEDBACK.summary}</p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <FeedbackCard icon={CheckCircle2} title="Keep doing" items={FEEDBACK.strengths} tone="cyan" shouldReduceMotion={shouldReduceMotion} />
            <FeedbackCard icon={AlertTriangle} title="Sharpen next" items={FEEDBACK.focus} tone="amber" shouldReduceMotion={shouldReduceMotion} />
          </div>

          <motion.div
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="mt-6 rounded-2xl border border-cyan-accent/35 bg-gradient-to-r from-aqua-spotlight/40 via-slate-deep to-slate-midnight p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-mono text-xs tracking-[0.16em] text-cyan-accent uppercase">A practical plan for next time</div>
                <div className="mt-3 space-y-2">
                  {FEEDBACK.next.map((step, index) => (
                    <div key={step} className="flex items-start gap-3 text-sm text-cream-paper">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan-accent/40 font-mono text-[10px] text-cyan-accent">{index + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ArrowRight className="hidden h-6 w-6 shrink-0 text-cyan-accent sm:block" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FeedbackCard({ icon: Icon, title, items, tone, shouldReduceMotion }: { icon: LucideIcon; title: string; items: string[]; tone: "cyan" | "amber"; shouldReduceMotion: boolean | null }) {
  const isCyan = tone === "cyan";
  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
      className={`rounded-2xl border p-6 ${isCyan ? "border-cyan-accent/30 bg-cyan-accent/5" : "border-amber-500/30 bg-amber-500/5"}`}
    >
      <div className={`flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase ${isCyan ? "text-cyan-accent" : "text-amber-400"}`}><Icon className="h-4 w-4" />{title}</div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-cream-paper/90"><span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${isCyan ? "bg-cyan-accent" : "bg-amber-400"}`} />{item}</li>)}
      </ul>
    </motion.div>
  );
}
