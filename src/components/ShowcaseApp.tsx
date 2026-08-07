"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import IntroductionSection from "./IntroductionSection";
import CapabilitiesSection from "./CapabilitiesSection";
import ArchitectureSection from "./ArchitectureSection";
import FeedbackSection from "./FeedbackSection";
import LivePlayground from "./LivePlayground";
import DocumentationDrawer from "./DocumentationDrawer";
import { Terminal, FileText, Cpu, Heart } from "lucide-react";

interface ShowcaseAppProps {
  docContents: Record<string, string>;
}

export default function ShowcaseApp({ docContents }: ShowcaseAppProps) {
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-midnight text-cream-paper relative">
      {/* Navbar */}
      <Navbar 
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenPlayground={() => setIsPlaygroundOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* 01 - Introduction */}
      <IntroductionSection />

      {/* 02 - Capabilities */}
      <CapabilitiesSection />

      {/* 03 - System Architecture */}
      <ArchitectureSection />

      {/* 04 - Structured Feedback Design */}
      <FeedbackSection />

      {/* Interactive CTA Banner */}
      <section className="relative py-24 px-6 bg-gradient-to-r from-slate-deep via-aqua-spotlight/30 to-slate-deep border-t border-aqua-spotlight/30 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent font-mono text-xs uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>ENTERPRISE HACKATHON DEMO READY</span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-paper uppercase tracking-wider">
            TEST THE AI INTERVIEW AGENT LIVE
          </h2>

          <p className="text-cream-muted text-base max-w-xl mx-auto">
            Experience multi-turn dialogue adaptation, curriculum question probing, and instant JSON evaluation generation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsPlaygroundOpen(true)}
              className="px-8 py-4 rounded-xl bg-cyan-accent text-slate-midnight font-bold font-mono text-sm hover:bg-cyan-glow hover:shadow-glow-cyan transition-all flex items-center space-x-2"
            >
              <Terminal className="w-4 h-4" />
              <span>LAUNCH INTERACTIVE PLAYGROUND</span>
            </button>

            <button
              onClick={() => setIsDocsOpen(true)}
              className="px-8 py-4 rounded-xl bg-slate-midnight border border-aqua-spotlight text-cream-paper font-mono text-sm hover:bg-aqua-spotlight/40 hover:text-cyan-accent transition-all flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>BROWSE ALL 6 ARCHITECTURE DOCS</span>
            </button>
          </div>
        </div>
      </section>

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

      {/* Interactive Modals / Drawers */}
      <LivePlayground 
        isOpen={isPlaygroundOpen} 
        onClose={() => setIsPlaygroundOpen(false)} 
      />

      <DocumentationDrawer 
        isOpen={isDocsOpen} 
        onClose={() => setIsDocsOpen(false)} 
        docContents={docContents} 
      />
    </main>
  );
}
