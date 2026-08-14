import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, RoundedBox } from "@react-three/drei";
import { introAnchor } from "../utils/path";
import DataStream from "../components/environment/blocks/DataStream";
import GlowParticles from "../components/environment/blocks/GlowParticles";

// The opening vignette held at journey start (see INTRO_HOLD in chapters.ts) —
// a fixed-camera showcase of the stack, not something the camera dollies
// through. FOCAL_Z matches CameraRig's "intro" lookAt offset so the card
// cluster sits dead-center in that one held shot.
const CENTER_Z = introAnchor.z;
const FOCAL_Z = -0.6;

// Opaque enclosure so the outdoor village (sky/fence/ground) behind this held
// shot doesn't bleed through. Only a wall placed IN FRONT OF (closer to the
// camera than) ChildhoodScene's fence — which starts at local z ≈ -1.87,
// computed from chapterWorldRanges — actually occludes it; a wall set deep
// behind the cards leaves a gap the fence renders inside (learned the hard
// way — widening the side walls/ceiling did nothing, since a full-width back
// wall is the only barrier perpendicular enough to block it). So BACK_Z sits
// just behind the deepest card, and every card/prop below must stay shallower
// than it — see the LAYOUT depth comment.
const WALL_H = 7;
const BACK_Z = FOCAL_Z - 1.1;
const SIDE_X = 7;
const FRONT_Z = FOCAL_Z + 2.4;

interface TechDef {
  label: string;
  glyph: string;
  color: string;
}

const TECHS: TechDef[] = [
  { label: "PHP", glyph: "php", color: "#9b8cf0" },
  { label: "Laravel", glyph: "L", color: "#ff5240" },
  { label: "JavaScript", glyph: "JS", color: "#f7df1e" },
  { label: "HTML", glyph: "</>", color: "#ff7a50" },
  { label: "CSS", glyph: "{ }", color: "#4f9dff" },
  { label: "MySQL", glyph: "SQL", color: "#4fd1ff" },
  { label: "WordPress", glyph: "W", color: "#7ec8ff" },
];

// Hand-placed fan arrangement, all facing the held camera — depth (z) and
// height (y) staggered so the cluster reads as floating, not a flat row.
// Depths are kept shallower than BACK_Z (-1.7) so every card stays in front
// of the enclosure wall — see the BACK_Z comment above for why that ordering
// matters.
const LAYOUT: [number, number, number, number][] = [
  // x, y, localZ, rotationY
  [-1.85, 0.95, -0.5, 0.35],
  [-1.15, 1.55, -0.2, 0.2],
  [-0.4, 0.8, -0.8, 0.08],
  [0.35, 1.65, -0.8, -0.08],
  [1.1, 0.85, -0.25, -0.2],
  [1.85, 1.5, -0.5, -0.35],
  [0, 2.15, -0.9, 0],
];

function TechCard({ tech, position, rotationY, seed }: { tech: TechDef; position: [number, number, number]; rotationY: number; seed: number }) {
  const float = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!float.current) return;
    const t = clock.elapsedTime;
    float.current.position.y = Math.sin(t * 0.55 + seed) * 0.09;
    float.current.rotation.y = Math.sin(t * 0.3 + seed) * 0.12;
    float.current.rotation.z = Math.sin(t * 0.4 + seed * 1.3) * 0.025;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group ref={float}>
        {/* soft additive glow behind the card */}
        <mesh position={[0, 0, -0.06]}>
          <circleGeometry args={[0.58, 24]} />
          <meshBasicMaterial color={tech.color} transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        {/* glass panel */}
        <RoundedBox args={[0.62, 0.78, 0.05]} radius={0.07} smoothness={4} castShadow>
          <meshPhysicalMaterial color="#0b0e1a" transparent opacity={0.62} roughness={0.3} metalness={0.1} clearcoat={0.5} />
        </RoundedBox>

        {/* brand-tinted rim */}
        <RoundedBox args={[0.625, 0.785, 0.052]} radius={0.07} smoothness={4}>
          <meshBasicMaterial color={tech.color} wireframe transparent opacity={0.55} />
        </RoundedBox>

        <Text position={[0, 0.11, 0.035]} fontSize={tech.glyph.length > 2 ? 0.16 : 0.26} color={tech.color} anchorX="center" anchorY="middle" outlineWidth={0.004} outlineColor="#05060c">
          {tech.glyph}
        </Text>
        <Text position={[0, -0.26, 0.035]} fontSize={0.072} color="#f5f3ee" anchorX="center" anchorY="middle" letterSpacing={0.03}>
          {tech.label.toUpperCase()}
        </Text>
      </group>
    </group>
  );
}

// Slowly rotating wireframe core, crowning the cluster — the "engine" the
// stack orbits around.
function CodeCore({ position }: { position: [number, number, number] }) {
  const core = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!core.current) return;
    core.current.rotation.y += delta * 0.15;
    core.current.rotation.x += delta * 0.05;
  });
  return (
    <group position={position} ref={core}>
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Faux backdrop glow — concentric additive discs standing in for a radial
// vignette, cheaper than a generated gradient texture.
function BackGlow({ position }: { position: [number, number, number] }) {
  const rings = [
    { r: 6.5, color: "#141a33", o: 0.7 },
    { r: 4.4, color: "#1c2450", o: 0.55 },
    { r: 2.4, color: "#3a3f8c", o: 0.4 },
  ];
  return (
    <group position={position}>
      {rings.map((r, i) => (
        <mesh key={i} position={[0, 0, -0.02 * i]}>
          <circleGeometry args={[r.r, 32]} />
          <meshBasicMaterial color={r.color} transparent opacity={r.o} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function TechStage() {
  const midZ = (FRONT_Z + BACK_Z) / 2;
  const depth = FRONT_Z - BACK_Z;
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, midZ]}>
        <planeGeometry args={[SIDE_X * 2, depth]} />
        <meshStandardMaterial color="#080a14" roughness={0.35} metalness={0.35} />
      </mesh>
      <mesh receiveShadow position={[0, WALL_H / 2, BACK_Z]}>
        <boxGeometry args={[SIDE_X * 2, WALL_H, 0.15]} />
        <meshStandardMaterial color="#05060c" roughness={0.85} />
      </mesh>
      <mesh receiveShadow position={[-SIDE_X, WALL_H / 2, midZ]}>
        <boxGeometry args={[0.15, WALL_H, depth]} />
        <meshStandardMaterial color="#05060c" roughness={0.85} />
      </mesh>
      <mesh receiveShadow position={[SIDE_X, WALL_H / 2, midZ]}>
        <boxGeometry args={[0.15, WALL_H, depth]} />
        <meshStandardMaterial color="#05060c" roughness={0.85} />
      </mesh>
      <mesh position={[0, WALL_H, midZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SIDE_X * 2, depth]} />
        <meshStandardMaterial color="#05060c" roughness={0.9} />
      </mesh>

      {/* Low curb near the open front edge — the stage has no near wall (the
          camera looks in from outside it, same as the room this replaced),
          so ground-level village clutter (fence posts) beyond this point
          would otherwise show at the very bottom corners of the frame. Kept
          short so it doesn't clip the cards, which all sit above y=0.8. */}
      <mesh receiveShadow position={[0, 0.33, FOCAL_Z + 1.6]}>
        <boxGeometry args={[SIDE_X * 2, 0.66, 0.4]} />
        <meshStandardMaterial color="#05060c" roughness={0.85} />
      </mesh>
    </group>
  );
}

export default function TechIntroScene() {
  const cardPoints = LAYOUT.map(([x, y, z]) => [x, y + 0.3, FOCAL_Z + z] as [number, number, number]);

  return (
    <group position={[0, 0, CENTER_Z]}>
      <BackGlow position={[0, 1.8, BACK_Z + 0.08]} />
      <TechStage />

      <CodeCore position={[0, 2.0, FOCAL_Z - 0.75]} />

      {LAYOUT.map(([x, y, z, rotationY], i) => (
        <TechCard key={TECHS[i].label} tech={TECHS[i]} position={[x, y, FOCAL_Z + z]} rotationY={rotationY} seed={i * 1.7} />
      ))}

      {/* thin light threads linking the cards into a loose constellation */}
      <DataStream points={[cardPoints[0], cardPoints[1], cardPoints[6], cardPoints[3], cardPoints[4], cardPoints[5]]} color="#818cf8" pulseCount={4} speed={0.18} />
      <DataStream points={[cardPoints[1], cardPoints[2], cardPoints[6], cardPoints[4]]} color="#4fd1ff" pulseCount={3} speed={0.14} />

      <GlowParticles position={[0, 1.6, FOCAL_Z - 0.8]} count={40} color="#818cf8" scale={[4.2, 2.4, 2.4]} size={0.35} speed={0.05} />
      <GlowParticles position={[0, 1.2, FOCAL_Z - 0.6]} count={20} color="#4fd1ff" scale={[3.6, 1.8, 2]} size={0.3} speed={0.06} />
    </group>
  );
}
