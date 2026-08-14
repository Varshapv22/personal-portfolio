import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import TechTotem from "../components/environment/blocks/TechTotem";
import DataStream from "../components/environment/blocks/DataStream";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "payment")!;

const STEPS = ["Customer", "Checkout", "Payment Gateway", "Verification", "Transaction", "Laravel", "Database", "Payout"];

export default function PaymentScene() {
  const points: [number, number, number][] = STEPS.map((_, i) => [
    Math.sin(i * 0.7) * 1.2,
    1.2 + Math.abs(Math.cos(i * 0.5)) * 0.3,
    range.startZ + range.length * ((i + 0.5) / STEPS.length),
  ]);
  return (
    <group>
      <Ground chapterId="payment" z={range.startZ} length={range.length} />
      {STEPS.map((s, i) => (
        <TechTotem key={s} position={points[i]} label={s} color="#7ef7c4" height={0.9} radius={0.18} floatSpeed={0.7} />
      ))}
      <DataStream points={points} color="#7ef7c4" pulseCount={12} speed={0.55} />
      {/* security shields */}
      {[0.25, 0.55, 0.85].map((f, i) => (
        <mesh key={i} position={[0, 2.4, range.startZ + range.length * f]}>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial color="#7ef7c4" emissive="#7ef7c4" emissiveIntensity={1} toneMapped={false} />
        </mesh>
      ))}
      <GlowParticles position={[0, 1.6, range.startZ + range.length / 2]} count={60} color="#7ef7c4" scale={[6, 4, range.length]} speed={0.2} />
    </group>
  );
}
