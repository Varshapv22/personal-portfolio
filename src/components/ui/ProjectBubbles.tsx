import { useJourneyStore } from "../../state/journeyStore";
import { projects } from "../../data/projects";
import "./project-bubbles.css";

const KIT_ICONS: Record<string, string> = {
  "portal-jobs":  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 12h20"/></svg>`,
  "portal-map":   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  "portal-ai":    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path d="M9 17s1 1 3 1 3-1 3-1"/></svg>`,
  "portal-shop":  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  "portal-turf":  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1"/></svg>`,
};

const OPEN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;

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
