import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { journeyCurve } from "../../utils/path";
import { journeyProgress, useJourneyStore } from "../../state/journeyStore";
import { chapters, chapterIndexAt } from "../../data/chapters";

const UP = new THREE.Vector3(0, 1, 0);

function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

export default function CameraRig() {
  const { camera } = useThree();
  const reducedMotion = useJourneyStore((s) => s.reducedMotion);
  const setChapterIndex = useJourneyStore((s) => s.setChapterIndex);

  const desiredPos  = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const point   = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((_, delta) => {
    const t = journeyProgress.value;
    const idx = chapterIndexAt(t);
    setChapterIndex(idx);

    journeyCurve.getPointAt(t, point);
    journeyCurve.getTangentAt(t, tangent);

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
