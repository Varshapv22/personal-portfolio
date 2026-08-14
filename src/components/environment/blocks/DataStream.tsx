import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DataStreamProps {
  points: [number, number, number][];
  color?: string;
  pulseCount?: number;
  speed?: number;
  radius?: number;
}

export default function DataStream({ points, color = "#4fd1ff", pulseCount = 6, speed = 0.35, radius = 0.03 }: DataStreamProps) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 40, 0.012, 6, false), [curve]);
  const pulseRef = useRef<THREE.InstancedMesh>(null);
  const offsets = useMemo(() => new Array(pulseCount).fill(0).map((_, i) => i / pulseCount), [pulseCount]);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const m = new THREE.Matrix4();
    offsets.forEach((o, i) => {
      const t = (o + clock.elapsedTime * speed) % 1;
      const p = curve.getPointAt(t);
      m.compose(p, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
      pulseRef.current!.setMatrixAt(i, m);
    });
    pulseRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} transparent opacity={0.35} />
      </mesh>
      <instancedMesh ref={pulseRef} args={[undefined, undefined, pulseCount]}>
        <sphereGeometry args={[radius, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
