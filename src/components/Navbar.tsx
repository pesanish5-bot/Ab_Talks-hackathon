"use client";

import { Terminal } from "lucide-react";

interface NavbarProps {
  onOpenPlayground: () => void;
}

export default function Navbar({ onOpenPlayground }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-midnight/45 backdrop-blur-md border-b border-aqua-spotlight/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Nav */}
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-accent animate-pulse" />
          <span className="font-mono text-xs md:text-sm font-semibold tracking-wider text-cream-paper uppercase">
            ABTALKS AI COHORT
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onOpenPlayground}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-cyan-accent text-slate-midnight font-mono text-xs font-bold hover:bg-cyan-glow hover:shadow-glow-cyan transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>START LIVE INTERVIEW</span>
          </button>
        </div>

        {/* Right Nav */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="font-mono text-xs text-cream-muted tracking-widest uppercase">
            31-DAY ENTERPRISE AI PROGRAM
          </span>
        </div>
      </div>
    </header>
  );
}
