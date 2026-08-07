"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight, Code, LayoutDashboard, Award } from "lucide-react";

const MOCK_FEEDBACK = {
  summary: "Sarah Johnson (Senior Data Engineer, 9 YOE) completed the technical interview covering 9 questions across 7 curriculum days spanning 5 modules. Overall commit rate: 90% (28/31 days). First-try pass rate: 67%. Strong comprehension in Embeddings (Day 7), Vector Databases (Day 8), and Chatbot Backend (Day 16). Notable gap in skipped topic: Monitoring, Logging & Observability (Day 29).",
  strengths: [
    "Mastered 'Embeddings Explained' (Day 7) on first attempt using Sentence Transformers, OpenAI Embeddings.",
    "Mastered 'Vector Databases Overview' (Day 8) on first attempt using ChromaDB, Pinecone.",
    "Strong first-attempt success rate (67%) indicating solid comprehension across 20 missions.",
    "Excellent engagement with 90% commit day attendance (28/31 days)."
  ],
  gaps: [
    "Skipped: Monitoring, Logging & Observability (Day 29) — no exposure to Prometheus, Grafana dashboards.",
    "Struggled with: Prompt Engineering Fundamentals (Day 12, 4 attempts) — review zero-shot, few-shot, chain-of-thought prompting.",
    "Struggled with: Docker & Kubernetes Deployment (Day 28, 3 attempts) — review containerization and health checks."
  ],
  next: [
    "Complete the skipped Day 29 mission: 'Monitoring, Logging & Observability' using Python Logging, Prometheus, Grafana.",
    "Review Day 12: 'Prompt Engineering Fundamentals' — strengthen understanding of prompt template design.",
    "Review Day 28: 'Docker & Kubernetes Deployment' — practice containerizing FastAPI and React apps."
  ]
};


export default function FeedbackSection() {
  const [viewMode, setViewMode] = useState<"ui" | "json">("ui");

  return (
    <section id="feedback" className="relative w-full py-28 px-6 bg-slate-deep/40 border-t border-aqua-spotlight/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-baseline space-x-4 mb-2">
              <span className="font-mono text-cyan-accent font-bold text-sm tracking-widest">04 —</span>
              <h2 className="font-display font-bold text-6xl md:text-8xl text-cream-paper uppercase tracking-wider">
                FEEDBACK DESIGN
              </h2>
            </div>
            <p className="text-cream-muted text-base max-w-xl">
              Translating terminal interview state into structured JSON and actionable dashboard metrics.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-slate-midnight p-1 rounded-xl border border-aqua-spotlight/50 self-start md:self-auto">
            <button
              onClick={() => setViewMode("ui")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                viewMode === "ui"
                  ? "bg-cyan-accent text-slate-midnight font-bold shadow-glow-cyan"
                  : "text-cream-muted hover:text-cream-paper"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>DASHBOARD UI</span>
            </button>

            <button
              onClick={() => setViewMode("json")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                viewMode === "json"
                  ? "bg-cyan-accent text-slate-midnight font-bold shadow-glow-cyan"
                  : "text-cream-muted hover:text-cream-paper"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>RAW JSON SCHEMA</span>
            </button>
          </div>
        </div>

        {/* Dashboard Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-8 md:p-10 rounded-3xl bg-slate-midnight border border-aqua-spotlight/50 shadow-card-hover overflow-hidden"
        >
          {viewMode === "ui" ? (
            <div className="space-y-8">
              
              {/* Header Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-aqua-spotlight/30 pb-6 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-cream-paper">INTERVIEW PERFORMANCE EVALUATION</h3>
                    <div className="text-xs font-mono text-cyan-accent">Candidate: Sarah Johnson (CAND-001) • Status: Completed (9 Qs, 7 Days, 5 Modules)</div>
                  </div>
                </div>

                <div className="px-3 py-1 rounded bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent font-mono text-xs self-start sm:self-auto">
                  done: true
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-6 rounded-2xl bg-slate-deep/80 border border-aqua-spotlight/40">
                <div className="font-mono text-xs text-cyan-accent tracking-widest uppercase mb-2">
                  EXECUTIVE SUMMARY
                </div>
                <p className="text-cream-paper/90 text-base leading-relaxed">
                  {MOCK_FEEDBACK.summary}
                </p>
              </div>

              {/* Strengths & Skill Gaps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="p-6 rounded-2xl bg-slate-deep/50 border border-cyan-accent/30">
                  <div className="flex items-center space-x-2 text-cyan-accent font-mono text-xs tracking-widest uppercase mb-4">
                    <CheckCircle2 className="w-4 h-4 text-cyan-accent" />
                    <span>IDENTIFIED STRENGTHS</span>
                  </div>
                  <ul className="space-y-3">
                    {MOCK_FEEDBACK.strengths.map((str, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm text-cream-paper/90">
                        <CheckCircle2 className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps */}
                <div className="p-6 rounded-2xl bg-slate-deep/50 border border-amber-500/30">
                  <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs tracking-widest uppercase mb-4">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>IDENTIFIED SKILL GAPS</span>
                  </div>
                  <ul className="space-y-3">
                    {MOCK_FEEDBACK.gaps.map((gap, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm text-cream-paper/90">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Recommended Next Steps */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-aqua-spotlight/30 via-slate-deep to-slate-midnight border border-cyan-accent/40">
                <div className="font-mono text-xs text-cyan-accent tracking-widest uppercase mb-3">
                  ACTIONABLE NEXT STEPS
                </div>
                <div className="space-y-2">
                  {MOCK_FEEDBACK.next.map((step, i) => (
                    <div key={i} className="flex items-center space-x-3 text-sm text-cream-paper font-medium">
                      <ArrowRight className="w-4 h-4 text-cyan-accent shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Raw JSON Output View */
            <div className="font-mono text-xs text-cyan-accent/90 bg-black/70 rounded-2xl p-6 border border-aqua-spotlight/40 overflow-x-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-cream-muted">
                <span>TERMINAL RESPONSE PAYLOAD</span>
                <span>POST /api/interview</span>
              </div>
              <pre className="text-cream-paper leading-relaxed whitespace-pre-wrap">
{JSON.stringify({
  reply: "Thank you for completing the technical interview! Your feedback report is ready.",
  done: true,
  feedback: MOCK_FEEDBACK
}, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
