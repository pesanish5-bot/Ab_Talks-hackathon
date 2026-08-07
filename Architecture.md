# System Architecture Document
## ABTalks AI Interview Agent

---

## 1. High-Level Architecture

The agent is a stateless API service that maintains interview state using in-memory sessions indexed by `sessionId`. It ingests candidate profiles from `candidates.json`, cross-references against the 31-day `curriculum.json`, and dynamically generates interview questions.

```
                   +----------------------------------+
                   |          HTTP Client             |
                   |  (Web Showcase / API Consumer)   |
                   +----------------------------------+
                                    |
                          POST /api/interview
                          { sessionId, candidate | message }
                                    v
+--------------------------------------------------------------------------+
|                         Next.js API Route Handler                        |
|  - Payload Validation (sessionId, candidate schema, message)             |
|  - Initial Turn vs Subsequent Turn Routing                               |
+--------------------------------------------------------------------------+
                     |                              |
                     v                              v
+-----------------------------+    +------------------------------------+
|    Session Memory Store     |    |    Candidate Profile Analyzer      |
| - In-Memory Dictionary     |    | - Extract skipped/failed/passed    |
| - Keyed by sessionId       |    | - Calculate firstTry rate          |
| - Tracks: history,         |    | - Determine experience level       |
|   questionCount,            |    |   (junior/mid/senior/staff)        |
|   coveredDays, queue        |    +------------------------------------+
+-----------------------------+                     |
                     |                              v
                     |         +------------------------------------+
                     |         |    Curriculum Retrieval Engine      |
                     |         | - Loads curriculum.json (31 days)  |
                     |         | - getDayByNumber(dayNum)           |
                     |         | - getModuleForDay(dayNum)          |
                     |         | - Question Queue Builder           |
                     |         |   Priority: skipped → failed →     |
                     |         |   struggled → passed               |
                     |         +------------------------------------+
                     |                              |
                     v                              v
+--------------------------------------------------------------------------+
|                      Adaptive Question Generator                         |
|  - Generates ONE question per turn                                       |
|  - Adapts based on: mission status, attempts, YOE                        |
|  - Tracks min 8 questions / min 4 curriculum days                        |
+--------------------------------------------------------------------------+
                                    |
              Terminal Criteria Met? (questions ≥ 8 AND modules ≥ 4)
                     |                              |
                    NO                             YES
                     |                              |
                     v                              v
            { reply, done: false }     +---------------------------+
                                       | Feedback Synthesizer      |
                                       | - Builds summary string   |
                                       | - strengths[] from        |
                                       |   firstTry passes         |
                                       | - gaps[] from skipped,    |
                                       |   failed, struggled       |
                                       | - next[] actionable steps |
                                       +---------------------------+
                                                    |
                                                    v
                                       { reply, done: true, feedback }
```

---

## 2. Data Sources

### 2.1 Curriculum Knowledge Base (`curriculum.json`)
```json
{
  "cohort": "AI Cohort · 31 days · 8 modules",
  "modules": [
    { "n": 1, "title": "Environment & Tooling", "days": [1, 3] },
    { "n": 2, "title": "Data Foundations", "days": [4, 6] },
    { "n": 3, "title": "Embeddings & Vector Search", "days": [7, 10] },
    { "n": 4, "title": "LLM Core, Prompting & Fine-Tuning", "days": [11, 15] },
    { "n": 5, "title": "Chatbot Application Build", "days": [16, 20] },
    { "n": 6, "title": "Agentic AI & MCP", "days": [21, 24] },
    { "n": 7, "title": "Evaluation, Security & Deployment", "days": [25, 28] },
    { "n": 8, "title": "Production & Capstone", "days": [29, 31] }
  ],
  "days": [
    { "day": 7, "title": "Embeddings Explained", "type": "AI_CORE",
      "tools": ["Sentence Transformers", "OpenAI Embeddings", "Scikit-learn"],
      "objectives": ["Understand text-to-vector conversion", "Generate embeddings..."] }
  ]
}
```

### 2.2 Candidate Profiles (`candidates.json`)
20 candidates with diverse backgrounds (0-28 YOE, roles from CS Intern to Distinguished Engineer):
```json
{
  "member": { "id": "CAND-001", "name": "Sarah Johnson", "jobRole": "Senior Data Engineer", "yearsExperience": 9 },
  "missions": [
    { "day": 7, "passed": true, "attempts": 1 },
    { "day": 29, "skipped": true }
  ],
  "signals": { "commitDays": 28, "missionsCompleted": 30, "missionsFirstTry": 20 }
}
```

---

## 3. Question Generation Pipeline

### 3.1 Question Queue Priority
1. **Skipped days** → Probe basic awareness ("even without completing, can you explain...")
2. **Failed days** → Probe understanding gaps ("what challenges did you face...")
3. **High-attempt days (≥3)** → Probe depth ("what made this challenging...")
4. **Passed days** → Standard competency check, scaled by YOE

### 3.2 Experience-Based Depth Scaling
| Experience Level | YOE Range | Question Focus |
|:---|:---|:---|
| Junior | 0-1 | Core mechanics, tool syntax, basic concepts |
| Mid | 2-5 | Implementation approach, debugging, tool usage |
| Senior | 6-15 | Engineering tradeoffs, architecture decisions |
| Staff | 16+ | System scalability, production patterns, leadership |

---

## 4. Technology Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, TypeScript) |
| **API Route** | `POST /api/interview` via Next.js Route Handlers |
| **Session State** | In-memory dictionary (keyed by sessionId) |
| **Data Sources** | `curriculum.json` (31 days) + `candidates.json` (20 profiles) |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Smooth Scroll** | Lenis |
| **Icons** | Lucide React |
