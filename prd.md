# Product Requirements Document (PRD)
## ABTalks AI Interview Agent

---

## 1. Problem Statement

The AI Cohort is a 31-day enterprise AI engineering program covering modern AI topics including:
- **Retrieval-Augmented Generation (RAG)**
- **Vector Databases** (ChromaDB, Pinecone)
- **Prompt Engineering** (zero-shot, few-shot, chain-of-thought)
- **Agentic AI** (LangChain Agents, CrewAI, LangGraph)
- **Model Context Protocol (MCP)**
- **AI Deployment** (Docker, Kubernetes, Monitoring)
- **Production AI Systems** (Evaluation, Security, Guardrails)

After completing the cohort, learners should be able to confidently explain the systems they built and the engineering decisions behind them. However, preparing for technical interviews and effectively communicating this knowledge remains the biggest challenge.

**The ABTalks AI Interview Agent** solves this by conducting personalized technical interviews based on each candidate's actual learning journey throughout the cohort.

---

## 2. What You're Given

### 2.1 Curriculum Data (`curriculum.json`)
A structured JSON containing the complete 31-day AI Cohort curriculum:
- **8 Modules:** Environment & Tooling, Data Foundations, Embeddings & Vector Search, LLM Core/Prompting/Fine-Tuning, Chatbot Application Build, Agentic AI & MCP, Evaluation/Security/Deployment, Production & Capstone
- **31 Daily Topics** with titles, types (SETUP, BUILD, AI_CORE, LEARN, SHIP_IT, OPTIMIZE, CAPSTONE), tools used, and learning objectives

### 2.2 Candidate Profiles (`candidates.json`)
20 candidate profiles describing each participant's progress:
- **Member Info:** ID (CAND-001 to CAND-020), name, jobRole, yearsExperience (0-28), education, status
- **Mission Logs:** Day number, title, passed/skipped/failed status, attempt counts
- **Learning Signals:** commitDays, missionsCompleted, missionsFirstTry

### 2.3 Technical Specification (`technical-spec.md`)
Defines the required API contract:
- Single endpoint: `POST /api/interview`
- No authentication required
- Session-based state management via `sessionId`
- Structured feedback output with `summary`, `strengths[]`, `gaps[]`, `next[]`

---

## 3. Core Features & Requirements

### 3.1 Conversational Technical Interview
- Conduct a realistic multi-turn technical interview (not a scripted questionnaire)
- Ask a **minimum of 8 questions** covering at least **4 different curriculum days**
- Generate follow-up questions based on previous responses
- Maintain conversation context throughout the interview

### 3.2 Adaptive Question Generation
- **Skipped Missions:** Probe basic conceptual awareness
- **Failed Missions:** Ask fundamental implementation and debugging questions
- **High-Attempt Missions (≥3):** Probe what made the topic challenging
- **First-Try Passes:** Ask design and optimization questions
- **Experience Scaling:** Adapt depth based on yearsExperience (junior ≤1 YOE, mid 2-5, senior 6-15, staff 15+)

### 3.3 Structured Feedback Generation
At interview completion, produce a JSON response with `done: true` and a `feedback` object containing:
- `summary` (string): High-level performance synthesis referencing commit rate, first-try rate, and topics covered
- `strengths` (string[]): Concise, actionable observations grounded in curriculum days and tools
- `gaps` (string[]): Identified skill gaps tied to skipped/failed/struggled curriculum days
- `next` (string[]): Actionable next steps referencing specific missions and tools

### 3.4 HTTP Endpoint (per `technical-spec.md`)
- `POST /api/interview` — unauthenticated
- Initial turn: `{ sessionId, candidate }` → `{ reply, done: false }`
- Subsequent turns: `{ sessionId, message }` → `{ reply, done: false }`
- Terminal turn: `{ reply, done: true, feedback: { summary, strengths, gaps, next } }`

---

## 4. Out of Scope
- Voice interaction
- User authentication
- Persistent user accounts
- Long-term conversation history
- Mobile applications

---

## 5. Success Metrics

| Metric | Target | Measurement |
| :--- | :--- | :--- |
| Minimum Question Count | ≥ 8 questions per interview | Session question counter |
| Curriculum Day Span | ≥ 4 distinct curriculum days | Covered days set tracking |
| Feedback Completeness | Non-empty summary, strengths, gaps, next | Schema validation |
| API Compliance | Matches technical-spec.md contract exactly | Integration testing |
| Candidate Coverage | Works with all 20 candidates from candidates.json | E2E testing per profile |
