import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyStore } from "../../../state/journeyStore";
import type { Project } from "../../../data/projects";

interface PortalGateProps {
  project: Project;
  position: [number, number, number];
  rotationY?: number;
}

export default function PortalGate({ project, position, rotationY = 0 }: PortalGateProps) {
  const { id, accent: color } = project;
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshStandardMaterial>(null);
  const innerRing = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);
  const energy = useRef(0);
  const activeProject = useJourneyStore((s) => s.activeProject);
  const setActiveProject = useJourneyStore((s) => s.setActiveProject);
  const isActive = activeProject === id;
  const isNear = useJourneyStore((s) => s.nearPortalId === id);

  useFrame(({ clock }, delta) => {
    // Smoothly ramp a 0..1 "energy" envelope toward the near/far target instead
    // of snapping, so the ring visibly builds up as the walker approaches.
    energy.current = THREE.MathUtils.damp(energy.current, isNear ? 1 : 0, 6, delta);
    const proximity = energy.current;
    const elapsed = clock.elapsedTime;

    if (ring.current) {
      ring.current.rotation.z = elapsed * 0.5;
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.035 * (0.4 + proximity);
      ring.current.scale.setScalar(pulse * (1 + proximity * 0.14));
    }
    if (ringMat.current) {
      ringMat.current.emissiveIntensity = (isActive ? 2.4 : 1) + proximity * 1.8;
    }
    if (innerRing.current) {
      innerRing.current.rotation.z = -elapsed * 0.8 - proximity * elapsed * 0.6;
    }
    if (glow.current) {
      glow.current.intensity = proximity * 2.4;
    }
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
        <meshStandardMaterial ref={ringMat} color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />
      </mesh>

      {/* Slim counter-rotating inner ring — layered "portal" read, spins up as you approach */}
      <mesh ref={innerRing}>
        <torusGeometry args={[0.76, 0.016, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} toneMapped={false} transparent opacity={0.65} />
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

      {/* Proximity glow light — brightens as the walker nears the ring */}
      <pointLight ref={glow} color={color} distance={5} intensity={0} />
    </group>
  );
}
