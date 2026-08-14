import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { hospitalAnchor } from "../utils/path";
import GlowParticles from "../components/environment/blocks/GlowParticles";

// The hospital vignette sits at a fixed point on the road axis, ahead of where
// the village content (ChildhoodScene) begins placing its own props — see
// path.ts's hospitalAnchor and CameraRig's matching "hospital" camera style.
// The camera here is a held, fixed frame (not a dolly), so every prop below
// is placed to compose *that one exact shot* rather than to look right from
// an arbitrary angle: FOCAL_Z (below) is deliberately the same local depth
// as CameraRig's hospital lookAt offset, so the bed sits dead-center.
const CENTER_Z = hospitalAnchor.z;
const FOCAL_Z = -0.6;
const WALL_H = 3.4;
const CREAM = "#f2ece0";
const TRIM = "#bcd8d2";

function Monitor({ position }: { position: [number, number, number] }) {
  const line = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (line.current) {
      const m = line.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.6 + Math.sin(clock.elapsedTime * 2.2) * 0.25;
    }
  });
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[0.02, 0.5, 0.36]} />
        <meshStandardMaterial color="#e8ecf2" roughness={0.5} />
      </mesh>
      <mesh position={[0.012, 0.42, 0]}>
        <planeGeometry args={[0.42, 0.28]} />
        <meshStandardMaterial color="#0a1a14" roughness={0.8} />
      </mesh>
      <mesh ref={line} position={[0.014, 0.42, 0]}>
        <planeGeometry args={[0.36, 0.03]} />
        <meshStandardMaterial color="#6ef0a0" emissive="#6ef0a0" emissiveIntensity={0.7} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.10, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.20, 8]} />
        <meshStandardMaterial color="#d8dde4" roughness={0.6} />
      </mesh>
    </group>
  );
}

function IVStand({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 1.7, 6]} />
        <meshStandardMaterial color="#c7ccd4" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 10]} />
        <meshStandardMaterial color="#b8bec8" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color="#dff0ff" transparent opacity={0.75} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Bassinet({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* clear bassinet bin */}
      <mesh castShadow position={[0, 0.62, 0]}>
        <boxGeometry args={[0.56, 0.26, 0.36]} />
        <meshStandardMaterial color="#eef4ff" transparent opacity={0.35} roughness={0.2} />
      </mesh>
      {/* soft blanket bundle */}
      <mesh castShadow position={[0, 0.60, 0]}>
        <sphereGeometry args={[0.15, 12, 10]} />
        <meshStandardMaterial color="#ffe8d0" roughness={0.85} />
      </mesh>
      {/* stand */}
      <mesh castShadow position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.56, 8]} />
        <meshStandardMaterial color="#d8dde4" roughness={0.6} />
      </mesh>
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 12]} />
        <meshStandardMaterial color="#c8cdd6" roughness={0.6} />
      </mesh>
    </group>
  );
}

// A proper hospital bed — low metal frame, white sheets, one raised pillow —
// standing in as the room's clear visual anchor.
function HospitalBed({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* frame legs */}
      {([-0.55, 0.55] as number[]).map((lx) =>
        ([-0.85, 0.85] as number[]).map((lz, j) => (
          <mesh key={`${lx}-${j}`} castShadow position={[lx, 0.22, lz]}>
            <cylinderGeometry args={[0.03, 0.03, 0.44, 6]} />
            <meshStandardMaterial color="#c7ccd4" metalness={0.5} roughness={0.4} />
          </mesh>
        ))
      )}
      {/* mattress base */}
      <mesh castShadow receiveShadow position={[0, 0.46, 0]}>
        <boxGeometry args={[1.2, 0.16, 2.0]} />
        <meshStandardMaterial color="#eef1f5" roughness={0.6} />
      </mesh>
      {/* sheet / blanket */}
      <mesh castShadow position={[0, 0.565, 0.05]}>
        <boxGeometry args={[1.18, 0.06, 1.85]} />
        <meshStandardMaterial color="#fbfbf8" roughness={0.75} />
      </mesh>
      <mesh castShadow position={[0, 0.60, 0.5]}>
        <boxGeometry args={[1.16, 0.05, 0.7]} />
        <meshStandardMaterial color="#dce6ea" roughness={0.8} />
      </mesh>
      {/* pillow */}
      <mesh castShadow position={[0, 0.62, -0.78]}>
        <boxGeometry args={[0.7, 0.12, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      {/* head/foot rails */}
      <mesh castShadow position={[0, 0.72, -1.0]}>
        <boxGeometry args={[1.22, 0.5, 0.05]} />
        <meshStandardMaterial color="#c7ccd4" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 0.62, 1.0]}>
        <boxGeometry args={[1.22, 0.3, 0.05]} />
        <meshStandardMaterial color="#c7ccd4" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

// Wall-mounted window: frame + glass, so it reads as an opening in the wall
// rather than a floating pane.
function Window({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.3, 1.5, 0.1]} />
        <meshStandardMaterial color={TRIM} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[1.05, 1.25]} />
        <meshStandardMaterial color="#ffe6b0" emissive="#ffcf80" emissiveIntensity={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[0.04, 1.25]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.05, 0.04]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
    </group>
  );
}

// Privacy curtain — a soft fabric drape along one side, a very recognizable
// hospital-room cue.
function Curtain({ position }: { position: [number, number, number] }) {
  const pleats = [-0.6, -0.36, -0.12, 0.12, 0.36, 0.6];
  return (
    <group position={position}>
      <mesh position={[0, WALL_H - 0.1, 0]}>
        <boxGeometry args={[1.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#b8bec8" metalness={0.5} roughness={0.4} />
      </mesh>
      {pleats.map((px, i) => (
        <mesh key={i} castShadow position={[px, WALL_H / 2 - 0.1, 0]}>
          <boxGeometry args={[0.22, WALL_H - 0.3, 0.03]} />
          <meshStandardMaterial color="#a8c4d8" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function HospitalRoom() {
  return (
    <group>
      {/* floor — pale tile, distinct from the outdoor road */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#e4e8ea" roughness={0.55} />
      </mesh>
      {/* skirting trim so the floor-wall join reads clearly */}
      <mesh position={[0, 0.10, FOCAL_Z - 1.85]}>
        <boxGeometry args={[9, 0.2, 0.05]} />
        <meshStandardMaterial color={TRIM} roughness={0.7} />
      </mesh>

      {/* back wall, close enough behind the bed to stay in the fixed frame */}
      <mesh receiveShadow position={[0, WALL_H / 2, FOCAL_Z - 1.9]}>
        <boxGeometry args={[9, WALL_H, 0.15]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
      {/* lower wainscoting band — a common hospital-room material cue */}
      <mesh position={[0, 0.55, FOCAL_Z - 1.82]}>
        <boxGeometry args={[9, 1.1, 0.02]} />
        <meshStandardMaterial color={TRIM} roughness={0.8} />
      </mesh>

      {/* side walls, generously sized so they stay in frame either side */}
      <mesh receiveShadow position={[-3.8, WALL_H / 2, FOCAL_Z]}>
        <boxGeometry args={[0.15, WALL_H, 4.4]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[3.8, WALL_H / 2, FOCAL_Z]}>
        <boxGeometry args={[0.15, WALL_H, 4.4]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>

      {/* ceiling */}
      <mesh position={[0, WALL_H, FOCAL_Z]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 4.4]} />
        <meshStandardMaterial color="#fbf6e8" />
      </mesh>
      {/* soft ceiling light panel */}
      <mesh position={[0, WALL_H - 0.02, FOCAL_Z]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.0]} />
        <meshStandardMaterial color="#fff8ea" emissive="#fff2d8" emissiveIntensity={0.55} />
      </mesh>

      <Window position={[2.0, 1.75, FOCAL_Z - 1.83]} />
      <Curtain position={[-3.7, 0, FOCAL_Z + 0.6]} />
    </group>
  );
}

export default function HospitalScene() {
  return (
    <group position={[0, 0, CENTER_Z]}>
      <HospitalRoom />
      <HospitalBed position={[0, 0, FOCAL_Z]} />
      <Bassinet position={[-1.45, 0, FOCAL_Z - 0.5]} />
      <Monitor position={[-1.15, 0, FOCAL_Z - 1.1]} />
      <IVStand position={[1.15, 0, FOCAL_Z - 0.7]} />

      <GlowParticles position={[0, 1.6, FOCAL_Z]} count={14} color="#ffe6b0" scale={[3.4, 1.6, 3.2]} size={0.4} speed={0.04} />
    </group>
  );
}
