import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "../../../state/journeyStore";

interface PortalGateProps {
  position: [number, number, number];
  rotationY?: number;
  color: string;
  id: string;
  // name & stack kept in signature so ProjectsScene needs no change
  name?: string;
  stack?: string;
}

export default function PortalGate({ position, rotationY = 0, color, id }: PortalGateProps) {
  const ring = useRef<THREE.Mesh>(null);
  const activeProject  = useJourneyStore((s) => s.activeProject);
  const setActiveProject = useJourneyStore((s) => s.setActiveProject);
  const isActive = activeProject === id;

  // Rotate the ring continuously; no proximity auto-open — bubbles handle that.
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
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 2.4 : 1}
          toneMapped={false}
        />
      </mesh>

      {/* Inner translucent fill */}
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[0.98, 24]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={isActive ? 0.22 : 0.1}
          emissive={color}
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
