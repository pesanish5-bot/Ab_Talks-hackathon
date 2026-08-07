"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Database, Brain, Workflow, ArrowRight, CheckCircle, Terminal, Layers } from "lucide-react";

const ARCH_STAGES = [
  {
    step: "01",
    name: "HTTP Router",
    type: "POST /api/interview",
    desc: "Accepts sessionId + candidate object (from candidates.json) or sessionId + message. Validates schema shape.",
    code: `POST /api/interview HTTP/1.1\nContent-Type: application/json\n\n{\n  "sessionId": "abc-123",\n  "candidate": {\n    "member": {\n      "id": "CAND-007",\n      "name": "Ethan Brooks",\n      "jobRole": "Computer Science Intern",\n      "yearsExperience": 0,\n      "education": "BS Computer Science (in progress)"\n    },\n    "missions": [\n      { "day": 7, "title": "Embeddings Explained", "passed": true, "attempts": 2 },\n      { "day": 27, "title": "Security & Guardrails", "skipped": true }\n    ],\n    "signals": { "commitDays": 26, "missionsCompleted": 27, "missionsFirstTry": 22 }\n  }\n}`
  },
  {
    step: "02",
    name: "Session Store",
    type: "In-Memory / Redis TTL",
    desc: "Creates session state indexed by sessionId. Tracks conversation history, question count, and covered curriculum days set.",
    code: `Session State Created:\n{\n  "sessionId": "abc-123",\n  "candidate": { "member": { "name": "Ethan Brooks", ... } },\n  "questionCount": 1,\n  "coveredDays": [7],\n  "questionQueue": [27, 28, 7, 8, 12, 16, 22, 1, 3, 31],\n  "analysis": {\n    "skippedDays": [27, 28],\n    "passedDays": [1, 3, 7, 8, 12, 16, 22, 31],\n    "experienceLevel": "junior"\n  }\n}`
  },
  {
    step: "03",
    name: "Curriculum Retriever",
    type: "curriculum.json Lookup",
    desc: "Loads day data from curriculum.json (31 days, 8 modules). Selects next probing topic based on skipped/failed/struggled missions.",
    code: `Curriculum Day Loaded:\n{\n  "day": 27,\n  "title": "Security, Privacy & Guardrails",\n  "type": "BUILD",\n  "tools": ["FastAPI", "Python", "Authentication", "Input Validation"],\n  "objectives": [\n    "Secure chatbot APIs against unauthorized access",\n    "Implement prompt-injection and jailbreak safeguards"\n  ]\n}\n\nQuestion Strategy: SKIPPED → probe basic awareness`
  },
  {
    step: "04",
    name: "Question Generator",
    type: "Adaptive Single-Turn",
    desc: "Generates exactly ONE question per turn. Adapts depth based on candidate YOE and mission attempt count. Enforces min 8 Qs across min 4 days.",
    code: `Response Payload:\n{\n  "reply": "Day 27 covered Security, Privacy & Guardrails,\n    which you skipped. Can you explain the core\n    concept behind securing chatbot APIs\n    against unauthorized access?",\n  "done": false\n}`
  }
];

export default function ArchitectureSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="architecture" className="relative w-full py-28 px-6 bg-slate-midnight border-t border-aqua-spotlight/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-baseline space-x-4 mb-16">
          <span className="font-mono text-cyan-accent font-bold text-sm tracking-widest">03 —</span>
          <h2 className="font-display font-bold text-6xl md:text-8xl text-cream-paper uppercase tracking-wider">
            ARCHITECTURE
          </h2>
        </div>

        {/* Wide Cinematic Diagram Presentation Card */}
        <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-b from-slate-deep to-slate-midnight border border-aqua-spotlight/40 shadow-2xl overflow-hidden mb-12">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-aqua-spotlight/30 pb-6 mb-8 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-accent/10 text-cyan-accent">
                <Workflow className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cream-paper">STATELESS MULTI-TURN PIPELINE FLOW</h3>
                <p className="text-xs font-mono text-cream-muted">Request Lifecycle & Agent State Machine</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs text-cyan-accent bg-slate-midnight px-3 py-1.5 rounded-lg border border-aqua-spotlight/50">
              <Terminal className="w-3.5 h-3.5" />
              <span>UNAUTHENTICATED • SUB-3S LATENCY TARGET</span>
            </div>
          </div>

          {/* Interactive Pipeline Stages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {ARCH_STAGES.map((stage, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-5 rounded-xl border transition-all duration-300 relative ${
                    isActive
                      ? "bg-aqua-spotlight/40 border-cyan-accent shadow-glow-cyan"
                      : "bg-slate-midnight/60 border-aqua-spotlight/30 hover:border-cyan-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-cyan-accent">
                      STEP {stage.step}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-cyan-accent animate-ping" />
                    )}
                  </div>
                  <h4 className="font-bold text-base text-cream-paper mb-1">{stage.name}</h4>
                  <div className="font-mono text-[11px] text-cyan-accent/80">{stage.type}</div>
                </button>
              );
            })}
          </div>

          {/* Stage Inspection Terminal View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-slate-midnight/90 rounded-2xl p-6 border border-aqua-spotlight/40">
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-cyan-accent uppercase tracking-widest">
                  STAGE ANALYSIS — STEP {ARCH_STAGES[activeStep].step}
                </span>
                <h4 className="text-2xl font-bold text-cream-paper mt-2 mb-3">
                  {ARCH_STAGES[activeStep].name}
                </h4>
                <p className="text-cream-muted text-sm leading-relaxed mb-6">
                  {ARCH_STAGES[activeStep].desc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-deep/80 border border-aqua-spotlight/30">
                <div className="text-xs font-mono text-cream-muted mb-2">KEY STATE TRANSITIONS</div>
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-accent">
                  <CheckCircle className="w-4 h-4" />
                  <span>Enforces Single Question Rule</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-accent mt-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Tracks 4-Day Curriculum Span</span>
                </div>
              </div>
            </div>

            {/* Monospace Code / JSON Inspector */}
            <div className="lg:col-span-7 bg-black/60 rounded-xl p-5 border border-aqua-spotlight/30 font-mono text-xs overflow-x-auto text-cyan-accent/90">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-cream-muted">
                <span>INSPECTOR OUTPUT Payload</span>
                <span>JSON / HTTP</span>
              </div>
              <pre className="text-cream-paper whitespace-pre-wrap leading-relaxed">
                {ARCH_STAGES[activeStep].code}
              </pre>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
