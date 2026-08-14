import { useMemo } from "react";
import { mulberry32 } from "./rng";

interface MoneyPlantProps {
  position: [number, number, number];
  scale?: number;
  seed?: number;
}

// A potted money plant (pothos on a moss pole) — the recurring office-
// greenery accent for corporate chapters (iOSS). Procedural primitives only,
// matching the rest of the environment kit's no-texture art style.
export default function MoneyPlant({ position, scale = 1, seed = 1 }: MoneyPlantProps) {
  const leaves = useMemo(() => {
    const rand = mulberry32(seed * 733 + 11);
    const count = 9 + Math.floor(rand() * 4);
    return Array.from({ length: count }, (_, i) => {
      const t = i / count;
      const side = i % 2 === 0 ? 1 : -1;
      return {
        y: 0.16 + t * 0.62,
        x: side * (0.05 + rand() * 0.05),
        z: side * (0.02 + rand() * 0.04),
        tilt: side * (0.5 + rand() * 0.3),
        size: 0.075 + rand() * 0.03,
      };
    });
  }, [seed]);

  return (
    <group position={position} scale={scale}>
      {/* pot */}
      <mesh castShadow receiveShadow position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.18, 10]} />
        <meshStandardMaterial color="#c8987a" flatShading roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.185, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 10]} />
        <meshStandardMaterial color="#5a4838" flatShading roughness={0.9} />
      </mesh>

      {/* moss pole */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.85, 6]} />
        <meshStandardMaterial color="#4a3a2a" flatShading roughness={0.95} />
      </mesh>

      {/* leaves — flattened spheres angled off the pole, alternating sides */}
      {leaves.map((l, i) => (
        <mesh key={i} castShadow position={[l.x, l.y, l.z]} rotation={[0.3, l.tilt, Math.PI / 2]} scale={[1, 0.55, 1]}>
          <sphereGeometry args={[l.size, 8, 6]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#3f8f4f" : "#4fae5a"} flatShading roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}
