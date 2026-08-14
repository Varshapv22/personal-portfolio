export interface MacroPhase {
  label: string;
  chapterIds: string[];
}

export const macroPhases: MacroPhase[] = [
  { label: "Birth & Childhood", chapterIds: ["childhood"] },
  { label: "School", chapterIds: ["school"] },
  { label: "College", chapterIds: ["college", "first-code", "certifications"] },
  { label: "BTRAC", chapterIds: ["btrac", "momentum"] },
  { label: "iOSS", chapterIds: ["ioss"] },
  { label: "Engineering", chapterIds: ["skills", "database", "api", "payment", "ai", "engineering"] },
  { label: "Projects", chapterIds: ["projects"] },
  { label: "Present", chapterIds: ["current", "future", "contact"] },
];

export function macroPhaseIndexForChapter(chapterId: string): number {
  return macroPhases.findIndex((p) => p.chapterIds.includes(chapterId));
}
