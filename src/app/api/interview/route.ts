import { NextRequest, NextResponse } from "next/server";
import {
  getCandidateById,
  type CandidateMission,
  type CandidateProfile,
} from "@/data/candidates";
import {
  curriculum,
  getDayByNumber,
  getModuleForDay,
  type CurriculumDay,
} from "@/data/curriculum";

const REQUIRED_QUESTION_COUNT = 8;
const REQUIRED_MODULE_COUNT = 4;
const MAX_MESSAGE_LENGTH = 4_000;
const SESSION_TTL_MS = 30 * 60 * 1_000;

interface InterviewAnalysis {
  skippedDays: number[];
  failedDays: number[];
  struggleDays: number[];
  passedDays: number[];
  experienceLevel: "junior" | "mid" | "senior" | "staff";
}

interface SessionState {
  sessionId: string;
  candidate: CandidateProfile;
  history: { role: "user" | "assistant"; content: string }[];
  questionCount: number;
  coveredDays: number[];
  questionQueue: number[];
  currentDayIndex: number;
  analysis: InterviewAnalysis;
  followUpsForCurrentTopic: number;
  lastActiveAt: number;
}

const sessions = new Map<string, SessionState>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCandidateProfile(value: unknown): value is CandidateProfile {
  if (!isRecord(value) || !isRecord(value.member) || !isRecord(value.signals)) {
    return false;
  }

  const { member, signals, missions } = value;

  return (
    typeof member.id === "string" &&
    typeof member.name === "string" &&
    typeof member.jobRole === "string" &&
    typeof member.yearsExperience === "number" &&
    Number.isFinite(member.yearsExperience) &&
    typeof member.education === "string" &&
    typeof member.status === "string" &&
    typeof signals.commitDays === "number" &&
    Number.isFinite(signals.commitDays) &&
    typeof signals.missionsCompleted === "number" &&
    Number.isFinite(signals.missionsCompleted) &&
    typeof signals.missionsFirstTry === "number" &&
    Number.isFinite(signals.missionsFirstTry) &&
    Array.isArray(missions) &&
    missions.every(
      (mission) =>
        isRecord(mission) &&
        typeof mission.day === "number" &&
        Number.isInteger(mission.day) &&
        typeof mission.title === "string" &&
        (mission.passed === undefined || typeof mission.passed === "boolean") &&
        (mission.skipped === undefined || typeof mission.skipped === "boolean") &&
        (mission.attempts === undefined ||
          (typeof mission.attempts === "number" && Number.isFinite(mission.attempts)))
    )
  );
}

function getExperienceLevel(
  yearsExperience: number
): InterviewAnalysis["experienceLevel"] {
  if (yearsExperience <= 1) return "junior";
  if (yearsExperience <= 5) return "mid";
  if (yearsExperience <= 15) return "senior";
  return "staff";
}

function getCoveredModuleCount(days: number[]) {
  return new Set(
    days
      .map((day) => getModuleForDay(day)?.n)
      .filter((module): module is number => typeof module === "number")
  ).size;
}

function pruneExpiredSessions(now = Date.now()) {
  for (const [sessionId, session] of Array.from(sessions.entries())) {
    if (now - session.lastActiveAt > SESSION_TTL_MS) {
      sessions.delete(sessionId);
    }
  }
}

function generateQuestion(
  day: CurriculumDay,
  context: {
    wasSkipped: boolean;
    wasFailed: boolean;
    attempts?: number;
    experienceLevel: InterviewAnalysis["experienceLevel"];
  }
): string {
  const tools = day.tools.slice(0, 3).join(", ") || "the relevant tools";
  const primaryTool = day.tools[0] || "the relevant tooling";
  const primaryObjective = day.objectives[0] || "the core learning objective";

  if (context.wasSkipped) {
    return `Day ${day.day} covered "${day.title}" (using ${tools}), which you skipped during the program. Even without completing the mission, can you explain the core concept behind ${primaryObjective.toLowerCase()}?`;
  }

  if (context.wasFailed) {
    return `On Day ${day.day} — "${day.title}" — you attempted the mission ${context.attempts || "multiple"} times but did not pass. What challenges did you face, and how would you use ${primaryTool} to achieve ${primaryObjective.toLowerCase()}?`;
  }

  if (context.attempts && context.attempts >= 3) {
    return `Day ${day.day} — "${day.title}" required ${context.attempts} attempts to complete. Walk me through ${primaryObjective.toLowerCase()} and explain what made this topic challenging for you.`;
  }

  if (context.experienceLevel === "junior" || context.experienceLevel === "mid") {
    return `On Day ${day.day} you completed "${day.title}" using ${tools}. Can you explain how you approached ${primaryObjective.toLowerCase()}?`;
  }

  const advancedObjective = day.objectives[1] || primaryObjective;
  return `Day ${day.day} — "${day.title}". Beyond the basics of ${primaryTool}, can you discuss the engineering trade-offs involved in ${advancedObjective.toLowerCase()}?`;
}

function shouldAskFollowUp(session: SessionState, response: string): boolean {
  if (session.followUpsForCurrentTopic >= 1) return false;

  const currentDay = getDayByNumber(session.questionQueue[session.currentDayIndex]);
  if (!currentDay) return false;

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 24) return true;

  const focusTerms = [currentDay.title, ...currentDay.tools, ...currentDay.objectives]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 4);
  const responseText = response.toLowerCase();

  return !focusTerms.some((term) => responseText.includes(term));
}

function generateFollowUp(session: SessionState, response: string): string {
  const currentDay = getDayByNumber(session.questionQueue[session.currentDayIndex]);
  if (!currentDay) {
    return "Before we move on, can you give me one concrete example from your implementation?";
  }

  const primaryTool = currentDay.tools[0] || "the relevant tooling";
  const primaryObjective = currentDay.objectives[0] || "the core learning objective";
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount < 24) {
    return `Before we move on, give me one concrete example: how would you use ${primaryTool} to ${primaryObjective.toLowerCase()}?`;
  }

  return `Thanks. To make that more concrete, what trade-off would you make when using ${primaryTool}, and how would you validate the result?`;
}

function getMissionForDay(
  candidate: CandidateProfile,
  dayNumber: number
): CandidateMission | undefined {
  return candidate.missions.find((mission) => mission.day === dayNumber);
}

function buildQuestionQueue(candidate: CandidateProfile): {
  queue: number[];
  analysis: InterviewAnalysis;
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
      if ((mission.attempts || 0) >= 3) struggleDays.push(mission.day);
    }
  }

  const analysis: InterviewAnalysis = {
    skippedDays,
    failedDays,
    struggleDays,
    passedDays,
    experienceLevel: getExperienceLevel(candidate.member.yearsExperience),
  };
  const queue: number[] = [];
  const coveredModules = new Set<number>();

  const addDay = (dayNumber: number) => {
    if (queue.includes(dayNumber) || !getDayByNumber(dayNumber)) return;

    queue.push(dayNumber);
    const module = getModuleForDay(dayNumber);
    if (module) coveredModules.add(module.n);
  };

  // Target weak and high-effort topics first, then use completed work as context.
  [skippedDays, failedDays, struggleDays, passedDays]
    .flat()
    .forEach(addDay);

  // Guarantee breadth across the cohort curriculum before filling generic questions.
  for (const day of curriculum.days) {
    if (coveredModules.size >= REQUIRED_MODULE_COUNT) break;
    const module = getModuleForDay(day.day);
    if (module && !coveredModules.has(module.n)) addDay(day.day);
  }

  for (const day of curriculum.days) {
    if (queue.length >= REQUIRED_QUESTION_COUNT + 2) break;
    addDay(day.day);
  }

  return { queue, analysis };
}

function generateFeedback(session: SessionState) {
  const { candidate, analysis, coveredDays } = session;
  const coveredTopics = coveredDays
    .map(getDayByNumber)
    .filter((day): day is CurriculumDay => Boolean(day))
    .map((day) => day.title);
  const coveredTopicSummary = coveredTopics.slice(0, 4).join(", ") || "the cohort curriculum";

  const topicsForDays = (days: number[]) =>
    days
      .map(getDayByNumber)
      .filter((day): day is CurriculumDay => Boolean(day))
      .map((day) => `${day.title} (Day ${day.day})`);

  const skippedTopics = topicsForDays(analysis.skippedDays);
  const failedTopics = topicsForDays(analysis.failedDays);
  const struggledTopics = analysis.struggleDays
    .map((dayNumber) => {
      const day = getDayByNumber(dayNumber);
      const mission = getMissionForDay(candidate, dayNumber);
      return day
        ? `${day.title} (Day ${dayNumber}, ${mission?.attempts ?? "multiple"} attempts)`
        : null;
    })
    .filter((topic): topic is string => Boolean(topic));

  const commitRate = Math.round((candidate.signals.commitDays / 31) * 100);
  const firstTryRate =
    candidate.signals.missionsCompleted > 0
      ? Math.round(
          (candidate.signals.missionsFirstTry / candidate.signals.missionsCompleted) * 100
        )
      : 0;

  const summary = `${candidate.member.name} (${candidate.member.jobRole}, ${candidate.member.yearsExperience} YOE) completed ${session.questionCount} interview questions across ${coveredDays.length} curriculum days. Overall commit rate: ${commitRate}% (${candidate.signals.commitDays}/31 days). First-try pass rate: ${firstTryRate}%. The interview covered ${coveredTopicSummary}.${skippedTopics.length ? ` Notable gaps include skipped topics: ${skippedTopics.join(", ")}.` : ""}${failedTopics.length ? ` Missions needing follow-up: ${failedTopics.join(", ")}.` : ""}`;

  const strengths: string[] = [];
  if (firstTryRate >= 50) {
    strengths.push(
      `Strong first-attempt success rate (${firstTryRate}%) across ${candidate.signals.missionsFirstTry} missions.`
    );
  }
  if (commitRate >= 80) {
    strengths.push(
      `Excellent engagement with ${commitRate}% commit day attendance (${candidate.signals.commitDays}/31 days).`
    );
  }
  for (const dayNumber of analysis.passedDays.slice(0, 3)) {
    const day = getDayByNumber(dayNumber);
    const mission = getMissionForDay(candidate, dayNumber);
    if (day && mission?.attempts === 1) {
      strengths.push(
        `Mastered "${day.title}" (Day ${dayNumber}) on the first attempt using ${day.tools
          .slice(0, 2)
          .join(", ")}.`
      );
    }
  }
  if (!strengths.length) {
    strengths.push(`Completed ${candidate.signals.missionsCompleted} missions throughout the program.`);
  }

  const gaps = [
    ...skippedTopics.map((topic) => `Skipped: ${topic} — no recorded exposure to this area.`),
    ...failedTopics.map((topic) => `Did not pass: ${topic} — requires further study.`),
    ...struggledTopics.slice(0, 2).map((topic) => `Struggled with: ${topic} — review fundamentals.`),
  ];
  if (!gaps.length) gaps.push("No significant curriculum gaps were identified.");

  const next: string[] = [];
  for (const dayNumber of [...analysis.skippedDays, ...analysis.failedDays].slice(0, 2)) {
    const day = getDayByNumber(dayNumber);
    if (day) {
      next.push(
        `Revisit Day ${dayNumber}: "${day.title}" — focus on ${day.objectives[0] || "the core objectives"}.`
      );
    }
  }
  for (const dayNumber of analysis.struggleDays.slice(0, 2)) {
    const day = getDayByNumber(dayNumber);
    if (day && !next.some((recommendation) => recommendation.includes(`Day ${dayNumber}`))) {
      next.push(
        `Review Day ${dayNumber}: "${day.title}" — strengthen your understanding of ${
          day.tools[0] || "the main tools"
        }.`
      );
    }
  }
  if (!next.length) {
    next.push("Continue to advanced topics and explore production deployment patterns.");
    next.push("Build an end-to-end project to deepen practical AI engineering experience.");
  }

  return { summary, strengths, gaps, next };
}

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    const parsedBody: unknown = await request.json();
    if (!isRecord(parsedBody)) {
      return errorResponse("BAD_REQUEST", "Request body must be a JSON object.", 400);
    }
    body = parsedBody;
  } catch {
    return errorResponse("BAD_REQUEST", "Request body must be valid JSON.", 400);
  }

  const { sessionId, candidateId, candidate, message } = body;
  if (typeof sessionId !== "string" || !sessionId.trim() || sessionId.length > 128) {
    return errorResponse(
      "BAD_REQUEST",
      "sessionId is required, must be a non-empty string, and cannot exceed 128 characters.",
      400
    );
  }

  pruneExpiredSessions();

  // An initial request can use the safe candidateId lookup. The validated profile path
  // remains available for integrations that already send a complete profile.
  if (candidateId !== undefined || candidate !== undefined) {
    let interviewCandidate: CandidateProfile | undefined;

    if (candidateId !== undefined) {
      if (typeof candidateId !== "string" || !candidateId.trim()) {
        return errorResponse("BAD_REQUEST", "candidateId must be a non-empty string.", 400);
      }
      interviewCandidate = getCandidateById(candidateId);
      if (!interviewCandidate) {
        return errorResponse("CANDIDATE_NOT_FOUND", `Candidate '${candidateId}' was not found.`, 404);
      }
    } else if (isCandidateProfile(candidate)) {
      interviewCandidate = candidate;
    } else {
      return errorResponse(
        "INVALID_CANDIDATE",
        "candidate must contain valid member, missions, and signals fields.",
        422
      );
    }

    const { queue, analysis } = buildQuestionQueue(interviewCandidate);
    const firstDayNumber = queue[0];
    const firstDay = getDayByNumber(firstDayNumber);
    if (!firstDay) {
      return errorResponse("SERVER_ERROR", "No interview questions could be created.", 500);
    }

    const firstMission = getMissionForDay(interviewCandidate, firstDayNumber);
    const firstQuestion = generateQuestion(firstDay, {
      wasSkipped: Boolean(firstMission?.skipped),
      wasFailed: firstMission?.passed === false,
      attempts: firstMission?.attempts,
      experienceLevel: analysis.experienceLevel,
    });
    const greeting = `Welcome, ${interviewCandidate.member.name}! I'm your ABTalks technical interviewer. I see you're a ${interviewCandidate.member.jobRole} with ${interviewCandidate.member.yearsExperience} years of experience. You completed ${interviewCandidate.signals.missionsCompleted} missions during the 31-day AI Cohort with ${interviewCandidate.signals.missionsFirstTry} first-try passes. Let's begin.\n\n${firstQuestion}`;

    sessions.set(sessionId, {
      sessionId,
      candidate: interviewCandidate,
      history: [{ role: "assistant", content: greeting }],
      questionCount: 1,
      coveredDays: [firstDayNumber],
      questionQueue: queue,
      currentDayIndex: 0,
      analysis,
      followUpsForCurrentTopic: 0,
      lastActiveAt: Date.now(),
    });

    return NextResponse.json({ reply: greeting, done: false });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return errorResponse(
      "SESSION_NOT_FOUND",
      `Session '${sessionId}' was not found or has expired. Start a new interview.`,
      404
    );
  }

  if (typeof message !== "string" || !message.trim()) {
    return errorResponse("BAD_REQUEST", "message is required for conversation turns.", 400);
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return errorResponse(
      "MESSAGE_TOO_LONG",
      `message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
      413
    );
  }

  const normalizedMessage = message.trim();
  session.history.push({ role: "user", content: normalizedMessage });
  session.lastActiveAt = Date.now();

  const coveredModuleCount = getCoveredModuleCount(session.coveredDays);
  if (
    session.questionCount >= REQUIRED_QUESTION_COUNT &&
    coveredModuleCount >= REQUIRED_MODULE_COUNT
  ) {
    const feedback = generateFeedback(session);
    const closingReply = `Thank you for completing this technical interview, ${session.candidate.member.name}! We covered ${session.questionCount} questions across ${session.coveredDays.length} curriculum days spanning ${coveredModuleCount} modules. Your detailed performance evaluation is ready.`;
    session.history.push({ role: "assistant", content: closingReply });

    return NextResponse.json({ reply: closingReply, done: true, feedback });
  }

  if (shouldAskFollowUp(session, normalizedMessage)) {
    const followUp = generateFollowUp(session, normalizedMessage);
    session.followUpsForCurrentTopic += 1;
    session.history.push({ role: "assistant", content: followUp });
    return NextResponse.json({ reply: followUp, done: false, followUp: true });
  }

  const nextDayNumber = session.questionQueue[session.currentDayIndex + 1];
  const nextDay = getDayByNumber(nextDayNumber);
  if (!nextDay) {
    return errorResponse(
      "SERVER_ERROR",
      "The interview question queue is incomplete. Start a new interview.",
      500
    );
  }

  session.currentDayIndex += 1;
  session.questionCount += 1;
  session.followUpsForCurrentTopic = 0;
  if (!session.coveredDays.includes(nextDayNumber)) {
    session.coveredDays.push(nextDayNumber);
  }

  const nextMission = getMissionForDay(session.candidate, nextDayNumber);
  const nextQuestion = generateQuestion(nextDay, {
    wasSkipped: Boolean(nextMission?.skipped),
    wasFailed: nextMission?.passed === false,
    attempts: nextMission?.attempts,
    experienceLevel: session.analysis.experienceLevel,
  });
  const transition = `Thanks for your response. Let's move to the next topic.\n\n${nextQuestion}`;
  session.history.push({ role: "assistant", content: transition });

  return NextResponse.json({ reply: transition, done: false });
}
