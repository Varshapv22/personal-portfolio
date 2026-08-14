import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import TechTotem from "../components/environment/blocks/TechTotem";
import DataStream from "../components/environment/blocks/DataStream";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "api")!;

const LAYERS = [
  { label: "Client", color: "#7ef7c4" },
  { label: "REST API", color: "#4fd1ff" },
  { label: "Laravel", color: "#ff6b57" },
  { label: "Business Logic", color: "#ffe27e" },
  { label: "MySQL", color: "#ffb37e" },
  { label: "External Services", color: "#c39bff" },
];

export default function ApiScene() {
  const midZ = range.startZ + range.length * 0.5;
  const points: [number, number, number][] = LAYERS.map((_, i) => [
    Math.sin(i * 0.9) * 1.4,
    2.6 - i * 0.42,
    midZ - 1.6 + i * 0.7,
  ]);
  return (
    <group>
      <Ground chapterId="api" z={range.startZ} length={range.length} />
      {LAYERS.map((l, i) => (
        <TechTotem key={l.label} position={points[i]} label={l.label} color={l.color} height={1} floatSpeed={0.6 + i * 0.1} />
      ))}
      <DataStream points={points} color="#4fd1ff" pulseCount={10} speed={0.5} />
      <GlowParticles position={[0, 2, midZ]} count={80} color="#4fd1ff" scale={[7, 6, range.length]} speed={0.25} />
    </group>
  );
}
