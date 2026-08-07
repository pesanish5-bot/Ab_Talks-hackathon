"use client";

import { motion } from "framer-motion";
import { MessageSquare, Database, BookOpen, FileCheck, Layers, Cpu, Compass, ShieldAlert } from "lucide-react";

const CAPABILITIES = [
  {
    id: "01",
    tag: "DYNAMIC FLOW",
    title: "Adaptive Conversation",
    description: "Tailors question depth and difficulty dynamically based on candidate YOE, past attempt counts, and first-try success rates.",
    icon: MessageSquare,
    bgTone: "bg-slate-deep/70",
    accent: "text-cyan-accent",
    detail: "Scales seamlessly from junior baseline syntax to senior architectural system design."
  },
  {
    id: "02",
    tag: "MEMORY & STATE",
    title: "Context Management",
    description: "Maintains conversation history and session state across stateless HTTP requests using a rolling sliding window and summary buffer.",
    icon: Database,
    bgTone: "bg-aqua-spotlight/30",
    accent: "text-cyan-accent",
    detail: "Indexed by sessionId with automatic 60-minute rolling TTL eviction."
  },
  {
    id: "03",
    tag: "CURRICULUM RIGOR",
    title: "4-Day Coverage",
    description: "Enforces minimum coverage across at least 4 distinct curriculum days, probing passed, skipped, and re-attempted mission topics.",
    icon: BookOpen,
    bgTone: "bg-slate-midnight",
    accent: "text-cyan-accent",
    detail: "Prevents candidate topic dodging by anchoring questions to 31-day logs."
  },
  {
    id: "04",
    tag: "EVALUATION ENGINE",
    title: "Structured Output",
    description: "Synthesizes final turn into a strict JSON payload featuring an executive summary, strengths array, skill gaps, and next learning steps.",
    icon: FileCheck,
    bgTone: "bg-slate-deep/80",
    accent: "text-cyan-accent",
    detail: "Validated via Pydantic schemas with zero empty fields or generic fluff."
  }
];

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="relative w-full py-28 px-6 bg-slate-deep/40 border-t border-aqua-spotlight/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-baseline space-x-4 mb-2">
              <span className="font-mono text-cyan-accent font-bold text-sm tracking-widest">02 —</span>
              <h2 className="font-display font-bold text-6xl md:text-8xl text-cream-paper uppercase tracking-wider">
                CAPABILITIES
              </h2>
            </div>
            <p className="text-cream-muted text-base max-w-xl">
              Engineered against strict non-functional constraints to guarantee fair, rigorous, and automated technical evaluation.
            </p>
          </div>

          <div className="font-mono text-xs text-cyan-accent border border-cyan-accent/30 rounded-lg px-4 py-2 bg-slate-midnight/60 self-start md:self-auto">
            SYSTEM CONSTRAINTS • MIN 8 QUESTIONS
          </div>
        </div>

        {/* 2x2 Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`relative flex flex-col justify-between p-8 rounded-2xl ${cap.bgTone} border border-aqua-spotlight/40 shadow-xl transition-all duration-300 card-cyan-line group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-cyan-accent tracking-widest border border-cyan-accent/30 rounded px-2.5 py-1 bg-cyan-accent/5">
                      {cap.tag}
                    </span>
                    <span className="font-mono text-xs text-cream-muted">
                      RESERVED RULE #{cap.id}
                    </span>
                  </div>

                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 rounded-xl bg-slate-midnight border border-aqua-spotlight/60 text-cyan-accent group-hover:border-cyan-accent transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-cream-paper group-hover:text-cyan-accent transition-colors">
                        {cap.title}
                      </h3>
                      <p className="text-cream-muted text-sm leading-relaxed mt-2">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-aqua-spotlight/30 pt-4 mt-6 flex items-center justify-between text-xs font-mono text-cream-muted">
                  <span>{cap.detail}</span>
                  <span className="text-cyan-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    REQUIREMENT MET →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
