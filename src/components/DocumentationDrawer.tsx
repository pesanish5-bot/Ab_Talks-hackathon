"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, X, ChevronRight, BookOpen, Layers, ShieldCheck, Code, Brain } from "lucide-react";

interface DocFile {
  id: string;
  name: string;
  filename: string;
  icon: any;
  summary: string;
}

const DOCS: DocFile[] = [
  { id: "prd", name: "PRD", filename: "Prd.md", icon: FileText, summary: "Product Requirements, User Personas, Target KPIs & Constraints" },
  { id: "arch", name: "Architecture", filename: "Architecture.md", icon: Layers, summary: "System Components, Sequence Flow, Retrieval Pipelines & Tech Stack" },
  { id: "rules", name: "Rules", filename: "rules.md", icon: ShieldCheck, summary: "AI Persona, Single Question Constraints & Anti-Hallucination Guardrails" },
  { id: "phases", name: "Phases", filename: "Phases.md", icon: BookOpen, summary: "5-Phase Implementation Roadmap & Exit Criteria" },
  { id: "design", name: "Design", filename: "Design.md", icon: Code, summary: "JSON API Contracts, OpenAPI Schemas & Internal Data Models" },
  { id: "memory", name: "Memory", filename: "Memory.md", icon: Brain, summary: "Stateless Session Management, Token Sliding Windows & State Transitions" }
];

export default function DocumentationDrawer({ 
  isOpen, 
  onClose,
  docContents 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  docContents: Record<string, string>;
}) {
  const [activeDocId, setActiveDocId] = useState("prd");

  if (!isOpen) return null;

  const currentDoc = DOCS.find((d) => d.id === activeDocId) || DOCS[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-5xl h-full bg-slate-midnight border-l border-aqua-spotlight/40 flex flex-col shadow-2xl"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-aqua-spotlight/30 bg-slate-deep">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-cyan-accent" />
            <div>
              <h3 className="text-lg font-bold text-cream-paper">SYSTEM ARCHITECTURE SPECIFICATIONS</h3>
              <p className="text-xs font-mono text-cyan-accent">ABTalks AI Interview Agent • Production Documentation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-aqua-spotlight/40 hover:bg-slate-midnight text-cream-muted hover:text-cream-paper transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar Document Selector */}
          <div className="w-full md:w-72 border-r border-aqua-spotlight/30 bg-slate-deep/50 p-4 space-y-2 overflow-y-auto">
            <div className="text-xs font-mono text-cream-muted uppercase tracking-widest px-2 mb-3">
              SELECT SPECIFICATION
            </div>
            {DOCS.map((doc) => {
              const Icon = doc.icon;
              const isActive = activeDocId === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                    isActive
                      ? "bg-cyan-accent text-slate-midnight border-cyan-accent font-semibold shadow-glow-cyan"
                      : "bg-slate-midnight/60 border-aqua-spotlight/30 text-cream-paper hover:border-cyan-accent/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? "text-slate-midnight" : "text-cyan-accent"}`} />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-bold truncate">{doc.name}</div>
                    <div className={`text-[11px] font-mono truncate ${isActive ? "text-slate-midnight/80" : "text-cream-muted"}`}>
                      {doc.filename}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Document Content Viewer */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-midnight font-mono text-sm leading-relaxed">
            <div className="border-b border-aqua-spotlight/30 pb-4 mb-6">
              <div className="text-xs text-cyan-accent font-mono uppercase tracking-wider">
                DOCUMENT FILE: {currentDoc.filename}
              </div>
              <h2 className="text-2xl font-bold text-cream-paper font-sans mt-1">{currentDoc.name} Specification</h2>
              <p className="text-xs text-cream-muted mt-1 font-sans">{currentDoc.summary}</p>
            </div>

            <div className="prose prose-invert max-w-none text-cream-paper/90 whitespace-pre-wrap">
              {docContents[currentDoc.filename] || "Loading specification content..."}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
