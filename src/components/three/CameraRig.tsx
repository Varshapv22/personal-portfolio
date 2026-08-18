import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { journeyCurve } from "../../utils/path";
import { journeyProgress, useJourneyStore, activeCameraRef } from "../../state/journeyStore";
import { chapterIndexAt } from "../../data/chapters";
import { projectPortalPositions } from "../../utils/projectPositions";

const UP = new THREE.Vector3(0, 1, 0);

// Popup shows once the walker is within NEAR_DIST of a project portal ring,
// stays open until they pass FAR_DIST — the gap avoids flicker at the boundary.
const NEAR_DIST = 4.5;
const FAR_DIST = 6;

function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

export default function CameraRig() {
  const { camera } = useThree();
  const reducedMotion = useJourneyStore((s) => s.reducedMotion);
  const setChapterIndex = useJourneyStore((s) => s.setChapterIndex);
  const setNearPortal = useJourneyStore((s) => s.setNearPortal);
  const nearPortalRef = useRef<string | null>(null);

  const desiredPos  = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const point   = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((_, delta) => {
    activeCameraRef.current = camera;

    const t = journeyProgress.value;
    const idx = chapterIndexAt(t);
    setChapterIndex(idx);

    journeyCurve.getPointAt(t, point);
    journeyCurve.getTangentAt(t, tangent);

    // Which project portal ring (if any) is the walker near right now —
    // drives both the ring's own glow-up (PortalGate) and the floating
    // proximity popup (PortalPopup), from this single proximity check.
    const current = nearPortalRef.current;
    let nextNear: string | null = null;
    if (current) {
      const p = projectPortalPositions.find((pp) => pp.project.id === current);
      if (p && Math.hypot(point.x - p.position[0], point.z - p.position[2]) < FAR_DIST) {
        nextNear = current;
      }
    }
    if (!nextNear) {
      let bestId: string | null = null;
      let bestDist = Infinity;
      for (const portal of projectPortalPositions) {
        const d = Math.hypot(point.x - portal.position[0], point.z - portal.position[2]);
        if (d < bestDist) {
          bestDist = d;
          bestId = portal.project.id;
        }
      }
      if (bestId !== null && bestDist < NEAR_DIST) nextNear = bestId;
    }
    if (nextNear !== current) {
      nearPortalRef.current = nextNear;
      setNearPortal(nextNear);
    }

    // All chapters use "follow": camera trails directly behind and above the
    // character so it always appears at the same angle throughout the journey.
    desiredPos.copy(point).addScaledVector(tangent, -3.6).addScaledVector(UP, 2.1);
    desiredLook.copy(point).addScaledVector(tangent, 3).addScaledVector(UP, 0.9);

    const lambda = reducedMotion ? 18 : 4.8;
    camera.position.x = damp(camera.position.x, desiredPos.x, lambda, delta);
    camera.position.y = damp(camera.position.y, desiredPos.y, lambda, delta);
    camera.position.z = damp(camera.position.z, desiredPos.z, lambda, delta);

    currentLook.current.x = damp(currentLook.current.x, desiredLook.x, lambda, delta);
    currentLook.current.y = damp(currentLook.current.y, desiredLook.y, lambda, delta);
    currentLook.current.z = damp(currentLook.current.z, desiredLook.z, lambda, delta);
    camera.lookAt(currentLook.current);
  });

  return null;
}
