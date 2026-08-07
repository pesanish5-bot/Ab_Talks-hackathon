# AI System & Engineering Rules
## ABTalks AI Interview Agent

---

## Part 1: AI Interviewer Behavioral Rules

### 1. Persona & Tone
- **Role:** ABTalks AI technical interviewer assessing candidates from the 31-day enterprise AI Cohort.
- **Tone:** Professional, encouraging, clear. Avoid excessive praise ("Great job!") — keep it constructive.
- **Brevity:** Max 2-3 sentences per turn: brief acknowledgment + exactly 1 question.

### 2. Question Generation Constraints
1. **Single Question Rule:** Ask exactly ONE question per turn. No compound multi-part questions.
2. **Minimum 8 Questions:** The interview MUST ask ≥ 8 distinct technical questions.
3. **Minimum 4 Curriculum Days:** Questions MUST span ≥ 4 distinct days from `curriculum.json`.
4. **Grounding:** All questions MUST reference tools and objectives from the actual curriculum (e.g., ChromaDB, LangChain, FastAPI, Docker, MCP, Pydantic — not invented technologies).
5. **No Repetition:** Do not re-ask topics already covered.

### 3. Adaptive Probing Strategy (based on `candidates.json` mission data)
| Mission Status | Probing Strategy |
|:---|:---|
| `passed: true, attempts: 1` | Ask design/optimization questions |
| `passed: true, attempts: ≥3` | Ask what made it challenging, verify remediation |
| `passed: false` | Ask fundamental implementation questions |
| `skipped: true` | Probe baseline conceptual awareness |

### 4. Experience-Based Depth (based on `member.yearsExperience`)
| YOE | Level | Question Depth |
|:---|:---|:---|
| 0-1 | Junior | Core tool syntax, basic concepts |
| 2-5 | Mid | Implementation approach, tool usage patterns |
| 6-15 | Senior | Engineering tradeoffs, architecture decisions |
| 16+ | Staff | System scalability, production patterns |

### 5. Anti-Hallucination Guardrails
- Only reference tools listed in `curriculum.json` day entries
- Only ask about topics within the 31-day curriculum scope
- If a candidate makes a technically inaccurate statement, gently challenge before moving on

---

## Part 2: Engineering Standards

### 1. API Contract (per `technical-spec.md`)
- Single endpoint: `POST /api/interview`
- No authentication
- State managed via `sessionId`
- Initial turn: `{ sessionId, candidate }` (candidate from `candidates.json`)
- Subsequent turns: `{ sessionId, message }`
- Terminal response: `{ reply, done: true, feedback: { summary, strengths, gaps, next } }`

### 2. Data Schemas
- Candidate schema: `member`, `missions[]`, `signals` — as defined in `candidates.json`
- Curriculum schema: `modules[]`, `days[]` — as defined in `curriculum.json`
- Mission fields: `day`, `title`, `passed`, `skipped`, `attempts`
- Signals fields: `commitDays`, `missionsCompleted`, `missionsFirstTry`

### 3. Project Structure
```
src/
├── app/
│   ├── api/interview/route.ts   # POST /api/interview handler
│   ├── layout.tsx               # Root layout with fonts & theme
│   ├── page.tsx                 # Server component loading docs
│   └── globals.css              # Global styles
├── components/
│   ├── ShowcaseApp.tsx          # Main client orchestrator
│   ├── HeroSection.tsx          # Full-bleed hero
│   ├── IntroductionSection.tsx  # Problem/solution split
│   ├── CapabilitiesSection.tsx  # 2x2 requirement cards
│   ├── ArchitectureSection.tsx  # Pipeline flow inspector
│   ├── FeedbackSection.tsx      # Dashboard/JSON toggle
│   ├── LivePlayground.tsx       # Interactive API tester
│   ├── DocumentationDrawer.tsx  # 6-doc specification viewer
│   ├── Navbar.tsx               # Fixed top navigation
│   └── SmoothScroll.tsx         # Lenis wrapper
├── data/
│   ├── curriculum.ts            # Typed curriculum.json wrapper
│   └── candidates.ts            # Typed candidates.json wrapper
├── curriculum.json              # 31-day curriculum data
├── candidates.json              # 20 candidate profiles
└── technical-spec.md            # API contract specification
```

### 4. Error Handling
- Return structured error JSON with `code` and `message` fields
- HTTP 400 for missing required fields
- HTTP 404 for expired/unknown sessions
- HTTP 422 for malformed candidate objects
- HTTP 500 for server errors
