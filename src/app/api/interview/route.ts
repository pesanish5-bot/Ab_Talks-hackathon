import { NextRequest, NextResponse } from "next/server";

// ─── Types matching candidates.json schema ────────────────────────
interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  skipped?: boolean;
  attempts?: number;
}

interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

interface CandidateProfile {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
}

// ─── Curriculum types from curriculum.json ────────────────────────
interface CurriculumDay {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

interface CurriculumModule {
  n: number;
  title: string;
  days: number[];
}

// ─── Import real data ─────────────────────────────────────────────
import curriculumJson from "../../../../curriculum.json";
import candidatesJson from "../../../../candidates.json";

const curriculumDays: CurriculumDay[] = (curriculumJson as any).days;
const curriculumModules: CurriculumModule[] = (curriculumJson as any).modules;

function getDayData(dayNum: number): CurriculumDay | undefined {
  return curriculumDays.find((d) => d.day === dayNum);
}

function getModuleForDay(dayNum: number): CurriculumModule | undefined {
  return curriculumModules.find((m) => dayNum >= m.days[0] && dayNum <= m.days[1]);
}

// ─── Session State ────────────────────────────────────────────────
interface SessionState {
  sessionId: string;
  candidate: CandidateProfile;
  history: { role: "user" | "assistant"; content: string }[];
  questionCount: number;
  coveredDays: number[];   // Using array since Set not serializable
  questionQueue: number[]; // Queue of day numbers to ask about
  currentDayIndex: number;
  analysis: {
    skippedDays: number[];
    failedDays: number[];
    struggleDays: number[];
    passedDays: number[];
    experienceLevel: string;
  };
}

const sessions: Record<string, SessionState> = {};

// ─── Question Generation ──────────────────────────────────────────

function generateQuestion(day: CurriculumDay, context: {
  wasSkipped: boolean;
  wasFailed: boolean;
  attempts?: number;
  experienceLevel: string;
}): string {
  const toolList = day.tools.slice(0, 3).join(", ");

  if (context.wasSkipped) {
    return `Day ${day.day} covered "${day.title}" (using ${toolList}), which you skipped during the program. Even without completing the mission, can you explain the core concept behind ${day.objectives[0].toLowerCase()}?`;
  }

  if (context.wasFailed) {
    return `On Day ${day.day} — "${day.title}" — you attempted the mission ${context.attempts || "multiple"} times but didn't pass. What challenges did you face, and can you explain how ${day.tools[0]} works in the context of ${day.objectives[0].toLowerCase()}?`;
  }

  if (context.attempts && context.attempts >= 3) {
    return `Day ${day.day} — "${day.title}" required ${context.attempts} attempts to complete. Walk me through ${day.objectives[0].toLowerCase()} and explain what made this topic challenging for you.`;
  }

  // Standard question for passed missions
  if (context.experienceLevel === "junior" || context.experienceLevel === "mid") {
    return `On Day ${day.day} you completed "${day.title}" using ${toolList}. Can you explain how you approached ${day.objectives[0].toLowerCase()}?`;
  }

  // Senior/staff level — deeper probing
  const advancedObj = day.objectives.length > 1 ? day.objectives[1] : day.objectives[0];
  return `Day ${day.day} — "${day.title}". Beyond the basics of ${day.tools[0]}, can you discuss the engineering tradeoffs involved in ${advancedObj.toLowerCase()}?`;
}

function buildQuestionQueue(candidate: CandidateProfile): {
  queue: number[];
  analysis: SessionState["analysis"];
} {
  const skippedDays: number[] = [];
  const failedDays: number[] = [];
  const struggleDays: number[] = [];
  const passedDays: number[] = [];

  for (const mission of candidate.missions) {
    if (mission.skipped) {
      skippedDays.push(mission.day);
    } else if (mission.passed === false) {
      failedDays.push(mission.day);
    } else if (mission.passed) {
      passedDays.push(mission.day);
      if (mission.attempts && mission.attempts >= 3) {
        struggleDays.push(mission.day);
      }
    }
  }

  const yoe = candidate.member.yearsExperience;
  const experienceLevel = yoe <= 1 ? "junior" : yoe <= 5 ? "mid" : yoe <= 15 ? "senior" : "staff";

  // Build queue: skipped → failed → struggled → passed, ensuring module coverage
  const queue: number[] = [];
  const coveredModules = new Set<number>();

  const addDay = (dayNum: number) => {
    if (!queue.includes(dayNum)) {
      const dayData = getDayData(dayNum);
      if (dayData) {
        queue.push(dayNum);
        const mod = getModuleForDay(dayNum);
        if (mod) coveredModules.add(mod.n);
      }
    }
  };

  // Priority ordering
  skippedDays.forEach(addDay);
  failedDays.forEach(addDay);
  struggleDays.forEach(addDay);
  passedDays.forEach(addDay);

  // Ensure min 4 modules covered — fill from curriculum if needed
  if (coveredModules.size < 4) {
    for (const day of curriculumDays) {
      if (coveredModules.size >= 4 && queue.length >= 10) break;
      const mod = getModuleForDay(day.day);
      if (mod && !coveredModules.has(mod.n) && !queue.includes(day.day)) {
        queue.push(day.day);
        coveredModules.add(mod.n);
      }
    }
  }

  // Ensure at least 10 questions available
  while (queue.length < 10) {
    for (const day of curriculumDays) {
      if (queue.length >= 10) break;
      if (!queue.includes(day.day)) {
        queue.push(day.day);
      }
    }
  }

  return {
    queue,
    analysis: { skippedDays, failedDays, struggleDays, passedDays, experienceLevel },
  };
}

function getMissionForDay(candidate: CandidateProfile, dayNum: number): CandidateMission | undefined {
  return candidate.missions.find((m) => m.day === dayNum);
}

function generateFeedback(session: SessionState): {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
} {
  const { candidate, analysis, coveredDays } = session;
  const name = candidate.member.name;
  const role = candidate.member.jobRole;

  // Build feedback from covered topics
  const coveredTopics = coveredDays
    .map((d) => getDayData(d))
    .filter(Boolean)
    .map((d) => d!.title);

  const passedTopics = analysis.passedDays
    .map((d) => getDayData(d))
    .filter(Boolean)
    .map((d) => `${d!.title} (Day ${d!.day})`);

  const skippedTopics = analysis.skippedDays
    .map((d) => getDayData(d))
    .filter(Boolean)
    .map((d) => `${d!.title} (Day ${d!.day})`);

  const failedTopics = analysis.failedDays
    .map((d) => getDayData(d))
    .filter(Boolean)
    .map((d) => `${d!.title} (Day ${d!.day})`);

  const struggleTopics = analysis.struggleDays
    .map((d) => {
      const dayData = getDayData(d);
      const mission = getMissionForDay(candidate, d);
      return dayData ? `${dayData.title} (Day ${d}, ${mission?.attempts} attempts)` : null;
    })
    .filter(Boolean) as string[];

  const commitRate = Math.round((candidate.signals.commitDays / 31) * 100);
  const firstTryRate = candidate.signals.missionsCompleted > 0
    ? Math.round((candidate.signals.missionsFirstTry / candidate.signals.missionsCompleted) * 100)
    : 0;

  const summary = `${name} (${role}, ${candidate.member.yearsExperience} YOE) completed the technical interview covering ${session.questionCount} questions across ${coveredDays.length} curriculum days. Overall commit rate: ${commitRate}% (${candidate.signals.commitDays}/31 days). First-try pass rate: ${firstTryRate}%. The candidate demonstrated knowledge across ${coveredTopics.slice(0, 4).join(", ")}.${skippedTopics.length > 0 ? ` Notable gaps exist in skipped topics: ${skippedTopics.join(", ")}.` : ""}${failedTopics.length > 0 ? ` Failed missions: ${failedTopics.join(", ")}.` : ""}`;

  const strengths: string[] = [];
  if (firstTryRate >= 50) {
    strengths.push(`Strong first-attempt success rate (${firstTryRate}%) indicating solid comprehension across ${candidate.signals.missionsFirstTry} missions.`);
  }
  if (commitRate >= 80) {
    strengths.push(`Excellent engagement with ${commitRate}% commit day attendance (${candidate.signals.commitDays}/31 days).`);
  }
  for (const day of analysis.passedDays.slice(0, 3)) {
    const d = getDayData(day);
    const m = getMissionForDay(candidate, day);
    if (d && m && m.attempts === 1) {
      strengths.push(`Mastered "${d.title}" (Day ${day}) on first attempt using ${d.tools.slice(0, 2).join(", ")}.`);
    }
  }
  if (strengths.length === 0) {
    strengths.push(`Completed ${candidate.signals.missionsCompleted} missions throughout the program.`);
  }

  const gaps: string[] = [];
  for (const topic of skippedTopics) {
    gaps.push(`Skipped: ${topic} — no exposure to this curriculum area.`);
  }
  for (const topic of failedTopics) {
    gaps.push(`Did not pass: ${topic} — requires further study.`);
  }
  for (const topic of struggleTopics.slice(0, 2)) {
    gaps.push(`Struggled with: ${topic} — review fundamentals.`);
  }
  if (gaps.length === 0) {
    gaps.push("No significant gaps identified — candidate showed broad comprehension.");
  }

  const next: string[] = [];
  for (const dayNum of analysis.skippedDays.slice(0, 2)) {
    const d = getDayData(dayNum);
    if (d) next.push(`Complete the skipped Day ${dayNum} mission: "${d.title}" using ${d.tools.join(", ")}.`);
  }
  for (const dayNum of analysis.failedDays.slice(0, 2)) {
    const d = getDayData(dayNum);
    if (d) next.push(`Re-attempt Day ${dayNum}: "${d.title}" — focus on ${d.objectives[0].toLowerCase()}.`);
  }
  for (const dayNum of analysis.struggleDays.slice(0, 2)) {
    const d = getDayData(dayNum);
    if (d && !next.some((n) => n.includes(`Day ${dayNum}`))) {
      next.push(`Review Day ${dayNum}: "${d.title}" — strengthen understanding of ${d.tools[0]}.`);
    }
  }
  if (next.length === 0) {
    next.push("Continue to advanced topics and explore production deployment patterns.");
    next.push("Consider contributing to open-source AI/ML projects to deepen practical skills.");
  }

  return { summary, strengths, gaps, next };
}

// ─── API Handler ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, candidate, message } = body;

    // Validate sessionId
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "sessionId is required and must be a string." } },
        { status: 400 }
      );
    }

    // ─── Initial Turn: Start Interview ──────────────────────────
    if (candidate) {
      // Validate candidate shape matches candidates.json schema
      if (!candidate.member || !candidate.missions || !candidate.signals) {
        return NextResponse.json(
          { error: { code: "INVALID_CANDIDATE", message: "candidate must contain member, missions, and signals fields." } },
          { status: 422 }
        );
      }

      const { queue, analysis } = buildQuestionQueue(candidate as CandidateProfile);

      const firstDayNum = queue[0];
      const firstDay = getDayData(firstDayNum);
      if (!firstDay) {
        return NextResponse.json(
          { error: { code: "SERVER_ERROR", message: "Failed to load curriculum data." } },
          { status: 500 }
        );
      }

      const mission = getMissionForDay(candidate, firstDayNum);
      const firstQuestion = generateQuestion(firstDay, {
        wasSkipped: !!mission?.skipped,
        wasFailed: mission?.passed === false,
        attempts: mission?.attempts,
        experienceLevel: analysis.experienceLevel,
      });

      const greeting = `Welcome, ${candidate.member.name}! I'm your ABTalks AI technical interviewer. I see you're a ${candidate.member.jobRole} with ${candidate.member.yearsExperience} years of experience. You completed ${candidate.signals.missionsCompleted} missions during the 31-day AI Cohort with ${candidate.signals.missionsFirstTry} first-try passes. Let's dive in.\n\n${firstQuestion}`;

      const session: SessionState = {
        sessionId,
        candidate,
        history: [{ role: "assistant", content: greeting }],
        questionCount: 1,
        coveredDays: [firstDayNum],
        questionQueue: queue,
        currentDayIndex: 0,
        analysis,
      };

      sessions[sessionId] = session;

      return NextResponse.json({
        reply: greeting,
        done: false,
      });
    }

    // ─── Subsequent Turn: Conversation ──────────────────────────
    if (!sessions[sessionId]) {
      return NextResponse.json(
        { error: { code: "SESSION_NOT_FOUND", message: `Session '${sessionId}' not found. Start a new interview by sending a candidate object.` } },
        { status: 404 }
      );
    }

    const session = sessions[sessionId];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "message field is required for conversation turns." } },
        { status: 400 }
      );
    }

    // Record user answer
    session.history.push({ role: "user", content: message });
    session.questionCount += 1;

    // Move to next question
    session.currentDayIndex += 1;

    // Calculate unique covered modules
    const coveredModuleSet = new Set(
      session.coveredDays.map((d) => getModuleForDay(d)?.n).filter(Boolean)
    );

    // ─── Check Terminal Criteria ────────────────────────────────
    const hasEnoughQuestions = session.questionCount >= 8;
    const hasEnoughDays = coveredModuleSet.size >= 4;

    if (hasEnoughQuestions && hasEnoughDays) {
      // Generate structured feedback
      const feedback = generateFeedback(session);

      const closingReply = `Thank you for completing this technical interview, ${session.candidate.member.name}! We covered ${session.questionCount} questions across ${session.coveredDays.length} curriculum days spanning ${coveredModuleSet.size} modules. Your detailed performance evaluation is ready.`;

      session.history.push({ role: "assistant", content: closingReply });

      // Clean up session after a delay (in production, use TTL)
      setTimeout(() => { delete sessions[sessionId]; }, 300000); // 5 min

      return NextResponse.json({
        reply: closingReply,
        done: true,
        feedback,
      });
    }

    // ─── Generate Next Question ─────────────────────────────────
    const nextDayNum = session.questionQueue[session.currentDayIndex % session.questionQueue.length];
    const nextDay = getDayData(nextDayNum);

    if (!nextDay) {
      return NextResponse.json({
        reply: "Let's continue. Can you tell me about your overall experience with the AI Cohort program?",
        done: false,
      });
    }

    if (!session.coveredDays.includes(nextDayNum)) {
      session.coveredDays.push(nextDayNum);
    }

    const nextMission = getMissionForDay(session.candidate, nextDayNum);
    const nextQuestion = generateQuestion(nextDay, {
      wasSkipped: !!nextMission?.skipped,
      wasFailed: nextMission?.passed === false,
      attempts: nextMission?.attempts,
      experienceLevel: session.analysis.experienceLevel,
    });

    const transition = `Thanks for your response. Let's move to the next topic.\n\n${nextQuestion}`;

    session.history.push({ role: "assistant", content: transition });

    return NextResponse.json({
      reply: transition,
      done: false,
    });

  } catch (error) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "An unexpected error occurred processing the interview turn." } },
      { status: 500 }
    );
  }
}
