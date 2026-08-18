export interface MacroPhase {
  label: string;
  chapterIds: string[];
}

export const macroPhases: MacroPhase[] = [
  { label: "Childhood",  chapterIds: ["childhood"] },
  { label: "School",     chapterIds: ["school"] },
  { label: "College",    chapterIds: ["college", "first-code", "certifications"] },
  { label: "BTRAC",      chapterIds: ["btrac"] },
  { label: "iOSS",       chapterIds: ["ioss"] },
  { label: "Projects",   chapterIds: ["projects"] },
  { label: "Contact",    chapterIds: ["contact"] },
];

export function macroPhaseIndexForChapter(chapterId: string): number {
  return macroPhases.findIndex((p) => p.chapterIds.includes(chapterId));
}
