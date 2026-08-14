import { useJourneyStore } from "../../state/journeyStore";
import "./accessibility-controls.css";

export default function AccessibilityControls() {
  const started = useJourneyStore((s) => s.started);
  const reducedMotion = useJourneyStore((s) => s.reducedMotion);
  const setReducedMotion = useJourneyStore((s) => s.setReducedMotion);

  if (!started) return null;

  return (
    <div className="a11y-controls glass">
      <label className="a11y-toggle" aria-label="Reduce motion">
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) => setReducedMotion(e.target.checked)}
          className="a11y-toggle__input"
        />
        <span className="a11y-toggle__track" aria-hidden="true">
          <span className="a11y-toggle__thumb" />
        </span>
        <span className="a11y-toggle__label">Reduce motion</span>
      </label>
    </div>
  );
}
