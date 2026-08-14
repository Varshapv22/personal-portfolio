import { useMemo } from "react";
import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import GlowParticles from "../components/environment/blocks/GlowParticles";
import { mulberry32 } from "../components/environment/blocks/rng";

const range = chapterWorldRanges.find((r) => r.id === "future")!;

function Skyline() {
  const towers = useMemo(() => {
    const rand = mulberry32(202);
    return new Array(16).fill(0).map((_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (10 + rand() * 8);
      const z = range.startZ + rand() * range.length;
      const h = 2.5 + rand() * 6;
      return { x, z, h, w: 0.8 + rand() * 1.2 };
    });
  }, []);
  return (
    <group>
      {towers.map((t, i) => (
        <mesh key={i} position={[t.x, t.h / 2, t.z]}>
          <boxGeometry args={[t.w, t.h, t.w]} />
          <meshStandardMaterial color="#1a1030" emissive="#ff8a3c" emissiveIntensity={0.15} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function CodeRoad() {
  const segs = useMemo(() => {
    const rand = mulberry32(303);
    return new Array(30).fill(0).map((_, i) => ({
      z: range.startZ + (i / 30) * range.length,
      x: (rand() - 0.5) * 1.4,
    }));
  }, []);
  return (
    <group>
      {segs.map((s, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[s.x, 0.015, s.z]}>
          <planeGeometry args={[0.06, 1.4]} />
          <meshStandardMaterial color="#ff8a3c" emissive="#ff8a3c" emissiveIntensity={1.4} toneMapped={false} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export default function FutureScene() {
  return (
    <group>
      <Ground chapterId="future" z={range.startZ} length={range.length} />
      <CodeRoad />
      <Skyline />
      <GlowParticles position={[0, 3, range.startZ + range.length / 2]} count={90} color="#ffb37e" scale={[14, 6, range.length]} speed={0.2} />
    </group>
  );
}
