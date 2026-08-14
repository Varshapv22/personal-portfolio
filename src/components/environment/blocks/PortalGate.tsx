import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Billboard } from "@react-three/drei";
import { useJourneyStore } from "../../../state/journeyStore";

interface PortalGateProps {
  position: [number, number, number];
  rotationY?: number;
  name: string;
  stack: string;
  color: string;
  id: string;
}

export default function PortalGate({ position, rotationY = 0, name, stack, color, id }: PortalGateProps) {
  const ring = useRef<THREE.Mesh>(null);
  const activeProject = useJourneyStore((s) => s.activeProject);
  const setActiveProject = useJourneyStore((s) => s.setActiveProject);
  const isActive = activeProject === id;

  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.z = clock.elapsedTime * 0.5;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh
        ref={ring}
        onClick={(e) => {
          e.stopPropagation();
          setActiveProject(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <torusGeometry args={[1.05, 0.05, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 2 : 1} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[0.98, 24]} />
        <meshStandardMaterial color={color} transparent opacity={0.12} emissive={color} emissiveIntensity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <Billboard position={[0, 1.4, 0]}>
        <Text fontSize={0.22} color="#f5f3ee" anchorX="center" anchorY="bottom">
          {name}
        </Text>
        <Text position={[0, -0.24, 0]} fontSize={0.1} color={color} anchorX="center" anchorY="bottom">
          {stack}
        </Text>
      </Billboard>
    </group>
  );
}
