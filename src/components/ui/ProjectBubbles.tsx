import { useCallback, useRef } from "react";
import { useJourneyStore } from "../../state/journeyStore";
import { projects } from "../../data/projects";
import { KIT_ICONS, OPEN_ICON } from "../../data/projectIcons";
import { scrollHandle, scrollToGlobalT } from "../../state/scrollControl";
import { projectPortalPositions } from "../../utils/projectPositions";
import { worldZToGlobalT } from "../../utils/path";
import "./project-bubbles.css";

// Each project's portal ring sits at a fixed point along the journey path —
// hovering its card walks the camera to that point so the real ring (glow,
// proximity popup) comes into view, rather than faking the highlight in 2D.
const portalTById: Record<string, number> = Object.fromEntries(
  projectPortalPositions.map((p) => [p.project.id, worldZToGlobalT(p.position[2])])
);

export default function ProjectBubbles() {
  const chapterIndex     = useJourneyStore((s) => s.chapterIndex);
  const activeProject    = useJourneyStore((s) => s.activeProject);
  const setActiveProject = useJourneyStore((s) => s.setActiveProject);
  const started          = useJourneyStore((s) => s.started);
  const cleanupRef = useRef<() => void>();

  // pb-root has its own overflow-y:auto (on short mobile screens the card
  // stack is taller than the visible strip) but it's a DOM sibling of drei's
  // real scroll container, not an ancestor — so once this list hits a scroll
  // boundary there's no scrollable ancestor for the browser to chain the
  // gesture to, and further wheel/swipe input just gets swallowed instead of
  // advancing the journey. Forward the leftover delta to the real scroll
  // container by hand once the list can't scroll any further in that direction.
  //
  // This has to be a callback ref, not a plain ref + useEffect(fn, []): the
  // component is always mounted and toggles between rendering the list and
  // returning null as the chapter changes, so a one-time mount effect can run
  // before the div ever exists and then never re-fire once it does.
  const rootRef = useCallback((el: HTMLDivElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = undefined;
    if (!el) return;

    const atTop = () => el.scrollTop <= 0;
    const atBottom = () => el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    const onWheel = (e: WheelEvent) => {
      if ((atTop() && e.deltaY < 0) || (atBottom() && e.deltaY > 0)) {
        scrollHandle.el?.scrollBy({ top: e.deltaY });
      }
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const delta = touchY - y; // positive: finger moving up → content scrolling down
      if ((atTop() && delta < 0) || (atBottom() && delta > 0)) {
        e.preventDefault();
        scrollHandle.el?.scrollBy({ top: delta });
      }
      touchY = y;
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    cleanupRef.current = () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  if (!started || chapterIndex !== 7 || activeProject !== null) return null;

  return (
    <div className="pb-root" ref={rootRef} role="list" aria-label="Project list">
      <p className="pb-heading">Tap a project to explore</p>

      <div className="pb-grid">
        {projects.map((p, i) => {
          const stackPills = p.stack.split("+").map((s) => s.trim()).slice(0, 3);
          return (
            <button
              key={p.id}
              role="listitem"
              className="pb-card"
              style={{
                "--pb-c":     p.accent,
                "--pb-delay": `${i * 0.1 + 0.05}s`,
              } as React.CSSProperties}
              onClick={() => setActiveProject(p.id)}
              onMouseEnter={() => scrollToGlobalT(portalTById[p.id], true)}
              aria-label={`View ${p.name} details`}
            >
              {/* Accent glow */}
              <span className="pb-card__glow" aria-hidden="true" />

              {/* Header row */}
              <span className="pb-card__header">
                <span
                  className="pb-card__icon"
                  dangerouslySetInnerHTML={{ __html: KIT_ICONS[p.kit] ?? KIT_ICONS["portal-jobs"] }}
                />
                <span className="pb-card__badge">{p.category}</span>
              </span>

              {/* Name */}
              <span className="pb-card__name">{p.name}</span>

              {/* Stack pills */}
              <span className="pb-card__stack">
                {stackPills.map((t) => (
                  <span key={t} className="pb-card__pill">{t}</span>
                ))}
              </span>

              {/* Footer CTA */}
              <span className="pb-card__footer">
                <span className="pb-card__cta">
                  <span dangerouslySetInnerHTML={{ __html: OPEN_ICON }} />
                  View details
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
