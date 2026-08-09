"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  Send,
  Sparkles,
  Terminal,
  User,
} from "lucide-react";
import { getAllCandidates, type CandidateProfile } from "@/data/candidates";

const candidates = getAllCandidates();

const createSessionId = () =>
  `sess_demo_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;

interface Turn {
  role: "user" | "assistant";
  content: string;
}

interface InterviewFeedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

interface InterviewResponse {
  reply?: string;
  done?: boolean;
  feedback?: InterviewFeedback;
  error?: { message?: string };
}

function getErrorMessage(data: InterviewResponse | null, fallback: string) {
  return data?.error?.message || fallback;
}

export default function LivePlayground({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [sessionId, setSessionId] = useState(createSessionId);
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    candidates[0]?.member.id ?? ""
  );
  const [turns, setTurns] = useState<Turn[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState<InterviewFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCandidate = candidates.find(
    (candidate) => candidate.member.id === selectedCandidateId
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, loading, onClose]);

  const resetInterview = () => {
    setSessionId(createSessionId());
    setTurns([]);
    setInputMessage("");
    setIsStarted(false);
    setIsDone(false);
    setFinalFeedback(null);
    setError(null);
  };

  const startInterview = async () => {
    if (!selectedCandidate) {
      setError("No candidate profile is available. Refresh the page and try again.");
      return;
    }

    const nextSessionId = createSessionId();
    setSessionId(nextSessionId);
    setTurns([]);
    setInputMessage("");
    setIsDone(false);
    setFinalFeedback(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: nextSessionId,
          candidateId: selectedCandidate.member.id,
        }),
      });
      const data = (await response.json().catch(() => null)) as InterviewResponse | null;

      if (!response.ok || !data?.reply) {
        throw new Error(getErrorMessage(data, "The interview could not be started."));
      }

      setTurns([{ role: "assistant", content: data.reply }]);
      setIsStarted(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The interview could not be started."
      );
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const userText = inputMessage.trim();
    if (!userText || loading || isDone) return;

    setInputMessage("");
    setError(null);
    setTurns((previousTurns) => [
      ...previousTurns,
      { role: "user", content: userText },
    ]);
    setLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: userText }),
      });
      const data = (await response.json().catch(() => null)) as InterviewResponse | null;

      if (!response.ok || !data?.reply) {
        throw new Error(getErrorMessage(data, "The response could not be sent."));
      }

      setTurns((previousTurns) => [
        ...previousTurns,
        { role: "assistant", content: data.reply as string },
      ]);

      if (data.done) {
        setIsDone(true);
        setFinalFeedback(data.feedback ?? null);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The response could not be sent."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="presentation"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-midnight border border-cyan-accent/40 rounded-3xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="playground-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-aqua-spotlight/40 bg-slate-deep">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-accent/10 text-cyan-accent">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 id="playground-title" className="text-lg font-bold text-cream-paper">
                LIVE AGENT PLAYGROUND
              </h3>
              <p className="text-xs font-mono text-cyan-accent">
                POST /api/interview · Session: {sessionId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close live agent playground"
            className="text-cream-muted hover:text-cream-paper px-3 py-1.5 rounded-lg border border-aqua-spotlight/40 hover:bg-slate-midnight text-xs font-mono transition-all"
          >
            CLOSE
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isStarted ? (
            <div className="space-y-6 max-w-lg mx-auto py-8">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-cream-paper">Select Candidate Profile</h4>
                <p className="text-sm text-cream-muted mt-1">
                  Choose from the {candidates.length} real candidates in{" "}
                  <span className="font-mono text-cyan-accent">candidates.json</span>
                </p>
              </div>

              <div className="bg-slate-deep/60 p-6 rounded-2xl border border-aqua-spotlight/30 space-y-4">
                <div>
                  <label
                    htmlFor="candidate-selector"
                    className="block text-xs font-mono text-cream-muted mb-2 uppercase"
                  >
                    Select candidate
                  </label>
                  <div className="relative">
                    <select
                      id="candidate-selector"
                      value={selectedCandidateId}
                      onChange={(event) => setSelectedCandidateId(event.target.value)}
                      className="w-full bg-slate-midnight border border-aqua-spotlight/50 rounded-lg px-4 py-3 text-sm text-cream-paper focus:border-cyan-accent outline-none appearance-none cursor-pointer"
                    >
                      {candidates.map((candidate) => (
                        <option key={candidate.member.id} value={candidate.member.id}>
                          {candidate.member.id} — {candidate.member.name} ({candidate.member.jobRole},{" "}
                          {candidate.member.yearsExperience} YOE)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-accent pointer-events-none" />
                  </div>
                </div>

                {selectedCandidate && <CandidatePreview candidate={selectedCandidate} />}

                <div className="p-3 rounded-lg bg-cyan-accent/5 border border-cyan-accent/20 text-xs font-mono text-cyan-accent">
                  The server loads the selected profile directly from{" "}
                  <span className="font-bold">candidates.json</span>.
                </div>
              </div>

              {error && <ErrorNotice message={error} />}

              <button
                type="button"
                onClick={startInterview}
                disabled={loading || !selectedCandidate}
                className="w-full py-3.5 rounded-xl bg-cyan-accent text-slate-midnight font-bold font-mono text-sm hover:bg-cyan-glow hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>LAUNCH INTERVIEW SESSION</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {turns.map((turn, index) => (
                <div
                  key={`${turn.role}-${index}`}
                  className={`flex items-start space-x-3 ${
                    turn.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {turn.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-cyan-accent/20 border border-cyan-accent/40 flex items-center justify-center shrink-0 text-cyan-accent">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      turn.role === "user"
                        ? "bg-cyan-accent text-slate-midnight rounded-tr-none font-medium"
                        : "bg-slate-deep border border-aqua-spotlight/40 text-cream-paper rounded-tl-none"
                    }`}
                  >
                    {turn.content}
                  </div>
                  {turn.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-deep border border-aqua-spotlight/40 flex items-center justify-center shrink-0 text-cream-paper">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-accent p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Agent is preparing the next curriculum question...</span>
                </div>
              )}

              {error && <ErrorNotice message={error} />}

              {isDone && finalFeedback && (
                <div className="mt-8 p-6 rounded-2xl bg-slate-deep border border-cyan-accent/50 space-y-4">
                  <div className="flex items-center space-x-2 text-cyan-accent font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terminal feedback — done: true</span>
                  </div>
                  <p className="text-sm text-cream-paper leading-relaxed">{finalFeedback.summary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <FeedbackList
                      title="Strengths"
                      items={finalFeedback.strengths}
                      icon={<CheckCircle2 className="w-3 h-3 text-cyan-accent shrink-0 mt-0.5" />}
                      className="border-cyan-accent/30"
                      titleClassName="text-cyan-accent"
                    />
                    <FeedbackList
                      title="Gaps"
                      items={finalFeedback.gaps}
                      icon={<AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />}
                      className="border-amber-500/30"
                      titleClassName="text-amber-400"
                    />
                  </div>
                  <FeedbackList
                    title="Next steps"
                    items={finalFeedback.next}
                    icon={<ArrowRight className="w-3 h-3 text-cyan-accent shrink-0 mt-0.5" />}
                    className="border-aqua-spotlight/40"
                    titleClassName="text-cyan-accent"
                  />
                  <button
                    type="button"
                    onClick={resetInterview}
                    className="w-full py-3 rounded-xl border border-cyan-accent/40 text-cyan-accent font-bold font-mono text-xs hover:bg-cyan-accent/10 transition-all"
                  >
                    START ANOTHER INTERVIEW
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isStarted && !isDone && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
            className="p-4 border-t border-aqua-spotlight/40 bg-slate-deep flex items-center space-x-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              placeholder="Type your technical answer..."
              maxLength={4000}
              disabled={loading}
              aria-label="Your technical answer"
              className="flex-1 bg-slate-midnight border border-aqua-spotlight/50 rounded-xl px-4 py-2.5 text-sm text-cream-paper focus:border-cyan-accent outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-5 py-2.5 rounded-xl bg-cyan-accent text-slate-midnight font-bold font-mono text-xs hover:bg-cyan-glow transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function CandidatePreview({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="p-4 rounded-xl bg-slate-midnight border border-aqua-spotlight/40 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="font-bold text-cream-paper text-lg truncate">{candidate.member.name}</span>
        <span className="font-mono text-xs text-cyan-accent shrink-0">{candidate.member.id}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-cream-muted">
        <div>
          Role: <span className="text-cream-paper">{candidate.member.jobRole}</span>
        </div>
        <div>
          YOE: <span className="text-cream-paper">{candidate.member.yearsExperience}</span>
        </div>
      </div>
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <span>{message}</span>
    </div>
  );
}

function FeedbackList({
  title,
  items,
  icon,
  className,
  titleClassName,
}: {
  title: string;
  items: string[];
  icon: ReactNode;
  className: string;
  titleClassName: string;
}) {
  return (
    <div className={`p-3 rounded-lg bg-slate-midnight border ${className}`}>
      <div className={`font-mono font-bold mb-2 uppercase ${titleClassName}`}>{title}</div>
      <ul className="space-y-1.5 text-cream-muted">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="flex items-start space-x-2">
            {icon}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
