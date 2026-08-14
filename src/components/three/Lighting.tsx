import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { journeyProgress, useJourneyStore } from "../../state/journeyStore";
import { chapters, chapterIndexAt, localProgressAt } from "../../data/chapters";
import { journeyCurve } from "../../utils/path";

const BLEND_ZONE = 0.2;
const SUN_OFFSET = new THREE.Vector3(8, 14, 6);
const SHADOW_MAP_SIZE: Record<string, number> = { high: 2048, medium: 1024, low: 512 };

export default function Lighting() {
  const { scene } = useThree();
  const quality = useJourneyStore((s) => s.quality);
  const shadowMapSize = SHADOW_MAP_SIZE[quality];
  const sun = useRef<THREE.DirectionalLight>(null);
  const sunTarget = useRef<THREE.Object3D>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const characterPoint = useMemo(() => new THREE.Vector3(), []);

  const skyColor = useMemo(() => new THREE.Color(), []);
  const fogColor = useMemo(() => new THREE.Color(), []);
  const ambientColor = useMemo(() => new THREE.Color(), []);
  const sunColor = useMemo(() => new THREE.Color(), []);
  const a = useMemo(() => new THREE.Color(), []);
  const b = useMemo(() => new THREE.Color(), []);

  useFrame(({ gl }) => {
    const t = journeyProgress.value;
    const idx = chapterIndexAt(t);
    const local = localProgressAt(t, idx);
    const current = chapters[idx].theme;
    const nextIdx = Math.min(idx + 1, chapters.length - 1);
    const next = chapters[nextIdx].theme;

    const blend = local > 1 - BLEND_ZONE ? (local - (1 - BLEND_ZONE)) / BLEND_ZONE : 0;

    a.set(current.sky);
    b.set(next.sky);
    skyColor.copy(a).lerp(b, blend);

    a.set(current.fog);
    b.set(next.fog);
    fogColor.copy(a).lerp(b, blend);

    a.set(current.ambient);
    b.set(next.ambient);
    ambientColor.copy(a).lerp(b, blend);

    a.set(current.sun);
    b.set(next.sun);
    sunColor.copy(a).lerp(b, blend);

    const intensity = THREE.MathUtils.lerp(current.sunIntensity, next.sunIntensity, blend);

    // Clear color must match the fog's asymptotic color exactly — any mismatch
    // between "fully fogged geometry" and "empty background" becomes a hard,
    // highly visible seam right at the horizon under grazing camera angles.
    gl.setClearColor(fogColor, 1);
    if (!scene.fog) scene.fog = new THREE.Fog(fogColor, 12, 95);
    (scene.fog as THREE.Fog).color.copy(fogColor);

    if (sun.current) {
      sun.current.color.copy(sunColor);
      sun.current.intensity = intensity;

      // The shadow camera's frustum is small and fixed relative to the light —
      // it must follow the character down the road, or every chapter beyond
      // the first renders with undefined (acne/banded) shadow sampling.
      journeyCurve.getPointAt(t, characterPoint);
      sun.current.position.copy(characterPoint).add(SUN_OFFSET);
      if (sunTarget.current) {
        sunTarget.current.position.copy(characterPoint);
        sun.current.target = sunTarget.current;
        sun.current.target.updateMatrixWorld();
      }
    }
    if (ambient.current) {
      ambient.current.color.copy(ambientColor);
      ambient.current.intensity = 0.65;
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.6} />
      <directionalLight
        ref={sun}
        position={[8, 14, 6]}
        castShadow
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-bias={-0.0015}
        shadow-normalBias={0.03}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      <object3D ref={sunTarget} />
      <hemisphereLight args={["#bcd7ff", "#2a1f14", 0.4]} />
    </>
  );
}
