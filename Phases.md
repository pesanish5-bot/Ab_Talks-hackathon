# Development Phases & Implementation Roadmap
## ABTalks AI Interview Agent

---

## Phase 1: API Scaffolding & Data Integration

### Goal
Set up the Next.js project, import `curriculum.json` and `candidates.json`, define TypeScript types, and implement the `POST /api/interview` endpoint skeleton.

### Tasks
1. Create typed data modules (`src/data/curriculum.ts`, `src/data/candidates.ts`)
2. Define TypeScript interfaces matching `candidates.json` schema: `CandidateMember`, `CandidateMission`, `CandidateSignals`, `CandidateProfile`
3. Define TypeScript interfaces matching `curriculum.json` schema: `CurriculumDay`, `CurriculumModule`
4. Implement `POST /api/interview` route handler with payload validation
5. Handle both initial turn (`sessionId` + `candidate`) and subsequent turns (`sessionId` + `message`)

### Exit Criteria
- API accepts real candidate payloads from `candidates.json`
- Returns `{ reply, done: false }` on valid requests
- Returns structured errors on invalid requests (400, 422, 404)

---

## Phase 2: Session State Management

### Goal
Build in-memory session store that tracks conversation history, question counts, and covered curriculum days across stateless HTTP requests.

### Tasks
1. Implement `SessionState` model with `questionCount`, `coveredDays[]`, `questionQueue[]`, `history[]`, and `analysis`
2. Create session on initial turn, retrieve on subsequent turns
3. Build question queue from candidate mission data (priority: skipped → failed → struggled → passed)
4. Track covered curriculum modules for terminal criteria

### Exit Criteria
- Sessions persist across multiple independent HTTP calls
- Question queue correctly prioritizes skipped and failed days
- Session lookup returns 404 for unknown `sessionId`

---

## Phase 3: Adaptive Question Generation

### Goal
Generate curriculum-grounded interview questions that adapt based on mission status and candidate experience level.

### Tasks
1. Load day data from `curriculum.json` for each question
2. Generate questions adapted to mission status (skipped vs failed vs struggled vs passed)
3. Scale question depth based on `yearsExperience` (junior/mid/senior/staff)
4. Enforce single-question-per-turn rule
5. Ensure questions reference real tools and objectives from curriculum

### Exit Criteria
- Agent asks different questions for CAND-003 (all first-try) vs CAND-010 (multiple failures)
- Questions reference actual tools (ChromaDB, LangChain, MCP, Docker, etc.)
- Min 8 questions asked before terminal state

---

## Phase 4: Feedback Generation

### Goal
Synthesize the complete interview into structured feedback when terminal criteria are met.

### Tasks
1. Implement terminal check: `questionCount ≥ 8` AND `coveredModules ≥ 4`
2. Build `summary` from candidate signals (commitDays, missionsFirstTry, topics covered)
3. Build `strengths[]` from first-try passes with tool references
4. Build `gaps[]` from skipped/failed/struggled missions
5. Build `next[]` with actionable steps referencing specific curriculum days and tools
6. Return `{ reply, done: true, feedback }` per `technical-spec.md`

### Exit Criteria
- All 20 candidates from `candidates.json` produce valid feedback
- Feedback arrays are non-empty and grounded in real curriculum data
- Response matches `technical-spec.md` contract exactly

---

## Phase 5: Showcase & Verification

### Goal
Build the project showcase interface and verify all components work end-to-end.

### Tasks
1. Build interactive showcase with all sections (Hero, Introduction, Capabilities, Architecture, Feedback)
2. Create live playground with real candidate selector (all 20 profiles)
3. Create standalone `index.html` + `style.css` showcase page
4. Test API with multiple candidate profiles
5. Verify `npm run build` compiles cleanly
6. Verify all 6 documentation files reference correct schemas

### Exit Criteria
- Showcase loads at `http://localhost:3000`
- Standalone `index.html` opens directly in browser
- API handles all 20 candidates without errors
