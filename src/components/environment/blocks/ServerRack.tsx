import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ServerRackProps {
  position: [number, number, number];
  color?: string;
  rows?: number;
}

export default function ServerRack({ position, color = "#3fe0ff", rows = 6 }: ServerRackProps) {
  const lights = useRef<THREE.InstancedMesh>(null);
  const baseColor = useRef(new THREE.Color(color));

  useEffect(() => {
    if (!lights.current) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < rows; i++) {
      m.setPosition(0, 0.1 + i * 0.28, 0.26);
      lights.current.setMatrixAt(i, m);
      lights.current.setColorAt(i, baseColor.current);
    }
    lights.current.instanceMatrix.needsUpdate = true;
  }, [rows]);

  useFrame(({ clock }) => {
    if (!lights.current) return;
    for (let i = 0; i < rows; i++) {
      const blink = Math.sin(clock.elapsedTime * 3 + i * 1.7) > 0.4 ? 1 : 0.15;
      lights.current.setColorAt(i, baseColor.current.clone().multiplyScalar(blink));
    }
    if (lights.current.instanceColor) lights.current.instanceColor.needsUpdate = true;
  });

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[0.5, 1.8, 0.5]} />
        <meshStandardMaterial color="#12141c" flatShading roughness={0.5} metalness={0.4} />
      </mesh>
      <instancedMesh ref={lights} args={[undefined, undefined, rows]}>
        <planeGeometry args={[0.34, 0.09]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
