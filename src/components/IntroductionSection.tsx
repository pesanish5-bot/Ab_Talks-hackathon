"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Sparkles, Code2 } from "lucide-react";

export default function IntroductionSection() {
  return (
    <section id="introduction" className="relative w-full py-28 px-6 bg-slate-midnight border-t border-aqua-spotlight/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Number & Heading */}
        <div className="flex items-baseline space-x-4 mb-12">
          <span className="font-mono text-cyan-accent font-bold text-sm tracking-widest">01 —</span>
          <h2 className="font-display font-bold text-6xl md:text-8xl text-cream-paper uppercase tracking-wider">
            INTRODUCTION
          </h2>
        </div>

        {/* Two-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: The Problem */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-between p-8 rounded-2xl bg-slate-deep/60 border border-aqua-spotlight/30 backdrop-blur-sm card-cyan-line"
          >
            <div>
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs tracking-widest uppercase mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>THE EVALUATION CHALLENGE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-cream-paper mb-4 leading-tight">
                Preparing for technical interviews after the cohort remains the biggest challenge.
              </h3>
              <p className="text-cream-muted text-base leading-relaxed mb-6">
                The AI Cohort is a 31-day enterprise AI engineering program covering Retrieval-Augmented Generation (RAG), Vector Databases, Prompt Engineering, Agentic AI, Model Context Protocol (MCP), and Production AI Deployment. After completing the cohort, learners need to confidently articulate the systems they built. But static quizzes and scripted questionnaires cannot evaluate real engineering comprehension across 20 diverse candidate profiles.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-aqua-spotlight/30 pt-6 mt-4">
              <div>
                <div className="font-mono text-cyan-accent font-bold text-2xl">31 DAYS</div>
                <div className="text-xs text-cream-muted font-mono uppercase mt-1">Curriculum spanning 8 modules</div>
              </div>
              <div>
                <div className="font-mono text-cyan-accent font-bold text-2xl">20 CANDIDATES</div>
                <div className="text-xs text-cream-muted font-mono uppercase mt-1">Diverse roles from Intern to Principal Architect</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: The Solution */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex flex-col justify-between p-8 rounded-2xl bg-gradient-to-br from-aqua-spotlight/40 via-slate-deep/80 to-slate-midnight border border-cyan-accent/40 shadow-card-hover card-cyan-line overflow-hidden"
          >
            {/* Ambient Cyan Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-accent/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-cyan-accent font-mono text-xs tracking-widest uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>THE AGENTIC SOLUTION</span>
                </div>
                
                <span className="px-2.5 py-1 rounded bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent font-mono text-[10px]">
                  POST /api/interview
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                  <Image 
                    src="/brain-icon.png"
                    alt="3D Glowing AI Brain Icon"
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(94,209,201,0.5)] animate-float-slow"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cream-paper">
                    ABTalks AI Technical Interviewer
                  </h3>
                  <p className="text-cyan-accent text-xs font-mono mt-1">
                    Adaptive • Context-Aware • Structured JSON Output
                  </p>
                </div>
              </div>

              <p className="text-cream-paper/90 text-base leading-relaxed mb-6">
                An AI agent that conducts realistic, multi-turn technical interviews. It ingests candidate profiles from <span className="font-mono text-cyan-accent">candidates.json</span> (member details, mission logs, learning signals), cross-references against the 31-day <span className="font-mono text-cyan-accent">curriculum.json</span>, and dynamically probes passed, skipped, and re-attempted topics before synthesizing actionable structured feedback.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-cyan-accent/20 pt-6 mt-4 font-mono text-xs text-cream-muted">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-cyan-accent" />
                <span>Min 8 Questions • Min 4 Curriculum Days</span>
              </div>
              <span className="text-cyan-accent font-bold">LIVE AGENT READY</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
