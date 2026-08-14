import { create } from "zustand";
import { chapters } from "../data/chapters";

export type QualityTier = "high" | "medium" | "low";

interface JourneyState {
  started: boolean;
  chapterIndex: number;
  activeProject: string | null;
  audioOn: boolean;
  reducedMotion: boolean;
  quality: QualityTier;
  navOpen: boolean;
  start: () => void;
  setChapterIndex: (i: number) => void;
  setActiveProject: (id: string | null) => void;
  toggleAudio: () => void;
  setReducedMotion: (v: boolean) => void;
  setQuality: (q: QualityTier) => void;
  setNavOpen: (v: boolean) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  started: false,
  chapterIndex: 0,
  activeProject: null,
  audioOn: false,
  reducedMotion: false,
  quality: "high",
  navOpen: false,
  start: () => set({ started: true }),
  setChapterIndex: (i) =>
    set((s) => (s.chapterIndex === i ? s : { chapterIndex: Math.min(Math.max(i, 0), chapters.length - 1) })),
  setActiveProject: (id) => set({ activeProject: id }),
  toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setQuality: (q) => set({ quality: q }),
  setNavOpen: (v) => set({ navOpen: v }),
}));

// Non-reactive shared progress value written every frame by ScrollBridge and
// read directly by 3D components — avoids a React re-render on every scroll tick.
export const journeyProgress = { value: 0 };
