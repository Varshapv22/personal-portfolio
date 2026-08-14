import { useEffect, useRef, useState } from "react";
import { useJourneyStore } from "../../state/journeyStore";
import { activeWalkKeys, walkKeyListeners } from "../../hooks/useKeyboardWalk";
import "./keyboard-hint.css";

const LABEL: Record<string, string> = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

export default function KeyboardHint() {
  const started = useJourneyStore((s) => s.started);
  const [active, setActive] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 5000);
  };

  useEffect(() => {
    if (!started) return;

    scheduleHide();

    const sync = () => {
      setActive(new Set(activeWalkKeys));
      if (activeWalkKeys.size > 0) {
        setVisible(true);
        scheduleHide();
      }
    };

    walkKeyListeners.add(sync);
    return () => {
      walkKeyListeners.delete(sync);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [started]);

  if (!started) return null;

  return (
    <div
      className="keyboard-hint"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div className="keyboard-hint__pad">
        {/* Top row: up */}
        <div className="keyboard-hint__row">
          <Key id="ArrowUp" label={LABEL.ArrowUp} active={active.has("ArrowUp")} />
        </div>
        {/* Middle row: left, down, right */}
        <div className="keyboard-hint__row">
          <Key id="ArrowLeft" label={LABEL.ArrowLeft} active={active.has("ArrowLeft")} />
          <Key id="ArrowDown" label={LABEL.ArrowDown} active={active.has("ArrowDown")} />
          <Key id="ArrowRight" label={LABEL.ArrowRight} active={active.has("ArrowRight")} />
        </div>
      </div>
      <p className="keyboard-hint__legend">
        <span>↑↓ Walk</span>
        <span className="keyboard-hint__sep">·</span>
        <span>← → Chapter</span>
      </p>
    </div>
  );
}

function Key({ id, label, active }: { id: string; label: string; active: boolean }) {
  void id;
  return (
    <span className={`keyboard-hint__key${active ? " is-active" : ""}`}>
      {label}
    </span>
  );
}
