import { useMemo } from "react";
import { mulberry32 } from "./rng";

interface BuildingSpec {
  x: number;
  z: number;
  w: number;
  h: number;
  d: number;
  color: string;
  roofColor?: string;
}

interface BuildingsProps {
  z: number;
  length: number;
  count?: number;
  seed?: number;
  side?: "left" | "right" | "both";
  roadWidth?: number;
  palette?: string[];
  roofed?: boolean;
  minH?: number;
  maxH?: number;
}

export default function Buildings({
  z,
  length,
  count = 4,
  seed = 3,
  side = "both",
  roadWidth = 3.4,
  palette = ["#e7d9bd", "#e3c9a6", "#cfd8dd"],
  roofed = true,
  minH = 1.6,
  maxH = 2.6,
}: BuildingsProps) {
  const specs: BuildingSpec[] = useMemo(() => {
    const rand = mulberry32(seed * 4001 + 7);
    const sides = side === "both" ? [-1, 1] : side === "left" ? [-1] : [1];
    const out: BuildingSpec[] = [];
    for (let i = 0; i < count; i++) {
      const s = sides[i % sides.length];
      const x = s * (roadWidth / 2 + 2.4 + rand() * 3);
      const zz = z + 0.6 + rand() * (length - 1.2);
      const w = 1.6 + rand() * 1.4;
      const h = minH + rand() * (maxH - minH);
      const d = 1.4 + rand() * 1.2;
      out.push({ x, z: zz, w, h, d, color: palette[i % palette.length] });
    }
    return out;
  }, [z, length, count, seed, side, roadWidth, palette, minH, maxH]);

  return (
    <group>
      {specs.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]}>
          <mesh castShadow receiveShadow position={[0, b.h / 2, 0]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} flatShading roughness={0.85} />
          </mesh>
          {roofed && (
            <mesh castShadow position={[0, b.h + 0.22, 0]}>
              <coneGeometry args={[Math.max(b.w, b.d) * 0.78, 0.5, 4]} />
              <meshStandardMaterial color="#8a4a3a" flatShading roughness={0.9} />
            </mesh>
          )}
          {/* windows */}
          {[0.3, -0.3].map((wx, wi) => (
            <mesh key={wi} position={[wx, b.h * 0.55, b.d / 2 + 0.01]}>
              <planeGeometry args={[0.28, 0.32]} />
              <meshStandardMaterial color="#fff2c2" emissive="#ffdf8a" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
