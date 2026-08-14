import { Text, Billboard } from "@react-three/drei";
import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import Buildings from "../components/environment/blocks/Buildings";
import TechTotem from "../components/environment/blocks/TechTotem";
import DataStream from "../components/environment/blocks/DataStream";
import GlowParticles from "../components/environment/blocks/GlowParticles";
import DeskSetup from "../components/environment/blocks/DeskSetup";
import MoneyPlant from "../components/environment/blocks/MoneyPlant";

const range = chapterWorldRanges.find((r) => r.id === "ioss")!;

const MVC = ["Controllers", "Services", "Models"];

// ─── iOSS corporate office building ──────────────────────────────────────────
// A sleek glass curtain-wall facade (full-height glazing rather than punched
// windows) — reads as a modern software company, distinct from BTRAC's
// lab-window training-institute look. Sits left of the road (negative x), so
// its road-facing wall is the local +x face, same convention as Buildings.tsx.
function CorporateOffice({ position }: { position: [number, number, number] }) {
  const W = 5.6;
  const H = 4.2;
  const D = 3.6;
  const floors = 3;

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#eef3ef" flatShading roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, H + 0.04, 0]}>
        <boxGeometry args={[W + 0.1, 0.08, D + 0.1]} />
        <meshStandardMaterial color="#3f8f4f" flatShading roughness={0.5} />
      </mesh>

      {/* full-height glass curtain wall on the road-facing side */}
      {Array.from({ length: floors }, (_, fi) => (
        <mesh key={fi} position={[W / 2 + 0.012, 0.5 + fi * (H / floors) + H / floors / 2 - 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[D - 0.3, H / floors - 0.18]} />
          <meshStandardMaterial color="#0b1220" emissive="#3f8f4f" emissiveIntensity={0.32} transparent opacity={0.88} />
        </mesh>
      ))}
      {/* mullions dividing the glass into panes */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[W / 2 + 0.02, H / 2, -D / 2 + 0.3 + i * ((D - 0.6) / 4)]}>
          <boxGeometry args={[0.03, H - 0.4, 0.03]} />
          <meshStandardMaterial color="#c8cdd6" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {/* glass entrance + canopy */}
      <mesh position={[W / 2 + 0.013, 0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.7, 1.75]} />
        <meshStandardMaterial color="#0b1220" emissive="#7ef7c4" emissiveIntensity={0.28} transparent opacity={0.85} />
      </mesh>
      <mesh castShadow position={[W / 2 + 0.55, 2.0, 0]}>
        <boxGeometry args={[1.1, 0.06, 2.2]} />
        <meshStandardMaterial color="#2a3a2e" roughness={0.55} />
      </mesh>

      {/* signage pylon */}
      <Billboard position={[0, H + 0.85, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[2.9, 0.85]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        <Text fontSize={0.28} color="#2a2e38" anchorX="center" anchorY="middle" position={[0, 0.15, 0]} letterSpacing={0.03}>
          iOSS
        </Text>
        <Text fontSize={0.095} color="#3f8f4f" anchorX="center" anchorY="middle" position={[0, -0.18, 0]} letterSpacing={0.03}>
          INFINITE OPEN SOURCE SOLUTIONS
        </Text>
      </Billboard>

      {/* planters flanking the entrance */}
      <MoneyPlant position={[W / 2 + 1.25, 0, 0.9]} seed={2} />
      <MoneyPlant position={[W / 2 + 1.25, 0, -0.9]} seed={5} />
    </group>
  );
}

// ─── Open-plan workstation cluster ───────────────────────────────────────────
const DESK_ACCENTS = ["#3f8f4f", "#5b6cff", "#4fd1ff", "#7ef7c4", "#3f8f4f", "#5b6cff", "#4fd1ff", "#7ef7c4", "#3f8f4f"];

function OpenPlanOffice({ position }: { position: [number, number, number] }) {
  const cols = 3;
  const rows = 3;
  const colSpacing = 1.0;
  const rowSpacing = 1.1;
  const desks: { x: number; z: number; rot: number; accent: string }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      desks.push({
        x: (c - (cols - 1) / 2) * colSpacing,
        z: r * rowSpacing,
        rot: Math.sin(i * 2.1) * 0.1,
        accent: DESK_ACCENTS[i % DESK_ACCENTS.length],
      });
    }
  }
  // a money plant at the end of every other row, like a real open-plan floor
  const plants = [0, 2].map((r) => ({ x: (cols - 1) / 2 * colSpacing + 0.75, z: r * rowSpacing + 0.3, seed: r + 8 }));

  return (
    <group position={position}>
      {desks.map((d, i) => (
        <DeskSetup key={i} position={[d.x, 0, d.z]} rotation={d.rot} accent={d.accent} />
      ))}
      {plants.map((p, i) => (
        <MoneyPlant key={i} position={[p.x, 0, p.z]} seed={p.seed} scale={1.15} />
      ))}
    </group>
  );
}

export default function InfiniteOpenSourceScene() {
  const officeZ = range.startZ + range.length * 0.14;
  const deskZ = range.startZ + range.length * 0.26;
  const hubZ = range.startZ + range.length * 0.5;

  return (
    <group>
      <Ground chapterId="ioss" z={range.startZ} length={range.length} />
      <Buildings z={range.startZ} length={range.length * 0.4} count={2} seed={71} side="right" palette={["#f2f4f8"]} minH={3.4} maxH={4.6} roadWidth={4.6} roofed={false} />

      {/* iOSS — "today, I build systems that connect people, platforms, and
          data": a proper corporate glass office with a populated open-plan
          floor (many workstations + money-plant greenery), a distinct,
          warmer-green atmosphere from BTRAC's training-institute blue. */}
      <CorporateOffice position={[-5.0, 0, officeZ]} />
      <OpenPlanOffice position={[-3.4, 0, deskZ]} />
      <MoneyPlant position={[-4.9, 0, deskZ - 1.1]} seed={13} scale={1.3} />
      <MoneyPlant position={[-1.7, 0, deskZ + 3.0]} seed={21} scale={1.1} />

      {/* Laravel MVC cluster */}
      <TechTotem position={[-2.6, 1.4, hubZ - 1.4]} label="Laravel" color="#ff6b57" height={1.3} />
      {MVC.map((m, i) => (
        <TechTotem key={m} position={[-3.6 + i * 1.1, 1.1, hubZ - 0.4]} label={m} color="#ff9c8a" height={0.9} floatSpeed={0.7 + i * 0.2} />
      ))}

      {/* WordPress / WooCommerce storefront */}
      <TechTotem position={[2.4, 1.5, hubZ + 0.6]} label="WordPress" color="#5b6cff" height={1.3} />
      <TechTotem position={[3.4, 1.3, hubZ + 1.4]} label="WooCommerce" color="#c39bff" height={1.2} floatSpeed={1} />

      {/* database + external services */}
      <TechTotem position={[0.2, 1, hubZ + 2.4]} label="MySQL" color="#ffb37e" height={1} />
      <TechTotem position={[-1.2, 1.2, hubZ + 3.2]} label="Third-party APIs" color="#7ef7c4" height={1.1} floatSpeed={0.8} />

      <DataStream
        points={[
          [-2.6, 1.4, hubZ - 1.4],
          [-2.4, 1.1, hubZ - 0.4],
          [0.2, 1, hubZ + 2.4],
          [2.4, 1.5, hubZ + 0.6],
        ]}
        color="#4fd1ff"
      />
      <DataStream
        points={[
          [2.4, 1.5, hubZ + 0.6],
          [3.4, 1.3, hubZ + 1.4],
          [0.2, 1, hubZ + 2.4],
          [-1.2, 1.2, hubZ + 3.2],
        ]}
        color="#c39bff"
        speed={0.45}
      />

      <GlowParticles position={[0, 2, hubZ]} count={60} color="#5b6cff" scale={[8, 4, range.length]} speed={0.25} />
    </group>
  );
}
