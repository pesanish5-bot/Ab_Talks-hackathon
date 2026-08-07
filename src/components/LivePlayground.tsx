"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Send, RefreshCw, User, Bot, CheckCircle2, Sparkles, AlertTriangle, ArrowRight, ChevronDown } from "lucide-react";

// Real candidate data embedded client-side for the selector
const CANDIDATE_LIST = [
  { id: "CAND-001", name: "Sarah Johnson", role: "Senior Data Engineer", yoe: 9 },
  { id: "CAND-002", name: "Alex Turner", role: "Backend Software Engineer", yoe: 5 },
  { id: "CAND-003", name: "Emily Chen", role: "AI Engineer", yoe: 6 },
  { id: "CAND-004", name: "David Miller", role: "Business Analyst", yoe: 8 },
  { id: "CAND-005", name: "Michael Brown", role: "DevOps Engineer", yoe: 10 },
  { id: "CAND-006", name: "Wendy Foster", role: "Marketing Manager", yoe: 12 },
  { id: "CAND-007", name: "Ethan Brooks", role: "Computer Science Intern", yoe: 0 },
  { id: "CAND-008", name: "Harold Whitfield", role: "Distinguished Engineer", yoe: 28 },
  { id: "CAND-009", name: "Zara Ahmadi", role: "AI Engineer", yoe: 1 },
  { id: "CAND-010", name: "Gerald Combs", role: "IT Support Specialist", yoe: 20 },
  { id: "CAND-011", name: "Mia Alvarez", role: "UX Researcher", yoe: 6 },
  { id: "CAND-012", name: "Chen Wei", role: "Mobile App Developer", yoe: 7 },
  { id: "CAND-013", name: "Ravi Patel", role: "Software Engineer", yoe: 15 },
  { id: "CAND-014", name: "Bethany Cole", role: "HR Manager", yoe: 10 },
  { id: "CAND-015", name: "Noah Kim", role: "Principal Architect", yoe: 20 },
  { id: "CAND-016", name: "Isabella Rossi", role: "Software Engineer", yoe: 5 },
  { id: "CAND-017", name: "Tyler Brooks", role: "Junior Developer", yoe: 0 },
  { id: "CAND-018", name: "Diane Foster", role: "AI Engineer", yoe: 4 },
  { id: "CAND-019", name: "Frank DeLuca", role: "Legacy Systems Engineer", yoe: 25 },
  { id: "CAND-020", name: "Priyanka Sharma", role: "Software Engineer", yoe: 5 },
];

// Full candidate profiles matching candidates.json schema
const FULL_CANDIDATES: Record<string, any> = {
  "CAND-001": { member: { id: "CAND-001", name: "Sarah Johnson", jobRole: "Senior Data Engineer", yearsExperience: 9, education: "MS Computer Science", status: "COMPLETED" }, missions: [{ day: 7, title: "Embeddings Explained", passed: true, attempts: 1 },{ day: 8, title: "Vector Databases Overview", passed: true, attempts: 1 },{ day: 10, title: "Retrieval & Matching Engine", passed: true, attempts: 2 },{ day: 12, title: "Prompt Engineering Fundamentals", passed: true, attempts: 4 },{ day: 16, title: "Chatbot Backend & API Integration", passed: true, attempts: 1 },{ day: 22, title: "Multi-Agent Orchestration", passed: true, attempts: 2 },{ day: 23, title: "Model Context Protocol (MCP)", passed: true, attempts: 2 },{ day: 28, title: "Docker & Kubernetes Deployment", passed: true, attempts: 3 },{ day: 29, title: "Monitoring, Logging & Observability", skipped: true },{ day: 31, title: "Capstone Project & Final Demo", passed: true, attempts: 1 }], signals: { commitDays: 28, missionsCompleted: 30, missionsFirstTry: 20 } },
  "CAND-003": { member: { id: "CAND-003", name: "Emily Chen", jobRole: "AI Engineer", yearsExperience: 6, education: "MS Artificial Intelligence", status: "COMPLETED" }, missions: [{ day: 7, title: "Embeddings Explained", passed: true, attempts: 1 },{ day: 8, title: "Vector Databases Overview", passed: true, attempts: 1 },{ day: 10, title: "Retrieval & Matching Engine", passed: true, attempts: 1 },{ day: 11, title: "RAG End-to-End & LLM API Basics", passed: true, attempts: 1 },{ day: 12, title: "Prompt Engineering Fundamentals", passed: true, attempts: 1 },{ day: 13, title: "Function Calling & Structured Outputs", passed: true, attempts: 1 },{ day: 21, title: "LangChain Agents", passed: true, attempts: 1 },{ day: 22, title: "Multi-Agent Orchestration", passed: true, attempts: 1 },{ day: 23, title: "Model Context Protocol (MCP)", passed: true, attempts: 1 },{ day: 31, title: "Capstone Project & Final Demo", passed: true, attempts: 1 }], signals: { commitDays: 31, missionsCompleted: 31, missionsFirstTry: 30 } },
  "CAND-007": { member: { id: "CAND-007", name: "Ethan Brooks", jobRole: "Computer Science Intern", yearsExperience: 0, education: "BS Computer Science (in progress)", status: "COMPLETED" }, missions: [{ day: 1, title: "VS Code & Python Environment Setup", passed: true, attempts: 1 },{ day: 3, title: "First AI Project, React Frontend & GitHub", passed: true, attempts: 1 },{ day: 7, title: "Embeddings Explained", passed: true, attempts: 2 },{ day: 8, title: "Vector Databases Overview", passed: true, attempts: 1 },{ day: 12, title: "Prompt Engineering Fundamentals", passed: true, attempts: 1 },{ day: 16, title: "Chatbot Backend & API Integration", passed: true, attempts: 1 },{ day: 22, title: "Multi-Agent Orchestration", passed: true, attempts: 1 },{ day: 27, title: "Security, Privacy & Guardrails", skipped: true },{ day: 28, title: "Docker & Kubernetes Deployment", skipped: true },{ day: 31, title: "Capstone Project & Final Demo", passed: true, attempts: 2 }], signals: { commitDays: 26, missionsCompleted: 27, missionsFirstTry: 22 } },
  "CAND-010": { member: { id: "CAND-010", name: "Gerald Combs", jobRole: "IT Support Specialist", yearsExperience: 20, education: "AAS Information Technology", status: "COMPLETED" }, missions: [{ day: 1, title: "VS Code & Python Environment Setup", passed: true, attempts: 2 },{ day: 7, title: "Embeddings Explained", passed: true, attempts: 5 },{ day: 8, title: "Vector Databases Overview", passed: false, attempts: 4 },{ day: 10, title: "Retrieval & Matching Engine", passed: false, attempts: 3 },{ day: 12, title: "Prompt Engineering Fundamentals", passed: true, attempts: 5 },{ day: 16, title: "Chatbot Backend & API Integration", passed: true, attempts: 4 },{ day: 22, title: "Multi-Agent Orchestration", passed: false, attempts: 3 },{ day: 27, title: "Security, Privacy & Guardrails", skipped: true },{ day: 28, title: "Docker & Kubernetes Deployment", skipped: true },{ day: 31, title: "Capstone Project & Final Demo", passed: true, attempts: 3 }], signals: { commitDays: 22, missionsCompleted: 23, missionsFirstTry: 1 } },
};

// Build a basic profile for candidates not in FULL_CANDIDATES
function buildFallbackProfile(c: typeof CANDIDATE_LIST[0]): any {
  return {
    member: { id: c.id, name: c.name, jobRole: c.role, yearsExperience: c.yoe, education: "Not specified", status: "COMPLETED" },
    missions: [
      { day: 7, title: "Embeddings Explained", passed: true, attempts: 2 },
      { day: 8, title: "Vector Databases Overview", passed: true, attempts: 1 },
      { day: 12, title: "Prompt Engineering Fundamentals", passed: true, attempts: 3 },
      { day: 16, title: "Chatbot Backend & API Integration", passed: true, attempts: 1 },
      { day: 22, title: "Multi-Agent Orchestration", passed: true, attempts: 2 },
      { day: 23, title: "Model Context Protocol (MCP)", passed: true, attempts: 1 },
      { day: 28, title: "Docker & Kubernetes Deployment", passed: true, attempts: 1 },
      { day: 31, title: "Capstone Project & Final Demo", passed: true, attempts: 1 },
    ],
    signals: { commitDays: 25, missionsCompleted: 28, missionsFirstTry: 15 },
  };
}

interface Turn {
  role: "user" | "assistant";
  content: string;
}

export default function LivePlayground({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [sessionId] = useState(() => `sess_demo_${Math.random().toString(36).substring(2, 9)}`);
  const [selectedCandidateId, setSelectedCandidateId] = useState("CAND-007");

  const [turns, setTurns] = useState<Turn[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState<any>(null);

  const selectedCandidate = CANDIDATE_LIST.find((c) => c.id === selectedCandidateId)!;

  const startInterview = async () => {
    setLoading(true);
    try {
      const candidatePayload = FULL_CANDIDATES[selectedCandidateId] || buildFallbackProfile(selectedCandidate);

      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, candidate: candidatePayload }),
      });
      const data = await res.json();
      if (data.reply) {
        setTurns([{ role: "assistant", content: data.reply }]);
        setIsStarted(true);
      }
    } catch (err) {
      console.error("Failed to start session", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading || isDone) return;

    const userText = inputMessage;
    setInputMessage("");
    setTurns((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: userText }),
      });
      const data = await res.json();

      if (data.reply) {
        setTurns((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
      if (data.done) {
        setIsDone(true);
        if (data.feedback) setFinalFeedback(data.feedback);
      }
    } catch (err) {
      console.error("Failed to send turn", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-midnight border border-cyan-accent/40 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-aqua-spotlight/40 bg-slate-deep">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-accent/10 text-cyan-accent"><Terminal className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg font-bold text-cream-paper">LIVE AGENT PLAYGROUND</h3>
              <p className="text-xs font-mono text-cyan-accent">POST /api/interview • Session: {sessionId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-muted hover:text-cream-paper px-3 py-1.5 rounded-lg border border-aqua-spotlight/40 hover:bg-slate-midnight text-xs font-mono transition-all">CLOSE</button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isStarted ? (
            <div className="space-y-6 max-w-lg mx-auto py-8">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-cream-paper">Select Candidate Profile</h4>
                <p className="text-sm text-cream-muted mt-1">Choose from the 20 real candidates in <span className="font-mono text-cyan-accent">candidates.json</span></p>
              </div>

              <div className="bg-slate-deep/60 p-6 rounded-2xl border border-aqua-spotlight/30 space-y-4">
                {/* Candidate Selector Dropdown */}
                <div>
                  <label className="block text-xs font-mono text-cream-muted mb-2 uppercase">SELECT CANDIDATE</label>
                  <div className="relative">
                    <select
                      value={selectedCandidateId}
                      onChange={(e) => setSelectedCandidateId(e.target.value)}
                      className="w-full bg-slate-midnight border border-aqua-spotlight/50 rounded-lg px-4 py-3 text-sm text-cream-paper focus:border-cyan-accent outline-none appearance-none cursor-pointer"
                    >
                      {CANDIDATE_LIST.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.id} — {c.name} ({c.role}, {c.yoe} YOE)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-accent pointer-events-none" />
                  </div>
                </div>

                {/* Selected Candidate Preview */}
                <div className="p-4 rounded-xl bg-slate-midnight border border-aqua-spotlight/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cream-paper text-lg">{selectedCandidate.name}</span>
                    <span className="font-mono text-xs text-cyan-accent">{selectedCandidate.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-cream-muted">
                    <div>Role: <span className="text-cream-paper">{selectedCandidate.role}</span></div>
                    <div>YOE: <span className="text-cream-paper">{selectedCandidate.yoe}</span></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyan-accent/5 border border-cyan-accent/20 text-xs font-mono text-cyan-accent">
                  Payload sent as <span className="font-bold">candidates.json</span> schema: member, missions[], signals
                </div>
              </div>

              <button onClick={startInterview} disabled={loading} className="w-full py-3.5 rounded-xl bg-cyan-accent text-slate-midnight font-bold font-mono text-sm hover:bg-cyan-glow hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /><span>LAUNCH INTERVIEW SESSION</span></>}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {turns.map((turn, i) => (
                <div key={i} className={`flex items-start space-x-3 ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
                  {turn.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-cyan-accent/20 border border-cyan-accent/40 flex items-center justify-center shrink-0 text-cyan-accent"><Bot className="w-4 h-4" /></div>
                  )}
                  <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${turn.role === "user" ? "bg-cyan-accent text-slate-midnight rounded-tr-none font-medium" : "bg-slate-deep border border-aqua-spotlight/40 text-cream-paper rounded-tl-none"}`}>
                    {turn.content}
                  </div>
                  {turn.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-deep border border-aqua-spotlight/40 flex items-center justify-center shrink-0 text-cream-paper"><User className="w-4 h-4" /></div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-accent p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>AI Agent evaluating response against curriculum...</span>
                </div>
              )}

              {isDone && finalFeedback && (
                <div className="mt-8 p-6 rounded-2xl bg-slate-deep border border-cyan-accent/50 space-y-4">
                  <div className="flex items-center space-x-2 text-cyan-accent font-mono text-xs font-bold uppercase"><CheckCircle2 className="w-4 h-4" /><span>TERMINAL FEEDBACK — done: true</span></div>
                  <p className="text-sm text-cream-paper leading-relaxed">{finalFeedback.summary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-slate-midnight border border-cyan-accent/30">
                      <div className="font-mono text-cyan-accent font-bold mb-2">STRENGTHS</div>
                      <ul className="space-y-1.5 text-cream-muted">{finalFeedback.strengths?.map((s: string, idx: number) => <li key={idx} className="flex items-start space-x-2"><CheckCircle2 className="w-3 h-3 text-cyan-accent shrink-0 mt-0.5" /><span>{s}</span></li>)}</ul>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-midnight border border-amber-500/30">
                      <div className="font-mono text-amber-400 font-bold mb-2">GAPS</div>
                      <ul className="space-y-1.5 text-cream-muted">{finalFeedback.gaps?.map((g: string, idx: number) => <li key={idx} className="flex items-start space-x-2"><AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" /><span>{g}</span></li>)}</ul>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-midnight border border-aqua-spotlight/40">
                    <div className="font-mono text-cyan-accent font-bold mb-2">NEXT STEPS</div>
                    <ul className="space-y-1.5 text-cream-muted">{finalFeedback.next?.map((n: string, idx: number) => <li key={idx} className="flex items-start space-x-2"><ArrowRight className="w-3 h-3 text-cyan-accent shrink-0 mt-0.5" /><span>{n}</span></li>)}</ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Input */}
        {isStarted && !isDone && (
          <div className="p-4 border-t border-aqua-spotlight/40 bg-slate-deep flex items-center space-x-3">
            <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Type your technical answer..." disabled={loading} className="flex-1 bg-slate-midnight border border-aqua-spotlight/50 rounded-xl px-4 py-2.5 text-sm text-cream-paper focus:border-cyan-accent outline-none" />
            <button onClick={sendMessage} disabled={loading || !inputMessage.trim()} className="px-5 py-2.5 rounded-xl bg-cyan-accent text-slate-midnight font-bold font-mono text-xs hover:bg-cyan-glow transition-all flex items-center space-x-1.5 disabled:opacity-50"><span>SEND</span><Send className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
