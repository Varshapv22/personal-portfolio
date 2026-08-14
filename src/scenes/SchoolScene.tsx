import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import Trees from "../components/environment/blocks/Trees";
import GlowParticles from "../components/environment/blocks/GlowParticles";
import { Whiteboard } from "../components/environment/blocks/DeskSetup";

const range = chapterWorldRanges.find((r) => r.id === "school")!;
const Z = range.startZ;
const L = range.length;

// Institutional trim color — ties windows, porch beam, steps, and signage
// into one identity so the building reads as "a school" at a glance rather
// than a plain box (Kerala govt schools commonly pair cream walls with a
// blue/white trim scheme).
const TRIM = "#234a78";
const ROOF = "#b8462e";
const RIDGE = "#8a3220";
const WALL = "#f2ead4";

// Animated school bell, mounted on its own little bracket so it doesn't read
// as a floating stick.
function Bell({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 3.5) * 0.24;
  });
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.06, 0.06, 0.34]} />
        <meshStandardMaterial color={TRIM} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0.15]}>
        <cylinderGeometry args={[0.025, 0.025, 0.22, 5]} />
        <meshStandardMaterial color="#555566" roughness={0.7} />
      </mesh>
      <mesh ref={ref} position={[0, -0.28, 0.15]}>
        <coneGeometry args={[0.15, 0.24, 8, 1, true]} />
        <meshStandardMaterial color="#d4a830" metalness={0.65} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Main school building — Kerala government school aesthetic. Its detailed
// elevation (porch, windows, door, signage) faces -X, i.e. toward the road,
// since the building sits to the +X side of the path — that way it reads as
// a real façade while the character walks past, instead of showing its
// blank flank the whole time.
function SchoolBuilding({ x, z }: { x: number; z: number }) {
  const columnZ = [-3.4, -1.7, 0, 1.7, 3.4];
  const windowZ = [-2.55, -0.85, 0.85, 2.55];

  return (
    <group position={[x, 0, z]}>
      {/* Plinth */}
      <mesh receiveShadow castShadow position={[0, 0.14, 0]}>
        <boxGeometry args={[4.6, 0.28, 9.6]} />
        <meshStandardMaterial color="#c0a880" roughness={0.88} />
      </mesh>

      {/* Main walls */}
      <mesh receiveShadow castShadow position={[0, 1.43, 0]}>
        <boxGeometry args={[4.2, 2.3, 9.2]} />
        <meshStandardMaterial color={WALL} roughness={0.82} />
      </mesh>

      {/* Pitched terracotta-tile roof — wide overhang, strong color contrast
          against the cream walls so the silhouette reads at a distance. */}
      <mesh castShadow position={[0, 2.78, 0]}>
        <boxGeometry args={[5.8, 0.32, 10.6]} />
        <meshStandardMaterial color={ROOF} roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 3.0, 0]}>
        <boxGeometry args={[6.0, 0.16, 0.34]} />
        <meshStandardMaterial color={RIDGE} roughness={0.85} />
      </mesh>

      {/* Veranda — porch columns standing proud of the wall, roof overhang
          above them, so it reads as a real covered walkway. */}
      {columnZ.map((cz, i) => (
        <mesh key={i} castShadow position={[-2.85, 1.43, cz]}>
          <cylinderGeometry args={[0.16, 0.19, 2.3, 10]} />
          <meshStandardMaterial color="#f0e8d4" roughness={0.78} />
        </mesh>
      ))}
      <mesh castShadow position={[-2.85, 2.62, 0]}>
        <boxGeometry args={[0.18, 0.18, 7.4]} />
        <meshStandardMaterial color={TRIM} roughness={0.7} />
      </mesh>

      {/* Windows — recessed frame + glass + grille bar, wrapped in a group
          rotated to face -X (see file note above). */}
      {windowZ.map((wz, i) => (
        <group key={i} position={[-2.1, 1.65, wz]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 1.05, 0.08]} />
            <meshStandardMaterial color={TRIM} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[0.72, 0.86]} />
            <meshStandardMaterial color="#dff3ff" emissive="#4fa8e0" emissiveIntensity={0.55} roughness={0.25} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[0.04, 0.86]} />
            <meshStandardMaterial color={TRIM} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Front door with fanlight arch */}
      <mesh castShadow position={[-2.1, 0.95, 0]}>
        <boxGeometry args={[0.08, 1.85, 0.9]} />
        <meshStandardMaterial color="#6b3a20" roughness={0.8} />
      </mesh>
      <mesh position={[-2.1, 1.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.36, 0.36, 0.08, 10, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#6b3a20" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Steps */}
      <mesh receiveShadow castShadow position={[-3.15, 0.20, 0]}>
        <boxGeometry args={[0.44, 0.18, 2.3]} />
        <meshStandardMaterial color="#c0aa88" roughness={0.88} />
      </mesh>
      <mesh receiveShadow castShadow position={[-3.35, 0.10, 0]}>
        <boxGeometry args={[0.44, 0.08, 2.7]} />
        <meshStandardMaterial color="#c0aa88" roughness={0.88} />
      </mesh>

      {/* Name board — GBHSS Madayi, where Varsha did her 12th */}
      <group position={[-2.14, 2.24, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[3.6, 0.5]} />
          <meshStandardMaterial color={TRIM} roughness={0.6} />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.2} color="#f5f3ee" anchorX="center" anchorY="middle" letterSpacing={0.04}>
          GBHSS MADAYI
        </Text>
      </group>

      {/* Bell, mounted near the veranda corner */}
      <Bell position={[-2.85, 3.05, -3.9]} />
    </group>
  );
}

// Flagpole
function Flagpole({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 5.0, 6]} />
        <meshStandardMaterial color="#c0c8d0" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Flag — tricolor suggestion */}
      <mesh position={[0.55, 4.55, 0]}>
        <planeGeometry args={[1.1, 0.22]} />
        <meshStandardMaterial color="#ff8820" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
      <mesh position={[0.55, 4.33, 0]}>
        <planeGeometry args={[1.1, 0.22]} />
        <meshStandardMaterial color="#f8f8f8" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
      <mesh position={[0.55, 4.11, 0]}>
        <planeGeometry args={[1.1, 0.22]} />
        <meshStandardMaterial color="#1a6a30" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
    </group>
  );
}

// Entrance gate — GGHSS Madayi, where Varsha did her 10th. Establishes
// "you've arrived at school" right at the start of the chapter, since the
// main building (her 12th school) only occupies the middle of it.
function SchoolGate({ z }: { z: number }) {
  const half = 2.2;
  return (
    <group position={[0, 0, z]}>
      {([-half, half] as number[]).map((gx, i) => (
        <mesh key={i} castShadow position={[gx, 1.3, 0]}>
          <boxGeometry args={[0.34, 2.6, 0.34]} />
          <meshStandardMaterial color="#e4d8bc" roughness={0.85} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 2.62, 0]}>
        <boxGeometry args={[half * 2 + 0.6, 0.26, 0.34]} />
        <meshStandardMaterial color={TRIM} roughness={0.7} />
      </mesh>
      {/* Rotated 180° so it faces -Z — the direction the character
          approaches from, not the default +Z the Text node starts facing. */}
      <Text position={[0, 2.62, -0.19]} rotation={[0, Math.PI, 0]} fontSize={0.2} color="#f5f3ee" anchorX="center" anchorY="middle" letterSpacing={0.04}>
        GGHSS MADAYI
      </Text>
    </group>
  );
}

// Compound wall
function CompoundWall({ startZ, endZ, side }: { startZ: number; endZ: number; side: 1 | -1 }) {
  const length = endZ - startZ;
  return (
    <group>
      <mesh receiveShadow castShadow position={[side * 5.2, 0.45, (startZ + endZ) / 2]}>
        <boxGeometry args={[0.22, 0.90, length]} />
        <meshStandardMaterial color="#d8ceb0" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[side * 5.2, 0.94, (startZ + endZ) / 2]}>
        <boxGeometry args={[0.28, 0.08, length]} />
        <meshStandardMaterial color={TRIM} roughness={0.7} />
      </mesh>
    </group>
  );
}

// Basketball hoop — simple pole + backboard + ring
function Hoop({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 2.0, 8]} />
        <meshStandardMaterial color="#8a9098" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh castShadow position={[0, 1.95, 0.18]}>
        <boxGeometry args={[0.5, 0.36, 0.03]} />
        <meshStandardMaterial color="#f4f6f8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.8, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.012, 6, 12]} />
        <meshStandardMaterial color="#d4602a" roughness={0.6} />
      </mesh>
    </group>
  );
}

// A row of ground-marked hopscotch squares
function Hopscotch({ x, z }: { x: number; z: number }) {
  const colors = ["#d8a840", "#c85848", "#4a90b8", "#d8a840", "#7ab04a"];
  return (
    <group position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
      {colors.map((c, i) => (
        <mesh key={i} position={[0, i * 0.42, 0]}>
          <planeGeometry args={[0.38, 0.38]} />
          <meshStandardMaterial color={c} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// Simple bicycle stand — a row of thin U-shaped brackets
function BikeStand({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {[0, 0.45, 0.9, 1.35].map((dz, i) => (
        <group key={i} position={[0, 0, dz]}>
          <mesh castShadow position={[0, 0.22, -0.16]}>
            <boxGeometry args={[0.02, 0.44, 0.02]} />
            <meshStandardMaterial color="#5a6070" roughness={0.6} metalness={0.4} />
          </mesh>
          <mesh castShadow position={[0, 0.22, 0.16]}>
            <boxGeometry args={[0.02, 0.44, 0.02]} />
            <meshStandardMaterial color="#5a6070" roughness={0.6} metalness={0.4} />
          </mesh>
          <mesh castShadow position={[0, 0.43, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.36]} />
            <meshStandardMaterial color="#5a6070" roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function SchoolScene() {
  const midZ = Z + L * 0.45;
  const buildX = 5.2;
  const frontX = buildX - 2.1; // world x of the building's front (veranda) face

  return (
    <group>
      <Ground chapterId="school" z={Z} length={L} />

      {/* Shade trees lining the compound */}
      <Trees z={Z} length={L} count={16} seed={22} variant="round" roadWidth={4.2} />
      <Trees z={Z} length={L} count={6} seed={55} variant="round" roadWidth={22} />

      {/* Entrance gate, near the start of the chapter */}
      <SchoolGate z={Z + L * 0.05} />

      {/* Main school building, facing the road */}
      <SchoolBuilding x={buildX} z={midZ} />

      {/* Flagpole, in the open ground between the veranda and the road */}
      <Flagpole x={frontX - 1.6} z={midZ} />

      {/* Classroom glimpse under the porch — blackboard + desk row, visible
          through the open front the way a ground-floor Kerala classroom
          often opens straight onto the veranda. */}
      <Whiteboard position={[frontX - 0.25, 1.5, midZ - 2.6]} rotation={Math.PI / 2} variant="chalk" />
      {([midZ - 2.0, midZ - 1.35] as number[]).map((dz, i) => (
        <group key={i} position={[frontX - 0.7, 0, dz]}>
          <mesh castShadow position={[0, 0.42, 0]}>
            <boxGeometry args={[0.32, 0.05, 0.8]} />
            <meshStandardMaterial color="#8a6040" roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0.1, 0.21, -0.32]}>
            <boxGeometry args={[0.05, 0.42, 0.05]} />
            <meshStandardMaterial color="#6a4830" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0.1, 0.21, 0.32]}>
            <boxGeometry args={[0.05, 0.42, 0.05]} />
            <meshStandardMaterial color="#6a4830" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Compound walls, spanning nearly the full chapter length */}
      <CompoundWall startZ={Z + L * 0.1} endZ={Z + L * 0.95} side={1} />
      <CompoundWall startZ={Z + L * 0.1} endZ={Z + L * 0.95} side={-1} />

      {/* Playground — sandy circle */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-4.0, 0.008, midZ + 1.4]}>
        <circleGeometry args={[3.0, 20]} />
        <meshStandardMaterial color="#c8a860" roughness={0.95} />
      </mesh>

      {/* Slide */}
      <group position={[-4.6, 0, midZ + 0.7]}>
        <mesh castShadow position={[0, 0.70, 0]}>
          <boxGeometry args={[0.14, 1.40, 0.14]} />
          <meshStandardMaterial color="#b03020" roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0.5, 0.35, 0]} rotation={[0, 0, -0.48]}>
          <boxGeometry args={[0.08, 1.10, 0.44]} />
          <meshStandardMaterial color="#d04820" roughness={0.75} />
        </mesh>
      </group>

      {/* Basketball hoop and hopscotch grid */}
      <Hoop x={-3.0} z={midZ + 2.5} />
      <Hopscotch x={-4.3} z={midZ + 2.7} />

      {/* Bicycle stand near the entrance */}
      <BikeStand x={frontX - 0.4} z={Z + L * 0.14} />

      {/* A few benches */}
      {([midZ - 1.8, midZ + 1.8] as number[]).map((bz, i) => (
        <group key={i} position={[-3.2, 0, bz]}>
          <mesh castShadow position={[0, 0.44, 0]}>
            <boxGeometry args={[0.90, 0.06, 0.28]} />
            <meshStandardMaterial color="#8a6040" roughness={0.80} />
          </mesh>
          <mesh castShadow position={[-0.36, 0.22, 0]}>
            <boxGeometry args={[0.06, 0.44, 0.28]} />
            <meshStandardMaterial color="#7a5030" roughness={0.82} />
          </mesh>
          <mesh castShadow position={[0.36, 0.22, 0]}>
            <boxGeometry args={[0.06, 0.44, 0.28]} />
            <meshStandardMaterial color="#7a5030" roughness={0.82} />
          </mesh>
        </group>
      ))}

      {/* Soft atmosphere */}
      <GlowParticles position={[0, 2.5, Z + L * 0.5]} count={20} color="#fff8e0" scale={[14, 6, L]} size={0.45} speed={0.06} />
    </group>
  );
}
