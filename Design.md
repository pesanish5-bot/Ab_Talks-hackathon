# Technical Design & API Contracts Document
## ABTalks AI Interview Agent

---

## 1. API Contract Overview

The application exposes a single, unauthenticated HTTP endpoint: `POST /api/interview`. The API accepts JSON payloads and returns structured JSON responses. All data schemas are derived from the provided `candidates.json` and `curriculum.json` files.

---

## 2. API Endpoint Specification

### `POST /api/interview`

#### 2.1 Request Schema Variants

The endpoint receives two request forms depending on the conversation lifecycle:
1. **Initial Turn Request:** Contains `sessionId` and the full `candidate` object (matching `candidates.json` schema).
2. **Subsequent Turn Request:** Contains `sessionId` and candidate text `message`.

##### Candidate Schema (from `candidates.json`)

```json
{
  "sessionId": "abc-123",
  "candidate": {
    "member": {
      "id": "CAND-007",
      "name": "Ethan Brooks",
      "jobRole": "Computer Science Intern",
      "yearsExperience": 0,
      "education": "BS Computer Science (in progress)",
      "status": "COMPLETED"
    },
    "missions": [
      { "day": 1, "title": "VS Code & Python Environment Setup", "passed": true, "attempts": 1 },
      { "day": 7, "title": "Embeddings Explained", "passed": true, "attempts": 2 },
      { "day": 27, "title": "Security, Privacy & Guardrails", "skipped": true },
      { "day": 28, "title": "Docker & Kubernetes Deployment", "skipped": true }
    ],
    "signals": {
      "commitDays": 26,
      "missionsCompleted": 27,
      "missionsFirstTry": 22
    }
  }
}
```

#### 2.2 Initial Turn Response (`done: false`)
```json
{
  "reply": "Welcome, Ethan Brooks! I'm your ABTalks AI technical interviewer. I see you're a Computer Science Intern with 0 years of experience. You completed 27 missions with 22 first-try passes. Let's dive in.\n\nDay 27 covered 'Security, Privacy & Guardrails' which you skipped. Can you explain the core concept behind securing chatbot APIs?",
  "done": false
}
```

#### 2.3 Subsequent Turn Request
```json
{
  "sessionId": "abc-123",
  "message": "I understand that securing APIs involves authentication, input validation, and protecting against prompt injection attacks..."
}
```

#### 2.4 Terminal Turn Response (`done: true` with `feedback`)
```json
{
  "reply": "Thank you for completing this technical interview, Ethan Brooks! We covered 9 questions across 7 curriculum days spanning 5 modules.",
  "done": true,
  "feedback": {
    "summary": "Ethan Brooks (Computer Science Intern, 0 YOE) completed the technical interview covering 9 questions across 7 curriculum days. Commit rate: 84%. First-try pass rate: 81%. Strong comprehension across Embeddings, Prompt Engineering, and Multi-Agent Orchestration. Gaps in skipped topics: Security & Guardrails (Day 27) and Docker & Kubernetes (Day 28).",
    "strengths": [
      "Mastered 'Prompt Engineering Fundamentals' (Day 12) on first attempt.",
      "Mastered 'Multi-Agent Orchestration' (Day 22) on first attempt using CrewAI, LangGraph.",
      "Strong first-attempt success rate (81%) indicating solid comprehension across 22 missions."
    ],
    "gaps": [
      "Skipped: Security, Privacy & Guardrails (Day 27) — no exposure to prompt-injection safeguards.",
      "Skipped: Docker & Kubernetes Deployment (Day 28) — no exposure to containerization."
    ],
    "next": [
      "Complete the skipped Day 27 mission: 'Security, Privacy & Guardrails' using FastAPI, Authentication, Input Validation.",
      "Complete the skipped Day 28 mission: 'Docker & Kubernetes Deployment' using Docker, Kubernetes."
    ]
  }
}
```

---

## 3. Error Handling & Payload Contracts

| Status Code | Reason | Description |
| :--- | :--- | :--- |
| `400 Bad Request` | Missing `sessionId` or `message` | Required fields not provided. |
| `404 Not Found` | Session expired or not found | `sessionId` not in active session store. |
| `422 Unprocessable` | Invalid candidate schema | `candidate` missing `member`, `missions`, or `signals`. |
| `500 Server Error` | Upstream failure | Curriculum data load failure or unhandled exception. |

### Error Response Schema
```json
{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "Session 'abc-123' not found. Start a new interview by sending a candidate object."
  }
}
```

---

## 4. Internal Data Schemas

### 4.1 Candidate Profile (from `candidates.json`)
```typescript
interface CandidateMember {
  id: string;          // "CAND-001" through "CAND-020"
  name: string;
  jobRole: string;     // "Senior Data Engineer", "Computer Science Intern", etc.
  yearsExperience: number;  // 0 to 28
  education: string;
  status: string;      // "COMPLETED"
}

interface CandidateMission {
  day: number;         // 1-31 referencing curriculum.json days
  title: string;
  passed?: boolean;    // true if completed successfully
  skipped?: boolean;   // true if skipped entirely
  attempts?: number;   // number of attempts (0 if skipped)
}

interface CandidateSignals {
  commitDays: number;      // days with commits (out of 31)
  missionsCompleted: number;
  missionsFirstTry: number;
}

interface CandidateProfile {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
}
```

### 4.2 Curriculum Day (from `curriculum.json`)
```typescript
interface CurriculumDay {
  day: number;          // 1-31
  title: string;        // "Embeddings Explained", "Docker & Kubernetes Deployment"
  type: string;         // "SETUP", "BUILD", "AI_CORE", "LEARN", "SHIP_IT", etc.
  tools: string[];      // ["ChromaDB", "Sentence Transformers"]
  objectives: string[]; // Learning objectives for the day
}

interface CurriculumModule {
  n: number;            // 1-8
  title: string;        // "Embeddings & Vector Search", "Agentic AI & MCP"
  days: number[];       // [startDay, endDay] range
}
```

### 4.3 Interview Session State
```typescript
interface SessionState {
  sessionId: string;
  candidate: CandidateProfile;
  history: { role: "user" | "assistant"; content: string }[];
  questionCount: number;
  coveredDays: number[];     // Curriculum days covered so far
  questionQueue: number[];   // Prioritized queue of day numbers
  currentDayIndex: number;
  analysis: {
    skippedDays: number[];
    failedDays: number[];
    struggleDays: number[];
    passedDays: number[];
    experienceLevel: "junior" | "mid" | "senior" | "staff";
  };
}
```

---

## 5. Feedback Schema (from `technical-spec.md`)

| Field | Type | Description |
|:---|:---|:---|
| `summary` | `string` | High-level qualitative performance synthesis |
| `strengths` | `string[]` | Concise, actionable strength observations |
| `gaps` | `string[]` | Identified skill gaps tied to curriculum days |
| `next` | `string[]` | Actionable next steps referencing specific missions |
