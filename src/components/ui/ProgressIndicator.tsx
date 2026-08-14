import { useJourneyStore } from "../../state/journeyStore";
import { chapters } from "../../data/chapters";
import { macroPhases, macroPhaseIndexForChapter } from "../../data/macroPhases";
import { chapterRanges } from "../../data/chapters";
import { scrollToGlobalT } from "../../state/scrollControl";
import "./progress-indicator.css";

export default function ProgressIndicator() {
  const chapterIndex = useJourneyStore((s) => s.chapterIndex);
  const started = useJourneyStore((s) => s.started);
  const chapter = chapters[chapterIndex];
  const activePhase = macroPhaseIndexForChapter(chapter.id);

  if (!started) return null;

  return (
    <nav className="progress-indicator" aria-label="Journey progress">
      <ol>
        {macroPhases.map((phase, i) => {
          const firstChapterId = phase.chapterIds[0];
          const range = chapterRanges.find((r) => r.id === firstChapterId);
          return (
            <li key={phase.label} className={i === activePhase ? "is-active" : i < activePhase ? "is-done" : ""}>
              <button
                onClick={() => range && scrollToGlobalT(range.start)}
                aria-current={i === activePhase ? "step" : undefined}
                title={phase.label}
              >
                <span className="progress-indicator__dot" aria-hidden="true" />
                <span className="progress-indicator__label">{phase.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
