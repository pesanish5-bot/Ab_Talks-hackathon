import candidatesData from "../../candidates.json";

// ─── Types ────────────────────────────────────────────────────────
export interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

export interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  skipped?: boolean;
  attempts?: number;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

export interface CandidateProfile {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
}

export interface CandidatesData {
  candidates: CandidateProfile[];
}

// ─── Data ─────────────────────────────────────────────────────────
export const candidatesStore = candidatesData as CandidatesData;

// ─── Helpers ──────────────────────────────────────────────────────

export function getCandidateById(id: string): CandidateProfile | undefined {
  return candidatesStore.candidates.find((c) => c.member.id === id);
}

export function getCandidateByName(name: string): CandidateProfile | undefined {
  return candidatesStore.candidates.find(
    (c) => c.member.name.toLowerCase() === name.toLowerCase()
  );
}

export function getAllCandidates(): CandidateProfile[] {
  return candidatesStore.candidates;
}

/**
 * Analyzes a candidate's mission data to extract interview targeting signals.
 */
export function analyzeCandidateProfile(candidate: CandidateProfile) {
  const passedDays: number[] = [];
  const skippedDays: number[] = [];
  const failedDays: number[] = [];
  const firstTryDays: number[] = [];
  const struggleDays: number[] = []; // passed but high attempts (>=3)

  for (const mission of candidate.missions) {
    if (mission.skipped) {
      skippedDays.push(mission.day);
    } else if (mission.passed === false) {
      failedDays.push(mission.day);
    } else if (mission.passed) {
      passedDays.push(mission.day);
      if (mission.attempts === 1) {
        firstTryDays.push(mission.day);
      }
      if (mission.attempts && mission.attempts >= 3) {
        struggleDays.push(mission.day);
      }
    }
  }

  const allMissionDays = candidate.missions.map((m) => m.day);

  return {
    passedDays,
    skippedDays,
    failedDays,
    firstTryDays,
    struggleDays,
    allMissionDays,
    experienceLevel: getExperienceLevel(candidate.member.yearsExperience),
    commitRate: Math.round((candidate.signals.commitDays / 31) * 100),
    firstTryRate: candidate.signals.missionsCompleted > 0
      ? Math.round((candidate.signals.missionsFirstTry / candidate.signals.missionsCompleted) * 100)
      : 0,
  };
}

function getExperienceLevel(yoe: number): "junior" | "mid" | "senior" | "staff" {
  if (yoe <= 1) return "junior";
  if (yoe <= 5) return "mid";
  if (yoe <= 15) return "senior";
  return "staff";
}
