import { useEffect, useRef } from "react";
import { scrollHandle } from "../state/scrollControl";
import { journeyProgress, useJourneyStore } from "../state/journeyStore";
import { chapterRanges, chapterIndexAt } from "../data/chapters";

// Fraction of total scroll distance covered per second while key is held
const WALK_SPEED = 0.04;

// Shared set so the hint component can reflect active keys via subscription
export const activeWalkKeys = new Set<string>();
export const walkKeyListeners = new Set<() => void>();

function notifyKeyListeners() {
  walkKeyListeners.forEach((fn) => fn());
}

export function useKeyboardWalk() {
  const started = useJourneyStore((s) => s.started);
  const held = useRef(new Set<string>());
  const raf = useRef<number | null>(null);
  const lastT = useRef(performance.now());

  useEffect(() => {
    if (!started) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) return;
      e.preventDefault();

      // One-shot chapter jump on left / right (ignore browser key-repeat)
      if ((key === "ArrowLeft" || key === "ArrowRight") && !held.current.has(key)) {
        const el = scrollHandle.el;
        if (el) {
          const max = el.scrollHeight - el.clientHeight;
          const t = journeyProgress.value;
          const idx = chapterIndexAt(t);
          const targetIdx =
            key === "ArrowLeft"
              ? Math.max(0, idx - 1)
              : Math.min(chapterRanges.length - 1, idx + 1);
          el.scrollTo({ top: max * chapterRanges[targetIdx].start, behavior: "auto" });
        }
      }

      if (!held.current.has(key)) {
        held.current.add(key);
        activeWalkKeys.add(key);
        notifyKeyListeners();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const { key } = e;
      held.current.delete(key);
      activeWalkKeys.delete(key);
      notifyKeyListeners();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    lastT.current = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - lastT.current, 80);
      lastT.current = now;

      const el = scrollHandle.el;
      if (el && (held.current.has("ArrowUp") || held.current.has("ArrowDown"))) {
        const max = el.scrollHeight - el.clientHeight;
        // ArrowUp → walk forward (scroll down), ArrowDown → walk backward
        const sign = held.current.has("ArrowUp") ? 1 : -1;
        const delta = sign * WALK_SPEED * (dt / 1000) * max;
        el.scrollTop = Math.max(0, Math.min(max, el.scrollTop + delta));
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      held.current.clear();
      activeWalkKeys.clear();
    };
  }, [started]);
}
