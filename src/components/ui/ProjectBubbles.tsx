import { useJourneyStore } from "../../state/journeyStore";
import { projects } from "../../data/projects";
import { KIT_ICONS, OPEN_ICON } from "../../data/projectIcons";
import "./project-bubbles.css";

export default function ProjectBubbles() {
  const chapterIndex     = useJourneyStore((s) => s.chapterIndex);
  const activeProject    = useJourneyStore((s) => s.activeProject);
  const setActiveProject = useJourneyStore((s) => s.setActiveProject);
  const started          = useJourneyStore((s) => s.started);

  if (!started || chapterIndex !== 7 || activeProject !== null) return null;

  return (
    <div className="pb-root" role="list" aria-label="Project list">
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
