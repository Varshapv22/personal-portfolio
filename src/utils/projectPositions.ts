import { chapterWorldRanges } from "./path";
import { projects, type Project } from "../data/projects";

export interface ProjectPortalPosition {
  project: Project;
  position: [number, number, number];
  rotationY: number;
}

const range = chapterWorldRanges.find((r) => r.id === "projects")!;

// Single source of truth for each project's portal-ring placement along the
// path — consumed by ProjectsScene (renders the ring) and PortalPopup (the
// proximity popup) so the two never drift out of sync.
export const projectPortalPositions: ProjectPortalPosition[] = projects.map((p, i) => {
  const z = range.startZ + range.length * ((i + 0.5) / projects.length);
  const side = i % 2 === 0 ? -1 : 1;
  const x = side * (2.4 + (i % 3) * 0.5);
  const rotationY = side > 0 ? -0.5 : 0.5;
  return { project: p, position: [x, 1.4, z], rotationY };
});
