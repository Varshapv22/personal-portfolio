import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Billboard } from "@react-three/drei";

interface TechTotemProps {
  position: [number, number, number];
  label: string;
  color?: string;
  height?: number;
  radius?: number;
  floatSpeed?: number;
}

export default function TechTotem({ position, label, color = "#4fd1ff", height = 1.6, radius = 0.22, floatSpeed = 1 }: TechTotemProps) {
  const group = useRef<THREE.Group>(null);
  const seed = useRef(Math.random() * Math.PI * 2).current;

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y = position[1] + Math.sin(clock.elapsedTime * floatSpeed + seed) * 0.12;
    group.current.rotation.y = clock.elapsedTime * 0.4 * floatSpeed;
  });

  return (
    <group position={position}>
      <group ref={group}>
        <mesh castShadow>
          <octahedronGeometry args={[radius, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} flatShading roughness={0.3} metalness={0.4} />
        </mesh>
      </group>
      <mesh position={[0, -height / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, height, 5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>
      <Billboard position={[0, radius + 0.28, 0]}>
        <Text fontSize={0.16} color="#f5f3ee" anchorX="center" anchorY="bottom">
          {label}
        </Text>
      </Billboard>
    </group>
  );
}
