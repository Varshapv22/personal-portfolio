import { useRef } from "react";
import { chapters, chapterIndexAt, localProgressAt } from "../../data/chapters";
import { journeyProgress, useJourneyStore } from "../../state/journeyStore";
import { useRafLoop } from "../../hooks/useRafLoop";
import "./narrative-overlay.css";

const CAPTION_WINDOW = 0.16;
const FADE = 0.35; // fraction of window used for fade in/out
const PANEL_WINDOW = 0.42;

function triangularOpacity(local: number, at: number, window: number) {
  if (local < at || local > at + window) return 0;
  const p = (local - at) / window;
  const fadeIn = FADE;
  const fadeOut = 1 - FADE;
  if (p < fadeIn) return p / fadeIn;
  if (p > fadeOut) return 1 - (p - fadeOut) / (1 - fadeOut);
  return 1;
}

export default function NarrativeOverlay() {
  const started = useJourneyStore((s) => s.started);
  const captionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastCaption = useRef("");
  const lastPanel = useRef("");

  useRafLoop(() => {
    const t = journeyProgress.value;
    const idx = chapterIndexAt(t);
    const local = localProgressAt(t, idx);
    const chapter = chapters[idx];

    let best: { text: string; style: string; opacity: number } | null = null;
    for (const cap of chapter.captions) {
      const o = triangularOpacity(local, cap.at, CAPTION_WINDOW);
      if (o > 0 && (!best || o > best.opacity)) best = { text: cap.text, style: cap.style ?? "sub", opacity: o };
    }
    if (captionRef.current) {
      const key = best ? best.text : "";
      if (key !== lastCaption.current) {
        captionRef.current.textContent = best?.text ?? "";
        captionRef.current.dataset.style = best?.style ?? "sub";
        lastCaption.current = key;
      }
      captionRef.current.style.opacity = best ? String(best.opacity) : "0";
    }

    let bestPanel: { title: string; lines: string[]; opacity: number } | null = null;
    for (const panel of chapter.panels ?? []) {
      const o = triangularOpacity(local, panel.at, PANEL_WINDOW);
      if (o > 0 && (!bestPanel || o > bestPanel.opacity)) bestPanel = { ...panel, opacity: o };
    }
    if (panelRef.current) {
      const key = bestPanel ? bestPanel.title : "";
      if (key !== lastPanel.current) {
        panelRef.current.innerHTML = bestPanel
          ? `<strong>${bestPanel.title}</strong>` + bestPanel.lines.map((l) => `<span>${l}</span>`).join("")
          : "";
        lastPanel.current = key;
      }
      panelRef.current.style.opacity = bestPanel ? String(bestPanel.opacity) : "0";
    }
  }, started);

  return (
    <div className="narrative-overlay" aria-live="polite">
      <div ref={captionRef} className="narrative-caption" data-style="sub" />
      <div ref={panelRef} className="narrative-panel glass" />
    </div>
  );
}
