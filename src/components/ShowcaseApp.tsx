"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import IntroductionSection from "./IntroductionSection";
import CapabilitiesSection from "./CapabilitiesSection";
import ArchitectureSection from "./ArchitectureSection";
import FeedbackSection from "./FeedbackSection";
import LivePlayground from "./LivePlayground";
import ScrollVideoBackground from "./ScrollVideoBackground";
import ScrollChapter from "./ScrollChapter";
import { Terminal, Cpu } from "lucide-react";

export default function ShowcaseApp() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
    <ScrollVideoBackground />
    <main className="cinematic-content relative z-10 min-h-screen text-cream-paper">
      {/* Navbar */}
      <Navbar onOpenPlayground={() => setIsPlaygroundOpen(true)} />

      <ScrollChapter className="scroll-chapter--hero">
        <HeroSection onLaunchPlayground={() => setIsPlaygroundOpen(true)} />
      </ScrollChapter>

      <ScrollChapter><IntroductionSection /></ScrollChapter>
      <ScrollChapter><CapabilitiesSection /></ScrollChapter>
      <ScrollChapter><ArchitectureSection /></ScrollChapter>
      <ScrollChapter><FeedbackSection /></ScrollChapter>

      {/* Interactive CTA Banner */}
      <ScrollChapter className="scroll-chapter--cta">
      <section className="relative py-24 px-6 bg-gradient-to-r from-slate-deep via-aqua-spotlight/30 to-slate-deep border-t border-aqua-spotlight/30 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent font-mono text-xs uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>ENTERPRISE HACKATHON DEMO READY</span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-paper uppercase tracking-wider">
            PRACTICE THE CONVERSATION
          </h2>

          <p className="text-cream-muted text-base max-w-xl mx-auto">
            Turn your cohort progress into a clear interview story, then leave with a focused plan for what to sharpen next.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsPlaygroundOpen(true)}
              className="px-8 py-4 rounded-xl bg-cyan-accent text-slate-midnight font-bold font-mono text-sm hover:bg-cyan-glow hover:shadow-glow-cyan transition-all flex items-center space-x-2"
            >
              <Terminal className="w-4 h-4" />
              <span>START YOUR LIVE INTERVIEW</span>
            </button>
          </div>
        </div>
      </section>
      </ScrollChapter>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-slate-midnight border-t border-aqua-spotlight/20 text-xs font-mono text-cream-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-accent" />
            <span>ABTalks 31-Day Enterprise AI Engineering Cohort Showcase</span>
          </div>

          <div>
            BUILT WITH NEXT.JS 14 • TAILWIND CSS • FRAMER MOTION • LENIS
          </div>
        </div>
      </footer>

      {/* Interactive playground */}
      <LivePlayground 
        isOpen={isPlaygroundOpen} 
        onClose={() => setIsPlaygroundOpen(false)} 
      />

    </main>
    </MotionConfig>
  );
}
