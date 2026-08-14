import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Billboard } from "@react-three/drei";
import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "certifications")!;

function CertCard({ position, title, sub, year, color }: { position: [number, number, number]; title: string; sub: string; year: string; color: string }) {
  const ref = useRef<THREE.Group>(null);
  const seed = useRef(Math.random() * 10).current;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6 + seed) * 0.08;
  });
  return (
    <group ref={ref} position={position}>
      <Billboard>
        <mesh castShadow>
          <boxGeometry args={[1.5, 1, 0.04]} />
          <meshStandardMaterial color="#0e1424" emissive={color} emissiveIntensity={0.25} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[1.36, 0.86]} />
          <meshStandardMaterial color="#131a2c" />
        </mesh>
        <Text position={[0, 0.2, 0.03]} fontSize={0.13} color="#f5f3ee" anchorX="center" maxWidth={1.2}>
          {title}
        </Text>
        <Text position={[0, -0.05, 0.03]} fontSize={0.09} color={color} anchorX="center">
          {sub}
        </Text>
        <Text position={[0, -0.28, 0.03]} fontSize={0.08} color="#9aa3c0" anchorX="center">
          {year}
        </Text>
      </Billboard>
    </group>
  );
}

export default function CertsScene() {
  return (
    <group>
      <Ground chapterId="certifications" z={range.startZ} length={range.length} />
      <CertCard position={[-1.4, 1.8, range.startZ + range.length * 0.32]} title="PHP (Hypertext Preprocessor)" sub="Gtec" year="2023" color="#4fd1ff" />
      <CertCard
        position={[1.5, 1.9, range.startZ + range.length * 0.68]}
        title="Python Data Science with AI Expert"
        sub="Expertz Lab"
        year="2021 – 2022"
        color="#c39bff"
      />
      <GlowParticles position={[0, 2, range.startZ + range.length / 2]} count={50} color="#c39bff" scale={[6, 4, range.length]} size={1.2} speed={0.2} />
    </group>
  );
}
