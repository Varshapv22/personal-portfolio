import { useMemo } from "react";
import * as THREE from "three";
import { getCodeScreenTexture } from "./CodeScreenTexture";

interface DeskSetupProps {
  position: [number, number, number];
  rotation?: number;
  accent?: string;
}

// A desk + monitor + chair — the recurring "developer workstation" unit for
// training-room and office chapters (BTRAC, iOSS). Monitor shows a procedural
// code-editor texture (see CodeScreenTexture) rather than a flat color.
export default function DeskSetup({ position, rotation = 0, accent = "#4fd1ff" }: DeskSetupProps) {
  const screenTex = useMemo(() => getCodeScreenTexture(accent), [accent]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* desk */}
      <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
        <boxGeometry args={[0.7, 0.04, 0.4]} />
        <meshStandardMaterial color="#c8cdd6" roughness={0.6} />
      </mesh>
      {([-0.3, 0.3] as number[]).map((lx, i) => (
        <mesh key={i} castShadow position={[lx, 0.19, 0.15]}>
          <boxGeometry args={[0.03, 0.38, 0.03]} />
          <meshStandardMaterial color="#8a9098" roughness={0.7} />
        </mesh>
      ))}

      {/* monitor */}
      <group position={[0, 0.4, -0.1]}>
        <mesh castShadow position={[0, 0.16, 0]}>
          <boxGeometry args={[0.34, 0.22, 0.015]} />
          <meshStandardMaterial color="#1a1e28" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.16, 0.009]}>
          <planeGeometry args={[0.30, 0.19]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>
        <mesh castShadow position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.06, 8]} />
          <meshStandardMaterial color="#8a9098" roughness={0.6} />
        </mesh>
      </group>

      {/* keyboard */}
      <mesh position={[0, 0.405, 0.12]}>
        <boxGeometry args={[0.22, 0.01, 0.08]} />
        <meshStandardMaterial color="#2a2e38" roughness={0.6} />
      </mesh>

      {/* chair */}
      <group position={[0, 0, 0.42]}>
        <mesh castShadow position={[0, 0.24, 0]}>
          <boxGeometry args={[0.28, 0.05, 0.28]} />
          <meshStandardMaterial color="#3a4050" roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0, 0.44, 0.13]}>
          <boxGeometry args={[0.26, 0.36, 0.05]} />
          <meshStandardMaterial color="#3a4050" roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 6]} />
          <meshStandardMaterial color="#5a6070" roughness={0.6} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export function Whiteboard({
  position,
  rotation = 0,
  variant = "dry-erase",
}: {
  position: [number, number, number];
  rotation?: number;
  variant?: "dry-erase" | "chalk";
}) {
  const isChalk = variant === "chalk";
  const markerLines = useMemo(
    () =>
      isChalk
        ? [
            { y: 0.55, w: 0.55, x: -0.18, color: "#f4f4ec" },
            { y: 0.38, w: 0.35, x: -0.38, color: "#f4f4ec" },
            { y: 0.22, w: 0.62, x: -0.14, color: "#f0d878" },
          ]
        : [
            { y: 0.55, w: 0.6, x: -0.15, color: "#3a6ad8" },
            { y: 0.38, w: 0.4, x: -0.35, color: "#2a2e38" },
            { y: 0.22, w: 0.7, x: -0.1, color: "#d83a5a" },
          ],
    [isChalk]
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.0, 0.04]} />
        <meshStandardMaterial color={isChalk ? "#3a2a1a" : "#f4f6f8"} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[1.5, 0.9]} />
        <meshStandardMaterial color={isChalk ? "#1e3a2a" : "#fdfefe"} roughness={isChalk ? 0.85 : 0.3} />
      </mesh>
      {markerLines.map((l, i) => (
        <mesh key={i} position={[l.x, l.y - 0.5, 0.023]}>
          <planeGeometry args={[l.w, THREE.MathUtils.lerp(0.02, 0.03, i / markerLines.length)]} />
          <meshStandardMaterial color={l.color} roughness={0.5} />
        </mesh>
      ))}
      {/* frame edge */}
      <mesh castShadow position={[0, -0.54, 0]}>
        <boxGeometry args={[1.65, 0.05, 0.06]} />
        <meshStandardMaterial color={isChalk ? "#5a4530" : "#c8cdd6"} roughness={0.6} />
      </mesh>
    </group>
  );
}
