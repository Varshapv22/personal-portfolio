import { useEffect } from "react";
import { useJourneyStore } from "../state/journeyStore";

function detectTier(): "high" | "medium" | "low" {
  if (typeof navigator === "undefined") return "high";
  const mem = (navigator as any).deviceMemory as number | undefined;
  const cores = navigator.hardwareConcurrency ?? 4;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const coarsePointer = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

  let score = 0;
  score += cores >= 8 ? 2 : cores >= 4 ? 1 : 0;
  score += (mem ?? 4) >= 8 ? 2 : (mem ?? 4) >= 4 ? 1 : 0;
  score -= isMobile || coarsePointer ? 1 : 0;

  if (score >= 3) return "high";
  if (score >= 1) return "medium";
  return "low";
}

export function useDeviceCapability() {
  const setQuality = useJourneyStore((s) => s.setQuality);
  const setReducedMotion = useJourneyStore((s) => s.setReducedMotion);

  useEffect(() => {
    setQuality(detectTier());

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq) {
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    }
  }, [setQuality, setReducedMotion]);
}
