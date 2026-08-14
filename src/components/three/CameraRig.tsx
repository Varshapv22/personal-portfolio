import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { journeyCurve, introAnchor } from "../../utils/path";
import { journeyProgress, useJourneyStore } from "../../state/journeyStore";
import { chapters, chapterIndexAt, localProgressAt, INTRO_HOLD } from "../../data/chapters";

const UP = new THREE.Vector3(0, 1, 0);

function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

export default function CameraRig() {
  const { camera } = useThree();
  const reducedMotion = useJourneyStore((s) => s.reducedMotion);
  const setChapterIndex = useJourneyStore((s) => s.setChapterIndex);

  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useRef(new THREE.Vector3(0, 1, 0));
  const orbitAngle = useRef(0);

  useFrame((_, delta) => {
    const t = journeyProgress.value;
    const idx = chapterIndexAt(t);
    setChapterIndex(idx);
    const chapter = chapters[idx];
    const local = localProgressAt(t, idx);

    journeyCurve.getPointAt(t, point);
    journeyCurve.getTangentAt(t, tangent);
    right.crossVectors(tangent, UP).normalize();

    const inIntroHold = chapter.id === "childhood" && local < INTRO_HOLD;
    const style = inIntroHold ? "intro" : chapter.cameraStyle;
    const lambda = reducedMotion ? 18 : 4.8;

    if (style === "intro") {
      // Fixed shot on the floating tech-card cluster — deliberately does NOT
      // track `point` (unstable this close to the curve's t=0 start) or
      // scroll progress; it's a held frame, not something the camera dollies through.
      desiredPos.set(introAnchor.x + 0.6, introAnchor.y + 1.7, introAnchor.z + 3.6);
      desiredLook.set(introAnchor.x, introAnchor.y + 0.55, introAnchor.z - 0.6);
    } else if (style === "follow") {
      desiredPos.copy(point).addScaledVector(tangent, -3.6).addScaledVector(UP, 2.1);
      desiredLook.copy(point).addScaledVector(tangent, 3).addScaledVector(UP, 0.9);
    } else if (style === "closeup") {
      // 3/4 medium shot — character visible head-to-toe with scene context
      desiredPos.copy(point).addScaledVector(tangent, -3.8).addScaledVector(UP, 2.6).addScaledVector(right, 1.6);
      desiredLook.copy(point).addScaledVector(UP, 0.9);
    } else if (style === "orbit") {
      orbitAngle.current += delta * (reducedMotion ? 0 : 0.18);
      const radius = 5.2;
      desiredPos.copy(point).addScaledVector(UP, 2.2);
      desiredPos.x += Math.sin(orbitAngle.current) * radius;
      desiredPos.z += Math.cos(orbitAngle.current) * radius * 0.4;
      desiredLook.copy(point).addScaledVector(UP, 1);
    } else if (style === "wide") {
      desiredPos.copy(point).addScaledVector(tangent, -9).addScaledVector(UP, 5.2).addScaledVector(right, 2.2);
      desiredLook.copy(point).addScaledVector(tangent, 4).addScaledVector(UP, 1.2);
    } else {
      // interactive (project universe): slow reveal orbit, wide enough to see multiple portals
      orbitAngle.current += delta * (reducedMotion ? 0 : 0.08);
      const radius = 8 + local * 2;
      desiredPos.copy(point).addScaledVector(UP, 3.4);
      desiredPos.x += Math.sin(orbitAngle.current) * radius * 0.5;
      desiredPos.addScaledVector(tangent, -6);
      desiredLook.copy(point).addScaledVector(tangent, 6);
    }

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
