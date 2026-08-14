import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "./rng";

interface TreesProps {
  z: number;
  length: number;
  count?: number;
  seed?: number;
  roadWidth?: number;
  variant?: "coconut" | "round";
}

const trunkGeo = new THREE.CylinderGeometry(0.06, 0.1, 1, 5);
const coconutCanopyGeo = new THREE.IcosahedronGeometry(0.55, 0);
const roundCanopyGeo = new THREE.IcosahedronGeometry(0.7, 1);

export default function Trees({ z, length, count = 14, seed = 1, roadWidth = 3.4, variant = "coconut" }: TreesProps) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const canopyGeo = variant === "coconut" ? coconutCanopyGeo : roundCanopyGeo;

  const data = useMemo(() => {
    const rand = mulberry32(seed * 7919 + 13);
    return new Array(count).fill(0).map(() => {
      const side = rand() > 0.5 ? 1 : -1;
      const x = side * (roadWidth / 2 + 1.4 + rand() * 5);
      const tz = z + rand() * length;
      const s = 0.75 + rand() * 0.7;
      const trunkH = variant === "coconut" ? 2.4 + rand() * 1.6 : 1.1 + rand() * 0.6;
      const lean = (rand() - 0.5) * 0.25;
      return { x, tz, s, trunkH, lean };
    });
  }, [count, seed, z, length, roadWidth, variant]);

  useMemo(() => {
    if (!trunkRef.current || !canopyRef.current) return;
    const m = new THREE.Matrix4();
    data.forEach((d, i) => {
      m.compose(
        new THREE.Vector3(d.x, d.trunkH / 2, d.tz),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(d.lean, 0, d.lean * 0.6)),
        new THREE.Vector3(d.s, d.trunkH, d.s)
      );
      trunkRef.current!.setMatrixAt(i, m);
      m.compose(
        new THREE.Vector3(d.x + d.lean * d.trunkH * 0.5, d.trunkH + 0.3, d.tz),
        new THREE.Quaternion(),
        new THREE.Vector3(d.s, d.s, d.s)
      );
      canopyRef.current!.setMatrixAt(i, m);
    });
    trunkRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
  }, [data]);

  useFrame(({ clock }) => {
    if (!canopyRef.current) return;
    canopyRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.02;
  });

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[trunkGeo, undefined, count]} castShadow receiveShadow>
        <meshStandardMaterial color="#7a5a3a" flatShading roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[canopyGeo, undefined, count]} castShadow>
        <meshStandardMaterial color={variant === "coconut" ? "#3c8a4a" : "#4f9e5a"} flatShading roughness={0.85} />
      </instancedMesh>
    </group>
  );
}
