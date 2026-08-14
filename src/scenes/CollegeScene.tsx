import * as THREE from "three";
import { Text } from "@react-three/drei";
import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import Trees from "../components/environment/blocks/Trees";
import Buildings from "../components/environment/blocks/Buildings";
import TechTotem from "../components/environment/blocks/TechTotem";
import DataStream from "../components/environment/blocks/DataStream";

const range = chapterWorldRanges.find((r) => r.id === "college")!;
const Z = range.startZ;
const L = range.length;

// Identity trim for the CS block — a modern, cool-toned counterpart to the
// school's warm navy/terracotta, so the two campuses read as visually
// distinct even though they share the same architectural "language"
// (contrast trim + legible signage) established in SchoolScene.
const TRIM = "#33445c";
const GLASS = "#bfe0ff";
const GLASS_EMISSIVE = "#4fa8e0";

// Department building — its glazed elevation faces -X (toward the road),
// the same reasoning as SchoolScene's SchoolBuilding: the building sits to
// the -X side of the path, so the detailed face has to point +X-toward-the-
// road-relative-to-itself, i.e. the local +X side, to actually be seen while
// the character walks past instead of showing a blank flank.
function CSBlock({ x, z }: { x: number; z: number }) {
  const pillarZ = [-3.6, -1.8, 0, 1.8, 3.6];
  const windowZ = [-3.0, -1.6, -0.2, 1.2, 2.6];

  return (
    <group position={[x, 0, z]}>
      {/* Plinth */}
      <mesh receiveShadow castShadow position={[0, 0.13, 0]}>
        <boxGeometry args={[3.9, 0.26, 9.8]} />
        <meshStandardMaterial color="#c8ccd2" roughness={0.8} />
      </mesh>

      {/* Main wall — clean white/grey precast panels */}
      <mesh receiveShadow castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[3.6, 2.6, 9.4]} />
        <meshStandardMaterial color="#eef1f4" roughness={0.75} />
      </mesh>

      {/* Flat overhanging roof with a bold fascia band — strong silhouette
          against the sky, same trick as the terracotta roof in SchoolScene
          but in a cool "modern block" palette instead of a warm one. */}
      <mesh castShadow position={[0, 2.95, 0]}>
        <boxGeometry args={[4.9, 0.2, 10.4]} />
        <meshStandardMaterial color="#d7dbe0" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[1.85, 2.78, 0]}>
        <boxGeometry args={[0.16, 0.5, 10.4]} />
        <meshStandardMaterial color={TRIM} roughness={0.6} />
      </mesh>

      {/* Covered walkway columns, slim/square for a modern read */}
      {pillarZ.map((cz, i) => (
        <mesh key={i} castShadow position={[1.95, 1.5, cz]}>
          <boxGeometry args={[0.18, 2.6, 0.18]} />
          <meshStandardMaterial color="#dfe3e8" roughness={0.7} />
        </mesh>
      ))}

      {/* Curtain-wall style windows — wide glazed bays with a slim mullion,
          wrapped in a group rotated to face -X (see file note above). */}
      {windowZ.map((wz, i) => (
        <group key={i} position={[1.8, 1.7, wz]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.0, 1.3, 0.08]} />
            <meshStandardMaterial color={TRIM} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[0.86, 1.1]} />
            <meshStandardMaterial color={GLASS} emissive={GLASS_EMISSIVE} emissiveIntensity={0.5} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[0.03, 1.1]} />
            <meshStandardMaterial color={TRIM} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Entrance */}
      <mesh castShadow position={[1.81, 0.95, -4.4]}>
        <boxGeometry args={[0.08, 1.85, 1.0]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} />
      </mesh>
      <mesh position={[1.86, 0.95, -4.4]}>
        <planeGeometry args={[0.9, 1.7]} />
        <meshStandardMaterial color={GLASS} emissive={GLASS_EMISSIVE} emissiveIntensity={0.3} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Steps */}
      <mesh receiveShadow castShadow position={[2.35, 0.19, -4.4]}>
        <boxGeometry args={[0.4, 0.16, 1.6]} />
        <meshStandardMaterial color="#c8ccd2" roughness={0.85} />
      </mesh>

      {/* Name board */}
      <group position={[1.84, 2.28, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[3.2, 0.44]} />
          <meshStandardMaterial color={TRIM} roughness={0.55} />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.19} color="#f5f3ee" anchorX="center" anchorY="middle" letterSpacing={0.04}>
          KANNUR UNIVERSITY
        </Text>
      </group>

      {/* Computer lab windows — glowing monitor row, visible through the
          glazing on the ground floor near the entrance. */}
      <group position={[1.83, 1.0, -2.6]} rotation={[0, -Math.PI / 2, 0]}>
        {[-1.35, -0.45, 0.45, 1.35].map((lx, i) => (
          <mesh key={i} position={[lx, 0, 0.02]}>
            <planeGeometry args={[0.5, 0.34]} />
            <meshStandardMaterial color="#0b1220" emissive="#4fd1ff" emissiveIntensity={1.1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Pylon entrance sign — a modern monolith rather than the school's classic
// arch gate, so the two campuses feel like different places.
function EntrancePylon({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[0.5, 2.2, 0.22]} />
        <meshStandardMaterial color="#dfe3e8" roughness={0.7} />
      </mesh>
      {/* Placard faces -Z — the direction the character approaches from,
          not the default +Z a Text/plane starts out facing (see the same
          fix on SchoolScene's gate sign). */}
      <mesh position={[0, 1.55, -0.12]}>
        <boxGeometry args={[0.44, 0.9, 0.02]} />
        <meshStandardMaterial color={TRIM} roughness={0.6} />
      </mesh>
      <Text position={[0, 1.75, -0.14]} rotation={[0, Math.PI, 0]} fontSize={0.075} color="#f5f3ee" anchorX="center" anchorY="middle" maxWidth={0.4} textAlign="center" letterSpacing={0.02}>
        KANNUR{"\n"}UNIVERSITY
      </Text>
      <Text position={[0, 1.35, -0.14]} rotation={[0, Math.PI, 0]} fontSize={0.06} color={GLASS} anchorX="center" anchorY="middle" maxWidth={0.4} textAlign="center">
        B.Sc Computer Science
      </Text>
    </group>
  );
}

export default function CollegeScene() {
  const buildX = -4.6;
  const midZ = Z + L * 0.45;
  const frontX = buildX + 1.86; // world x of the CS block's glazed face
  const labZ = midZ + 2.2;

  return (
    <group>
      <Ground chapterId="college" z={Z} length={L} />
      <Trees z={Z} length={L} count={14} seed={31} variant="round" roadWidth={4.0} />
      <Buildings z={Z} length={L * 0.85} count={5} seed={12} palette={["#dfe4e8", "#cfd8dd"]} minH={2} maxH={2.8} roadWidth={4.0} />

      <EntrancePylon x={2.2} z={Z + L * 0.05} />

      {/* Computer Science block, facing the road */}
      <CSBlock x={buildX} z={midZ} />

      {/* Lawn / quad in front of the building */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[frontX - 1.4, 0.008, midZ]}>
        <circleGeometry args={[2.2, 24]} />
        <meshStandardMaterial color="#5c9a4e" roughness={0.95} />
      </mesh>

      {/* A couple of benches on the quad */}
      {([midZ - 1.4, midZ + 1.4] as number[]).map((bz, i) => (
        <group key={i} position={[frontX - 1.4, 0, bz]}>
          <mesh castShadow position={[0, 0.44, 0]}>
            <boxGeometry args={[0.9, 0.06, 0.28]} />
            <meshStandardMaterial color="#8a6040" roughness={0.8} />
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

      {/* Floating tech totems + connecting data stream — the visual motif
          for "curiosity became code", now anchored just off the CS block's
          front steps instead of an arbitrary offset. */}
      <TechTotem position={[frontX - 0.8, 1.6, labZ]} label="PHP" color="#8892be" height={1.2} />
      <TechTotem position={[frontX - 2.6, 1.9, labZ + 0.8]} label="MySQL" color="#ffb37e" height={1.4} floatSpeed={0.8} />
      <TechTotem position={[frontX - 1.7, 2.1, labZ + 1.6]} label="JavaScript" color="#ffe27e" height={1.5} floatSpeed={1.2} />

      <DataStream
        points={[
          [frontX - 0.8, 1.6, labZ],
          [frontX - 1.7, 2.1, labZ + 0.8],
          [frontX - 2.6, 1.9, labZ + 0.8],
          [frontX - 1.7, 2.1, labZ + 1.6],
        ]}
        color="#4fd1ff"
      />
    </group>
  );
}
