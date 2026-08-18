import { useEffect } from "react";
import { projects } from "../../data/projects";
import { useJourneyStore } from "../../state/journeyStore";
import "./project-panel.css";

const KIT_ICONS: Record<string, string> = {
  "portal-jobs":  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 12h20"/></svg>`,
  "portal-map":   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  "portal-ai":    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path d="M9 17s1 1 3 1 3-1 3-1"/></svg>`,
  "portal-shop":  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  "portal-turf":  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1"/></svg>`,
};

const EXTERNAL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

export default function ProjectPanel() {
  const activeProject  = useJourneyStore((s) => s.activeProject);
  const dismissProject = useJourneyStore((s) => s.dismissProject);
  const project = projects.find((p) => p.id === activeProject);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissProject(project.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, dismissProject]);

  if (!project) return null;

  const techPills = project.stack.split("+").map((s) => s.trim());
  const svgIcon   = KIT_ICONS[project.kit] ?? KIT_ICONS["portal-jobs"];
  const cssVars   = { "--pm-c": project.accent } as React.CSSProperties;

  return (
    <div className="pm-backdrop" onClick={() => dismissProject(project.id)}>
      <div
        className="pm-card"
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        style={cssVars}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero header ── */}
        <div className="pm-hero">
          {/* Accent glow overlay — sits behind the content */}
          <div className="pm-hero__glow" aria-hidden="true" />

          <div className="pm-hero__icon" dangerouslySetInnerHTML={{ __html: svgIcon }} />

          <div className="pm-hero__text">
            <span className="pm-hero__cat">{project.category}</span>
            <h2 className="pm-hero__name">{project.name}</h2>
          </div>

          <button
            className="pm-close"
            onClick={() => dismissProject(project.id)}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6"  y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="pm-scrollable">

          {/* Tech stack pills */}
          <div className="pm-stack">
            {techPills.map((t) => (
              <span key={t} className="pm-pill">{t}</span>
            ))}
          </div>

          <div className="pm-body">
            {/* Description */}
            <div className="pm-section">
              <h4 className="pm-section__label">About</h4>
              <p className="pm-section__text">{project.description}</p>
            </div>

            {/* Pipeline */}
            <div className="pm-section">
              <h4 className="pm-section__label">How it works</h4>
              <div className="pm-flow">
                {project.flow.map((step, i) => (
                  <span key={step.label} className="pm-flow__step">
                    <span className="pm-flow__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="pm-flow__label">{step.label}</span>
                    {i < project.flow.length - 1 && (
                      <span className="pm-flow__arr" aria-hidden="true">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer / URL */}
          {project.url && (
            <div className="pm-footer">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pm-link"
              >
                <span dangerouslySetInnerHTML={{ __html: EXTERNAL_ICON }} />
                View Project
              </a>
              <span className="pm-url">
                {project.url === "#" ? "URL coming soon" : project.url}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
