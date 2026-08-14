import { useMemo } from "react";
import { chapterWorldRanges } from "../utils/path";
import { mulberry32 } from "../components/environment/blocks/rng";
import Ground from "../components/environment/blocks/Ground";
import Trees from "../components/environment/blocks/Trees";
import GlowParticles from "../components/environment/blocks/GlowParticles";
import HospitalScene from "./HospitalScene";

const range = chapterWorldRanges.find((r) => r.id === "childhood")!;
const L = range.length;
const Z = range.startZ;

// ─── Banana tree ────────────────────────────────────────────────────────────
function BananaTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const leaves = useMemo(
    () =>
      [0, 55, 110, 165, 220, 280].map((deg) => ({
        angle: (deg * Math.PI) / 180,
        tilt: 0.38 + Math.sin(deg * 0.07) * 0.08,
      })),
    []
  );
  return (
    <group position={[x, 0, z]} scale={scale}>
      {/* thick green trunk */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.15, 0.20, 2.2, 7]} />
        <meshStandardMaterial color="#7a9a18" flatShading roughness={0.88} />
      </mesh>
      {/* broad arching leaves */}
      {leaves.map((lf, i) => (
        <group key={i} position={[0, 2.3, 0]} rotation={[lf.tilt, lf.angle, 0]}>
          <mesh castShadow position={[0, 0.55, 0]}>
            <boxGeometry args={[0.10, 1.1, 0.03]} />
            <meshStandardMaterial color="#4a8018" flatShading roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Kerala traditional house ────────────────────────────────────────────────
function KeralaHouse({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Plinth / platform */}
      <mesh receiveShadow castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[6.0, 0.24, 3.6]} />
        <meshStandardMaterial color="#c8b48a" flatShading roughness={0.90} />
      </mesh>

      {/* Main walls */}
      <mesh receiveShadow castShadow position={[0, 1.12, 0]}>
        <boxGeometry args={[5.6, 2.0, 3.2]} />
        <meshStandardMaterial color="#e0cfa4" flatShading roughness={0.88} />
      </mesh>

      {/* Wide overhanging tiled roof — characteristic Kerala style */}
      <mesh castShadow position={[0, 2.28, 0]}>
        <boxGeometry args={[7.2, 0.32, 4.8]} />
        <meshStandardMaterial color="#b04030" flatShading roughness={0.90} />
      </mesh>
      {/* Roof ridge */}
      <mesh castShadow position={[0, 2.52, 0]}>
        <boxGeometry args={[7.4, 0.16, 0.30]} />
        <meshStandardMaterial color="#8a3028" flatShading roughness={0.90} />
      </mesh>

      {/* Veranda columns (front face) */}
      {([-2.1, -0.8, 0.8, 2.1] as number[]).map((cx, i) => (
        <mesh key={i} castShadow position={[cx, 1.10, 1.72]}>
          <boxGeometry args={[0.14, 2.20, 0.14]} />
          <meshStandardMaterial color="#c8a870" flatShading roughness={0.88} />
        </mesh>
      ))}

      {/* Windows with warm interior glow */}
      {([-1.6, 0, 1.6] as number[]).map((wx, i) => (
        <mesh key={i} position={[wx, 1.18, 1.61]}>
          <planeGeometry args={[0.70, 0.80]} />
          <meshStandardMaterial
            color="#ffecc0"
            emissive="#ffcf80"
            emissiveIntensity={0.95}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Front door */}
      <mesh position={[0, 0.72, 1.62]}>
        <planeGeometry args={[0.60, 1.44]} />
        <meshStandardMaterial color="#7a5030" flatShading roughness={0.95} />
      </mesh>

      {/* Door frame */}
      <mesh castShadow position={[0, 0.72, 1.63]}>
        <boxGeometry args={[0.70, 1.54, 0.06]} />
        <meshStandardMaterial color="#9a6840" flatShading roughness={0.92} />
      </mesh>

      {/* Steps */}
      <mesh receiveShadow castShadow position={[0, 0.10, 2.0]}>
        <boxGeometry args={[1.4, 0.20, 0.50]} />
        <meshStandardMaterial color="#b89a70" flatShading roughness={0.92} />
      </mesh>
    </group>
  );
}

// ─── Small secondary house ───────────────────────────────────────────────────
function SmallHouse({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh receiveShadow castShadow position={[0, 0.80, 0]}>
        <boxGeometry args={[3.2, 1.60, 2.4]} />
        <meshStandardMaterial color="#ddd0aa" flatShading roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, 1.72, 0]}>
        <boxGeometry args={[4.2, 0.28, 3.4]} />
        <meshStandardMaterial color="#b84832" flatShading roughness={0.90} />
      </mesh>
      <mesh castShadow position={[0, 1.90, 0]}>
        <boxGeometry args={[4.3, 0.14, 0.24]} />
        <meshStandardMaterial color="#8c3028" flatShading roughness={0.90} />
      </mesh>
      {/* windows */}
      {([-0.9, 0.9] as number[]).map((wx, i) => (
        <mesh key={i} position={[wx, 0.88, 1.21]}>
          <planeGeometry args={[0.55, 0.60]} />
          <meshStandardMaterial color="#ffecc0" emissive="#ffcf80" emissiveIntensity={0.80} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Temple gopuram ──────────────────────────────────────────────────────────
function Gopuram({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Base platform */}
      <mesh receiveShadow castShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[3.2, 0.36, 3.2]} />
        <meshStandardMaterial color="#d8c898" flatShading roughness={0.85} />
      </mesh>
      {/* Tier 1 */}
      <mesh receiveShadow castShadow position={[0, 1.36, 0]}>
        <boxGeometry args={[2.8, 2.0, 2.8]} />
        <meshStandardMaterial color="#e0ce9a" flatShading roughness={0.85} />
      </mesh>
      {/* Tier 2 */}
      <mesh castShadow position={[0, 3.06, 0]}>
        <boxGeometry args={[2.1, 1.40, 2.1]} />
        <meshStandardMaterial color="#d4c28c" flatShading roughness={0.82} />
      </mesh>
      {/* Tier 3 */}
      <mesh castShadow position={[0, 4.22, 0]}>
        <boxGeometry args={[1.5, 1.04, 1.5]} />
        <meshStandardMaterial color="#cab87e" flatShading roughness={0.80} />
      </mesh>
      {/* Golden top */}
      <mesh castShadow position={[0, 5.08, 0]}>
        <boxGeometry args={[0.9, 0.72, 0.9]} />
        <meshStandardMaterial color="#c89428" metalness={0.45} roughness={0.55} />
      </mesh>
      {/* Finial */}
      <mesh castShadow position={[0, 5.62, 0]}>
        <sphereGeometry args={[0.25, 8, 6]} />
        <meshStandardMaterial color="#d4a020" metalness={0.55} roughness={0.40} emissive="#a07010" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// ─── Village pond ─────────────────────────────────────────────────────────────
function Pond({ x, z }: { x: number; z: number }) {
  const pads = useMemo(() => {
    const rand = mulberry32(88);
    return Array.from({ length: 9 }, () => ({
      px: x + (rand() - 0.5) * 5.0,
      pz: z + (rand() - 0.5) * 3.2,
      r: 0.18 + rand() * 0.14,
    }));
  }, [x, z]);
  return (
    <group>
      {/* Muddy bank */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.006, z]}>
        <planeGeometry args={[9.0, 6.0]} />
        <meshStandardMaterial color="#4a6830" roughness={1} flatShading />
      </mesh>
      {/* Water surface — slightly reflective blue-green */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.030, z]}>
        <planeGeometry args={[7.8, 5.0]} />
        <meshStandardMaterial color="#2a7a8c" roughness={0.06} metalness={0.50} />
      </mesh>
      {/* Lily pads */}
      {pads.map((p, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[p.px, 0.046, p.pz]}>
          <circleGeometry args={[p.r, 7]} />
          <meshStandardMaterial color="#3a8030" roughness={0.90} flatShading />
        </mesh>
      ))}
      {/* Water-edge reeds (thin dark sticks) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} castShadow position={[x - 3.0 + i * 1.5, 0.30, z + 2.2 + (i % 2) * 0.4]}>
          <cylinderGeometry args={[0.03, 0.04, 0.60, 4]} />
          <meshStandardMaterial color="#4a6020" flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Paddy / rice field ───────────────────────────────────────────────────────
function PaddyField({ x, z, w, d }: { x: number; z: number; w: number; d: number }) {
  return (
    <group>
      {/* Flooded water base */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.008, z]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#3a6840" roughness={0.10} metalness={0.30} />
      </mesh>
      {/* Rice plant rows (thin green strips) */}
      {Array.from({ length: Math.floor(d / 0.55) }, (_, i) => (
        <mesh key={i} receiveShadow rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.022, z - d / 2 + 0.28 + i * 0.55]}>
          <planeGeometry args={[w - 0.4, 0.18]} />
          <meshStandardMaterial color="#68b040" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// ─── Village well ─────────────────────────────────────────────────────────────
function Well({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.38, 0.44, 0.68, 9]} />
        <meshStandardMaterial color="#b8986a" flatShading roughness={0.92} />
      </mesh>
      {([-0.40, 0.40] as number[]).map((px, i) => (
        <mesh key={i} castShadow position={[px, 0.80, 0]}>
          <boxGeometry args={[0.08, 0.90, 0.08]} />
          <meshStandardMaterial color="#7a5030" flatShading roughness={0.95} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.08, 0]}>
        <coneGeometry args={[0.58, 0.44, 4]} />
        <meshStandardMaterial color="#9a4838" flatShading roughness={0.92} />
      </mesh>
    </group>
  );
}

// ─── Fence post row ───────────────────────────────────────────────────────────
function FenceLine({ startZ, endZ, side }: { startZ: number; endZ: number; side: 1 | -1 }) {
  const xPos = side * 1.85;
  const count = Math.round((endZ - startZ) / 1.4);
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const fz = startZ + (i / (count - 1)) * (endZ - startZ);
        return (
          <group key={i}>
            {/* post */}
            <mesh castShadow position={[xPos, 0.28, fz]}>
              <boxGeometry args={[0.08, 0.56, 0.08]} />
              <meshStandardMaterial color="#8a6040" flatShading roughness={0.95} />
            </mesh>
            {/* rail (connects to next post) */}
            {i < count - 1 && (
              <mesh castShadow position={[xPos, 0.34, fz + 0.7]}>
                <boxGeometry args={[0.06, 0.06, 1.40]} />
                <meshStandardMaterial color="#9a7050" flatShading roughness={0.95} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ─── Flower patch ─────────────────────────────────────────────────────────────
function FlowerPatch({ x, z, color, emissive }: { x: number; z: number; color: string; emissive: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.04, z]}>
      <planeGeometry args={[2.2, 1.6]} />
      <meshStandardMaterial color={color} roughness={1} flatShading emissive={emissive} emissiveIntensity={0.18} />
    </mesh>
  );
}

// ─── Main scene ───────────────────────────────────────────────────────────────
export default function ChildhoodScene() {
  return (
    <group>
      <Ground chapterId="childhood" z={Z} length={L} />
      <HospitalScene />

      {/* ── Trees — coconut avenue + background depth ── */}
      <Trees z={Z} length={L} count={32} seed={11} variant="coconut" roadWidth={2.6} />
      <Trees z={Z} length={L} count={12} seed={73} variant="round"   roadWidth={18} />

      {/* ── Banana trees ── */}
      <BananaTree x={-4.2} z={Z + L * 0.18} scale={0.90} />
      <BananaTree x={ 3.8} z={Z + L * 0.32} scale={1.00} />
      <BananaTree x={-3.6} z={Z + L * 0.58} scale={0.85} />
      <BananaTree x={ 4.4} z={Z + L * 0.72} scale={0.95} />

      {/* ── Kerala houses ── */}
      <KeralaHouse x={ 6.2} z={Z + L * 0.42} />
      <SmallHouse  x={-5.5} z={Z + L * 0.24} />
      <SmallHouse  x={-4.8} z={Z + L * 0.78} />

      {/* ── Temple gopuram (far left) ── */}
      <Gopuram x={-9.5} z={Z + L * 0.70} />

      {/* ── Paddy / rice fields ── */}
      <PaddyField x={ 9.0} z={Z + L * 0.22} w={7.0} d={6.0} />
      <PaddyField x={ 8.5} z={Z + L * 0.55} w={6.0} d={5.0} />

      {/* ── Village pond (left side) ── */}
      <Pond x={-9.0} z={Z + L * 0.50} />

      {/* ── Village well ── */}
      <Well x={-4.0} z={Z + L * 0.65} />

      {/* ── Fence lines on both road edges ── */}
      <FenceLine startZ={Z + L * 0.04} endZ={Z + L * 0.95} side={ 1} />
      <FenceLine startZ={Z + L * 0.04} endZ={Z + L * 0.95} side={-1} />

      {/* ── Flower patches ── */}
      <FlowerPatch x={-3.8} z={Z + L * 0.10} color="#f5d020" emissive="#c8a808" />
      <FlowerPatch x={ 4.2} z={Z + L * 0.28} color="#ff7a50" emissive="#c84020" />
      <FlowerPatch x={-4.6} z={Z + L * 0.46} color="#f0e040" emissive="#b8a820" />
      <FlowerPatch x={ 3.8} z={Z + L * 0.62} color="#ff5080" emissive="#c02040" />
      <FlowerPatch x={-3.5} z={Z + L * 0.84} color="#e040a0" emissive="#a02070" />

      {/* ── Haystacks ── */}
      {([[5.2, Z + L * 0.18] as [number, number], [-6.5, Z + L * 0.68] as [number, number]]).map(([hx, hz], i) => (
        <mesh key={i} castShadow position={[hx, 0.26, hz]}>
          <cylinderGeometry args={[0.40, 0.48, 0.52, 7]} />
          <meshStandardMaterial color="#c8a040" flatShading roughness={1} />
        </mesh>
      ))}

      {/* ══ Atmosphere ══════════════════════════════════════════════════════ */}

      {/* Golden fireflies — spread across whole village */}
      <GlowParticles
        position={[0, 1.8, Z + L * 0.50]}
        count={70}
        color="#ffe880"
        scale={[16, 5, L]}
        size={0.90}
        speed={0.10}
      />

      {/* Warm temple glow particles */}
      <GlowParticles
        position={[-9.5, 3.0, Z + L * 0.70]}
        count={20}
        color="#ffd060"
        scale={[5, 6, 6]}
        size={0.75}
        speed={0.08}
      />

      {/* Pond shimmer / mist */}
      <GlowParticles
        position={[-9.0, 0.6, Z + L * 0.50]}
        count={18}
        color="#80d8f0"
        scale={[7.5, 1.5, 5.0]}
        size={0.55}
        speed={0.05}
      />

      {/* Paddy field nature sparkle */}
      <GlowParticles
        position={[9.0, 1.2, Z + L * 0.38]}
        count={25}
        color="#a0e060"
        scale={[7, 2.5, L * 0.38]}
        size={0.50}
        speed={0.07}
      />

      {/* House window glow halos */}
      <GlowParticles
        position={[6.2, 1.2, Z + L * 0.42]}
        count={8}
        color="#ffcf80"
        scale={[3, 2, 3]}
        size={0.60}
        speed={0.04}
      />
    </group>
  );
}
