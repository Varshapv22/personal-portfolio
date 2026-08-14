import { Text, Billboard } from "@react-three/drei";
import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import DataStream from "../components/environment/blocks/DataStream";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "database")!;

function Table({ position, name }: { position: [number, number, number]; name: string }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.6, 0.06]} />
        <meshStandardMaterial color="#0e1830" emissive="#3fe0ff" emissiveIntensity={0.25} metalness={0.4} roughness={0.4} />
      </mesh>
      {[0.18, 0.02, -0.14].map((y, i) => (
        <mesh key={i} position={[0, y, 0.035]}>
          <planeGeometry args={[0.76, 0.06]} />
          <meshStandardMaterial color="#3fe0ff" emissive="#3fe0ff" emissiveIntensity={0.6} transparent opacity={0.6} />
        </mesh>
      ))}
      <Billboard position={[0, 0.42, 0.04]}>
        <Text fontSize={0.1} color="#f5f3ee" anchorX="center">
          {name}
        </Text>
      </Billboard>
    </group>
  );
}

const TABLES: { name: string; pos: [number, number, number] }[] = [
  { name: "users", pos: [-1.6, 1.6, 0] },
  { name: "orders", pos: [1.6, 1.9, 0.6] },
  { name: "products", pos: [-0.6, 2.2, 1.4] },
  { name: "transactions", pos: [1.2, 1.4, 2.2] },
];

export default function DatabaseScene() {
  const midZ = range.startZ + range.length * 0.5;
  return (
    <group>
      <Ground chapterId="database" z={range.startZ} length={range.length} />
      {TABLES.map((t) => (
        <Table key={t.name} position={[t.pos[0], t.pos[1], midZ - 1.4 + t.pos[2]]} name={t.name} />
      ))}
      <DataStream
        points={[
          [-1.6, 1.6, midZ - 1.4],
          [-0.6, 2.2, midZ],
          [1.6, 1.9, midZ - 0.8],
          [1.2, 1.4, midZ + 0.8],
        ]}
        color="#3fe0ff"
      />
      <Billboard position={[0, 0.6, range.startZ + range.length * 0.85]}>
        <Text fontSize={0.28} color="#7ef7c4" anchorX="center">
          Query optimized: 820ms → 14ms
        </Text>
      </Billboard>
      <GlowParticles position={[0, 2, midZ]} count={70} color="#3fe0ff" scale={[7, 5, range.length]} speed={0.2} />
    </group>
  );
}
