"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Bot, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onLaunchPlayground: () => void;
}

export default function HeroSection({ onLaunchPlayground }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-deep/10 px-6 pb-12 pt-32 md:pb-16 md:pt-36">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_80%_15%,rgba(94,209,201,0.16),transparent_24rem),radial-gradient(circle_at_18%_86%,rgba(43,90,107,0.2),transparent_32rem),linear-gradient(135deg,rgba(8,25,35,0.2)_0%,rgba(16,49,62,0.06)_55%,rgba(8,25,35,0.24)_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] bg-[linear-gradient(to_right,#5ED1C9_1px,transparent_1px),linear-gradient(to_bottom,#5ED1C9_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute -right-24 top-24 -z-10 h-80 w-80 rounded-full bg-cyan-accent/15 blur-3xl" />

      <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 md:grid-cols-[1.04fr_0.96fr] md:gap-12 lg:gap-16">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-accent/30 bg-slate-midnight/50 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.18em] text-cyan-accent uppercase backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI interview practice, made personal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-3xl font-display text-6xl font-bold leading-[0.82] tracking-wide text-cream-paper uppercase sm:text-7xl md:text-8xl lg:text-[6.7rem]"
          >
            <span className="block">Your work.</span>
            <span className="block text-cyan-accent">Your voice.</span>
            <span className="block">Your edge.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-cream-muted md:text-lg"
          >
            Practice technical conversations around the AI work you actually completed.
            Get focused questions, surface the gaps, and walk into your next interview
            ready to explain the decisions behind your work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={onLaunchPlayground}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-accent px-6 py-4 font-mono text-sm font-bold text-slate-midnight transition-all hover:bg-cyan-glow hover:shadow-glow-cyan"
            >
              START A LIVE INTERVIEW
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <a
              href="#capabilities"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-aqua-spotlight/80 bg-slate-midnight/30 px-6 py-4 font-mono text-sm font-semibold text-cream-paper transition-colors hover:border-cyan-accent/70 hover:text-cyan-accent"
            >
              SEE HOW IT WORKS
              <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.36 }}
            className="mt-11 grid max-w-xl grid-cols-3 border-t border-aqua-spotlight/50 pt-5"
          >
            <Signal value="31 days" label="of cohort context" />
            <Signal value="8+ prompts" label="built for your profile" />
            <Signal value="1 report" label="clear next steps" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="relative aspect-[0.92] overflow-hidden rounded-[2rem] border border-cyan-accent/30 bg-slate-midnight/15 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur-[1px]">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-midnight/65 via-slate-midnight/10 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-accent/30 bg-slate-midnight/70 px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-cyan-accent uppercase backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-accent animate-pulse" />
                Practice session
              </div>
              <div className="rounded-full bg-slate-midnight/70 p-2 text-cyan-accent backdrop-blur">
                <Bot className="h-4 w-4" />
              </div>
            </div>

            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-slate-midnight/85 p-5 backdrop-blur-md">
              <div className="font-mono text-[10px] tracking-[0.16em] text-cyan-accent uppercase">
                Today&apos;s focus
              </div>
              <p className="mt-2 text-lg font-semibold leading-snug text-cream-paper">
                Explain the trade-offs behind your RAG retrieval strategy.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] text-cream-muted">
                <span>QUESTION 03 / 08</span>
                <span className="text-cyan-accent">PROFILE-LED</span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -right-2 rounded-xl border border-aqua-spotlight/70 bg-slate-deep/95 px-4 py-3 shadow-card-hover backdrop-blur md:-right-5">
            <div className="font-mono text-[10px] tracking-[0.16em] text-cream-muted uppercase">
              After the interview
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-cyan-accent">ACTION PLAN READY</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Signal({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-aqua-spotlight/50 px-3 first:pl-0 last:border-r-0 last:pr-0">
      <div className="font-mono text-sm font-bold text-cream-paper">{value}</div>
      <div className="mt-1 text-[10px] leading-snug text-cream-muted uppercase">{label}</div>
    </div>
  );
}
