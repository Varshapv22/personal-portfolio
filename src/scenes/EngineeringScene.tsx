import { Text, Billboard } from "@react-three/drei";
import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "engineering")!;

const BLOCKS = ["Clean Code", "OOP", "MVC", "Security", "Performance", "Scalability", "Maintainability", "Reliability"];

export default function EngineeringScene() {
  const baseZ = range.startZ + range.length * 0.15;
  return (
    <group>
      <Ground chapterId="engineering" z={range.startZ} length={range.length} />
      {BLOCKS.map((label, i) => {
        const col = i % 2 === 0 ? -1 : 1;
        const level = Math.floor(i / 2);
        const z = baseZ + level * 1.1;
        const y = 0.4 + level * 0.55;
        return (
          <group key={label} position={[col * 1.5, y, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.5, 0.9]} />
              <meshStandardMaterial color="#eef1f5" flatShading roughness={0.6} />
            </mesh>
            <Billboard position={[0, 0, 0.47]}>
              <Text fontSize={0.11} color="#171a26" anchorX="center" maxWidth={1}>
                {label}
              </Text>
            </Billboard>
          </group>
        );
      })}
      <GlowParticles position={[0, 2.4, baseZ + 1.6]} count={40} color="#5b6cff" scale={[6, 3, range.length]} speed={0.15} />
    </group>
  );
}
