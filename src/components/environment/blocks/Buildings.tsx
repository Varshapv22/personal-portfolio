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

export default function Buildings(props: BuildingsProps) {
  const { z, length, count = 4, seed = 3, side = "both", roadWidth = 3.4, palette = ["#e7d9bd", "#e3c9a6", "#cfd8dd"], roofed = true, minH = 1.6, maxH = 2.6 } = props;

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
      {specs.map((b, i) => {
        // Buildings sit offset to the left/right of the road (x != 0) — the
        // face that should carry windows is the inward one facing the road,
        // not the +z face the original two-window layout used (which meant
        // the wall the camera actually sees while walking past was blank).
        const faceSign = b.x < 0 ? 1 : -1;
        const faceX = faceSign * (b.w / 2 + 0.012);
        const faceRotY = faceSign * (Math.PI / 2);
        const rows = Math.max(1, Math.floor((b.h - 0.5) / 0.55));
        const cols = Math.max(1, Math.floor((b.d - 0.5) / 0.55));

        return (
          <group key={i} position={[b.x, 0, b.z]}>
            <mesh castShadow receiveShadow position={[0, b.h / 2, 0]}>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial color={b.color} flatShading roughness={0.85} />
            </mesh>
            {roofed ? (
              <mesh castShadow position={[0, b.h + 0.22, 0]}>
                <coneGeometry args={[Math.max(b.w, b.d) * 0.78, 0.5, 4]} />
                <meshStandardMaterial color="#8a4a3a" flatShading roughness={0.9} />
              </mesh>
            ) : (
              // Flat-roof buildings still get a slim parapet trim so the
              // roofline reads as a finished edge, not a cut-off box.
              <mesh castShadow position={[0, b.h + 0.03, 0]}>
                <boxGeometry args={[b.w + 0.08, 0.06, b.d + 0.08]} />
                <meshStandardMaterial color="#aab3bd" flatShading roughness={0.7} />
              </mesh>
            )}

            {/* road-facing window grid */}
            {Array.from({ length: rows }, (_, ri) =>
              Array.from({ length: cols }, (_, ci) => {
                const wy = 0.5 + ri * 0.55;
                const wz = -b.d / 2 + 0.35 + ci * ((b.d - 0.5) / Math.max(1, cols - 1) || 0);
                const lit = (ri * 7 + ci * 3 + i * 5) % 5 !== 0;
                return (
                  <mesh key={`${ri}-${ci}`} position={[faceX, wy, wz]} rotation={[0, faceRotY, 0]}>
                    <planeGeometry args={[0.3, 0.36]} />
                    <meshStandardMaterial
                      color={lit ? "#fff2c2" : "#c9d3de"}
                      emissive={lit ? "#ffdf8a" : "#000000"}
                      emissiveIntensity={lit ? 0.5 : 0}
                    />
                  </mesh>
                );
              })
            )}
          </group>
        );
      })}
    </group>
  );
}
