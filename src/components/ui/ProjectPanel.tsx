import { useEffect } from "react";
import { projects } from "../../data/projects";
import { useJourneyStore } from "../../state/journeyStore";
import "./project-panel.css";

export default function ProjectPanel() {
  const activeProject = useJourneyStore((s) => s.activeProject);
  const setActiveProject = useJourneyStore((s) => s.setActiveProject);
  const project = projects.find((p) => p.id === activeProject);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, setActiveProject]);

  if (!project) return null;

  return (
    <div className="project-panel-backdrop" onClick={() => setActiveProject(null)}>
      <div className="project-panel glass" role="dialog" aria-modal="true" aria-label={project.name} onClick={(e) => e.stopPropagation()}>
        <button className="project-panel__close" onClick={() => setActiveProject(null)} aria-label="Close">
          ×
        </button>
        <p className="project-panel__stack" style={{ color: project.accent }}>
          {project.stack}
        </p>
        <h3>{project.name}</h3>
        <p className="project-panel__desc">{project.description}</p>
        <ol className="project-panel__flow">
          {project.flow.map((step) => (
            <li key={step.label}><span>{step.label}</span></li>
          ))}
        </ol>
      </div>
    </div>
  );
}
