import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { chapterWorldRanges, journeyCurve } from "../utils/path";
import { journeyProgress } from "../state/journeyStore";
import Ground from "../components/environment/blocks/Ground";
import TechTotem from "../components/environment/blocks/TechTotem";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "ai")!;

const TOOLS = [
  { label: "GitHub Copilot", color: "#8892be" },
  { label: "Claude", color: "#ff8a3c" },
  { label: "ChatGPT", color: "#7ef7c4" },
  { label: "Prompt Engineering", color: "#4fd1ff" },
];

function AiCompanion() {
  const ref = useRef<THREE.Group>(null);
  const point = useRef(new THREE.Vector3());
  const tangent = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = journeyProgress.value;
    journeyCurve.getPointAt(t, point.current);
    journeyCurve.getTangentAt(t, tangent.current);
    const right = new THREE.Vector3().crossVectors(tangent.current, new THREE.Vector3(0, 1, 0)).normalize();
    ref.current.position.copy(point.current).addScaledVector(right, 0.7);
    ref.current.position.y = 1.1 + Math.sin(clock.elapsedTime * 1.4) * 0.08;
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.14, 1]} />
        <meshStandardMaterial color="#ff8a3c" emissive="#ff8a3c" emissiveIntensity={0.9} flatShading />
      </mesh>
      <mesh>
        <torusGeometry args={[0.22, 0.012, 6, 20]} />
        <meshStandardMaterial color="#ff8a3c" emissive="#ff8a3c" emissiveIntensity={0.6} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default function AiScene() {
  return (
    <group>
      <Ground chapterId="ai" z={range.startZ} length={range.length} />
      {TOOLS.map((tool, i) => {
        const z = range.startZ + range.length * ((i + 0.5) / TOOLS.length);
        const side = i % 2 === 0 ? -1 : 1;
        return <TechTotem key={tool.label} position={[side * 1.8, 1.4, z]} label={tool.label} color={tool.color} floatSpeed={0.7 + i * 0.1} />;
      })}
      <AiCompanion />
      <GlowParticles position={[0, 2, range.startZ + range.length / 2]} count={70} color="#ff8a3c" scale={[6, 4, range.length]} speed={0.3} />
    </group>
  );
}
