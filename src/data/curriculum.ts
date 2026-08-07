import curriculumData from "../../curriculum.json";

// ─── Types ────────────────────────────────────────────────────────
export interface CurriculumDay {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

export interface CurriculumModule {
  n: number;
  title: string;
  days: number[];
}

export interface Curriculum {
  cohort: string;
  modules: CurriculumModule[];
  days: CurriculumDay[];
}

// ─── Data ─────────────────────────────────────────────────────────
export const curriculum = curriculumData as Curriculum;

// ─── Helpers ──────────────────────────────────────────────────────

export function getDayByNumber(dayNum: number): CurriculumDay | undefined {
  return curriculum.days.find((d) => d.day === dayNum);
}

export function getModuleForDay(dayNum: number): CurriculumModule | undefined {
  return curriculum.modules.find(
    (m) => dayNum >= m.days[0] && dayNum <= m.days[1]
  );
}

export function getAllTools(): string[] {
  const toolSet = new Set<string>();
  curriculum.days.forEach((d) => d.tools.forEach((t) => toolSet.add(t)));
  return Array.from(toolSet);
}

/**
 * Generates an interview question for a specific curriculum day.
 * Uses the day's title, tools, and first two objectives to ground the question.
 */
export function generateQuestionForDay(day: CurriculumDay): string {
  const toolList = day.tools.slice(0, 3).join(", ");
  const objective = day.objectives[0];
  return `Regarding Day ${day.day} — "${day.title}" (tools: ${toolList}): ${objective}. Can you walk me through your approach and explain the key concepts involved?`;
}

/**
 * Returns a curated set of questions covering different modules,
 * prioritizing days the candidate attempted or skipped.
 */
export function selectInterviewDays(
  candidateMissionDays: number[],
  skippedDays: number[],
  failedDays: number[],
  minQuestions: number = 8,
  minDaysCovered: number = 4
): CurriculumDay[] {
  const selected: CurriculumDay[] = [];
  const coveredModules = new Set<number>();

  // Priority 1: Skipped days (probe awareness)
  for (const dayNum of skippedDays) {
    const day = getDayByNumber(dayNum);
    const mod = getModuleForDay(dayNum);
    if (day && mod) {
      selected.push(day);
      coveredModules.add(mod.n);
    }
  }

  // Priority 2: Failed days (probe understanding gaps)
  for (const dayNum of failedDays) {
    const day = getDayByNumber(dayNum);
    const mod = getModuleForDay(dayNum);
    if (day && mod && !selected.find((s) => s.day === dayNum)) {
      selected.push(day);
      coveredModules.add(mod.n);
    }
  }

  // Priority 3: Passed days with high attempts (struggled topics)
  // Already handled by caller logic — just fill remaining from candidate missions
  for (const dayNum of candidateMissionDays) {
    if (selected.length >= minQuestions) break;
    const day = getDayByNumber(dayNum);
    const mod = getModuleForDay(dayNum);
    if (day && mod && !selected.find((s) => s.day === dayNum)) {
      selected.push(day);
      coveredModules.add(mod.n);
    }
  }

  // Priority 4: Fill from curriculum to meet min coverage
  if (coveredModules.size < minDaysCovered || selected.length < minQuestions) {
    for (const day of curriculum.days) {
      if (selected.length >= minQuestions && coveredModules.size >= minDaysCovered) break;
      const mod = getModuleForDay(day.day);
      if (mod && !selected.find((s) => s.day === day.day)) {
        selected.push(day);
        coveredModules.add(mod.n);
      }
    }
  }

  return selected.slice(0, Math.max(minQuestions + 2, selected.length));
}
