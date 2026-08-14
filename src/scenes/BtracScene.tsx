import { Text, Billboard } from "@react-three/drei";
import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import Buildings from "../components/environment/blocks/Buildings";
import DataStream from "../components/environment/blocks/DataStream";
import TechTotem from "../components/environment/blocks/TechTotem";
import ServerRack from "../components/environment/blocks/ServerRack";
import DeskSetup, { Whiteboard } from "../components/environment/blocks/DeskSetup";

const range = chapterWorldRanges.find((r) => r.id === "btrac")!;

// ─── BTRAC institute building ────────────────────────────────────────────────
// A proper multi-window facade + signage pylon, replacing the old single
// blank-walled box — the building sits to the left of the road (negative x),
// so its road-facing wall is the local +x face (see Buildings.tsx for the
// same left/right convention).
function TrainingInstitute({ position }: { position: [number, number, number] }) {
  const W = 5.2;
  const H = 3.6;
  const D = 3.4;
  const rows = 3;
  const cols = 5;

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#eef1f5" flatShading roughness={0.75} />
      </mesh>

      {/* parapet roofline trim */}
      <mesh castShadow position={[0, H + 0.05, 0]}>
        <boxGeometry args={[W + 0.1, 0.1, D + 0.1]} />
        <meshStandardMaterial color="#5b6cff" flatShading roughness={0.5} />
      </mesh>

      {/* road-facing computer-lab window grid — many small glowing panes
          read as rows of monitors inside, standing in for the lab itself */}
      {Array.from({ length: rows }, (_, ri) =>
        Array.from({ length: cols }, (_, ci) => {
          const wy = 0.9 + ri * 0.85;
          const wz = -D / 2 + 0.45 + ci * ((D - 0.9) / (cols - 1));
          return (
            <mesh key={`${ri}-${ci}`} position={[W / 2 + 0.012, wy, wz]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.5, 0.56]} />
              <meshStandardMaterial color="#0b1220" emissive="#5b6cff" emissiveIntensity={0.55} transparent opacity={0.92} />
            </mesh>
          );
        })
      )}

      {/* ground-floor glass entrance */}
      <mesh position={[W / 2 + 0.013, 0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.6, 1.7]} />
        <meshStandardMaterial color="#0b1220" emissive="#7ef7c4" emissiveIntensity={0.3} transparent opacity={0.85} />
      </mesh>
      <mesh castShadow position={[W / 2 + 0.5, 1.95, 0]}>
        <boxGeometry args={[1.0, 0.06, 2.0]} />
        <meshStandardMaterial color="#3a4050" roughness={0.6} />
      </mesh>
      {/* canopy support posts */}
      {([-0.9, 0.9] as number[]).map((cz, i) => (
        <mesh key={i} castShadow position={[W / 2 + 0.95, 0.98, cz]}>
          <cylinderGeometry args={[0.025, 0.025, 1.9, 6]} />
          <meshStandardMaterial color="#3a4050" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}

      {/* rooftop signage pylon */}
      <Billboard position={[0, H + 0.9, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[2.7, 0.9]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <Text fontSize={0.32} color="#2a2e38" anchorX="center" anchorY="middle" position={[0, 0.15, 0]} letterSpacing={0.02}>
          BTRAC
        </Text>
        <Text fontSize={0.11} color="#5b6cff" anchorX="center" anchorY="middle" position={[0, -0.2, 0]} letterSpacing={0.08}>
          TRAINING INSTITUTE
        </Text>
      </Billboard>
    </group>
  );
}

// ─── Computer lab desk grid ───────────────────────────────────────────────────
const LAB_ACCENTS = ["#5b6cff", "#7ef7c4", "#ffb37e", "#4fd1ff", "#c39bff", "#ff9c8a", "#5b6cff", "#7ef7c4"];

function ComputerLab({ position }: { position: [number, number, number] }) {
  const cols = 4;
  const rows = 2;
  const colSpacing = 0.95;
  const rowSpacing = 1.05;
  const desks: { x: number; z: number; rot: number; accent: string }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      desks.push({
        x: (c - (cols - 1) / 2) * colSpacing,
        z: r * rowSpacing,
        rot: Math.sin(i * 1.7) * 0.12,
        accent: LAB_ACCENTS[i % LAB_ACCENTS.length],
      });
    }
  }
  return (
    <group position={position}>
      {/* board sits beyond the last desk row — the "front of class" the rows
          face, reached after the desks rather than looming first */}
      <Whiteboard position={[0, 1.1, rows * rowSpacing]} />
      {desks.map((d, i) => (
        <DeskSetup key={i} position={[d.x, 0, d.z]} rotation={d.rot} accent={d.accent} />
      ))}
    </group>
  );
}

export default function BtracScene() {
  const instituteZ = range.startZ + range.length * 0.14;
  const labZ = range.startZ + range.length * 0.24;
  const flowZ = range.startZ + range.length * 0.75;

  return (
    <group>
      <Ground chapterId="btrac" z={range.startZ} length={range.length} />
      <Buildings z={range.startZ} length={range.length * 0.5} count={2} seed={41} side="right" palette={["#eef1f5", "#dfe4ea"]} minH={3} maxH={4.2} roadWidth={4.4} roofed={false} />

      {/* BTRAC — the "first professional experience" beat: a proper training
          institute facade with a full computer lab out front, instead of a
          single blank office block and one desk. Everything is pulled back
          from the road centerline (|x| >= ~2) so nothing looms blank-faced
          right next to the walking path. */}
      <TrainingInstitute position={[-4.6, 0, instituteZ]} />
      <ComputerLab position={[-3.1, 0, labZ]} />
      <ServerRack position={[-4.35, 0, instituteZ + 1.6]} color="#4fd1ff" />
      <ServerRack position={[-4.05, 0, instituteZ + 2.2]} color="#7ef7c4" rows={5} />

      <TechTotem position={[0.4, 1.1, flowZ - 1]} label="MySQL Query" color="#ffb37e" height={1} />
      <TechTotem position={[1.6, 1.3, flowZ]} label="REST API" color="#4fd1ff" height={1.1} floatSpeed={0.9} />
      <TechTotem position={[0.6, 1.5, flowZ + 1]} label="Web App" color="#7ef7c4" height={1.2} floatSpeed={0.7} />
      <TechTotem position={[1.8, 1.7, flowZ + 2]} label="WooCommerce" color="#c39bff" height={1.3} floatSpeed={1.1} />

      <DataStream
        points={[
          [0.4, 1.1, flowZ - 1],
          [1.6, 1.3, flowZ],
          [0.6, 1.5, flowZ + 1],
          [1.8, 1.7, flowZ + 2],
        ]}
        color="#5b6cff"
      />
    </group>
  );
}
