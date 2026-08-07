# Conversation Memory & State Management
## ABTalks AI Interview Agent

---

## 1. Stateless HTTP → Stateful Sessions

HTTP is stateless, but technical interviews require multi-turn context. The agent bridges this gap using session-keyed state management:

```
POST /api/interview { sessionId: "abc-123", message: "..." }
                        │
                        ▼
         ┌─────────────────────────────┐
         │   Session Key Lookup        │ ──[Not Found]──► Return 404
         └──────────────┬──────────────┘
                        │ [Found]
                        ▼
         ┌─────────────────────────────┐
         │ Load Session State          │
         │ - candidate (from           │
         │   candidates.json schema)   │
         │ - history[] (turns)         │
         │ - questionCount             │
         │ - coveredDays[]             │
         │ - questionQueue[]           │
         │ - analysis (skip/fail/etc)  │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │ Generate Next Question      │
         │ or Terminal Feedback        │
         └─────────────────────────────┘
```

---

## 2. Session State Structure

Each session stores the following (keyed by `sessionId`):

```typescript
interface SessionState {
  sessionId: string;
  candidate: {
    member: { id, name, jobRole, yearsExperience, education, status };
    missions: { day, title, passed?, skipped?, attempts? }[];
    signals: { commitDays, missionsCompleted, missionsFirstTry };
  };
  history: { role: "user" | "assistant"; content: string }[];
  questionCount: number;        // Tracks total questions asked
  coveredDays: number[];        // Curriculum days covered
  questionQueue: number[];      // Prioritized day numbers to ask about
  currentDayIndex: number;      // Current position in queue
  analysis: {
    skippedDays: number[];      // e.g., [27, 28] for Ethan Brooks
    failedDays: number[];       // e.g., [8, 10, 22] for Gerald Combs
    struggleDays: number[];     // passed but ≥3 attempts
    passedDays: number[];
    experienceLevel: "junior" | "mid" | "senior" | "staff";
  };
}
```

---

## 3. Question Queue Building Logic

On session initialization, the queue is built from the candidate's mission data:

```
Priority 1: Skipped days     → probe awareness
Priority 2: Failed days      → probe understanding gaps
Priority 3: Struggled days   → verify remediation (≥3 attempts)
Priority 4: Passed days      → standard competency check
Priority 5: Curriculum fill  → ensure ≥4 module coverage
```

### Example: Ethan Brooks (CAND-007)
```
Missions: Day 1✓(1), Day 3✓(1), Day 7✓(2), Day 8✓(1),
          Day 12✓(1), Day 16✓(1), Day 22✓(1),
          Day 27✗(skip), Day 28✗(skip), Day 31✓(2)

Queue Built: [27, 28, 7, 1, 3, 8, 12, 16, 22, 31]
  ↑ skipped first  ↑ struggled (2 attempts)  ↑ rest
```

---

## 4. Terminal State Transition

The interview completes when BOTH conditions are met:
1. `questionCount ≥ 8`
2. `coveredModules.size ≥ 4` (unique curriculum modules from `curriculum.json`)

At that point, the feedback synthesizer builds the response:
- Analyzes all covered days and mission data
- Computes commit rate (`signals.commitDays / 31`)
- Computes first-try rate (`signals.missionsFirstTry / signals.missionsCompleted`)
- Maps strengths from first-try passes with tool references
- Maps gaps from skipped/failed/struggled missions
- Generates next steps referencing specific curriculum days and tools

---

## 5. Cleanup & Expiration

- Sessions are cleaned up 5 minutes after interview completion
- In production, this would use Redis TTL with 60-minute rolling expiration
- No cross-session memory — each `sessionId` is fully independent
