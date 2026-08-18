import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useJourneyStore, activeCameraRef } from "../../state/journeyStore";
import { projectPortalPositions } from "../../utils/projectPositions";
import { KIT_ICONS, OPEN_ICON } from "../../data/projectIcons";
import "./portal-popup.css";

// How far above the ring's world position the card anchors to, in world units.
const ANCHOR_Y_OFFSET = 1.2;

// Screen-space margins so the card never clips off an edge — the world-space
// offset above projects to wildly different pixel distances depending on how
// close the ring is to the camera (perspective), so the anchor alone isn't enough.
const EDGE_MARGIN_X = 140;
const TOP_MARGIN = 110;

const anchorWorld = new THREE.Vector3();
const camForward = new THREE.Vector3();
const camToAnchor = new THREE.Vector3();

export default function PortalPopup() {
  const started = useJourneyStore((s) => s.started);
  const nearPortalId = useJourneyStore((s) => s.nearPortalId);
  const activeProject = useJourneyStore((s) => s.activeProject);
  const setActiveProject = useJourneyStore((s) => s.setActiveProject);
  const cardRef = useRef<HTMLButtonElement>(null);

  const visible = started && activeProject === null && nearPortalId !== null;
  const portal = visible ? projectPortalPositions.find((p) => p.project.id === nearPortalId) : undefined;

  // Reproject the ring's 3D anchor to 2D screen space every frame. This runs
  // its own rAF loop (not r3f's useFrame) because PortalPopup lives outside
  // the <Canvas> tree, same as the rest of the 2D UI overlay.
  useEffect(() => {
    if (!portal) return;
    let raf = 0;
    const tick = () => {
      const camera = activeCameraRef.current;
      const el = cardRef.current;
      if (camera && el) {
        anchorWorld.set(portal.position[0], portal.position[1] + ANCHOR_Y_OFFSET, portal.position[2]);

        camera.getWorldDirection(camForward);
        camToAnchor.copy(anchorWorld).sub(camera.position);
        const inFrontOfCamera = camToAnchor.dot(camForward) > 0;

        anchorWorld.project(camera);
        const rawX = (anchorWorld.x * 0.5 + 0.5) * window.innerWidth;
        const rawY = (1 - (anchorWorld.y * 0.5 + 0.5)) * window.innerHeight;
        const sx = Math.min(Math.max(rawX, EDGE_MARGIN_X), window.innerWidth - EDGE_MARGIN_X);
        const sy = Math.max(rawY, TOP_MARGIN);

        if (inFrontOfCamera && anchorWorld.z < 1) {
          el.style.display = "flex";
          el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%)`;
        } else {
          el.style.display = "none";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [portal]);

  if (!portal) return null;
  const { project } = portal;

  return (
    <button
      ref={cardRef}
      className="pg-popup"
      style={{ "--pg-c": project.accent, display: "none" } as React.CSSProperties}
      onClick={() => setActiveProject(project.id)}
      aria-label={`View ${project.name} details`}
    >
      <span
        className="pg-popup__icon"
        dangerouslySetInnerHTML={{ __html: KIT_ICONS[project.kit] ?? KIT_ICONS["portal-jobs"] }}
      />
      <span className="pg-popup__body">
        <span className="pg-popup__badge">{project.category}</span>
        <span className="pg-popup__name">{project.name}</span>
        <span className="pg-popup__stack">{project.stack}</span>
      </span>
      <span className="pg-popup__cta" dangerouslySetInnerHTML={{ __html: OPEN_ICON }} />
    </button>
  );
}
