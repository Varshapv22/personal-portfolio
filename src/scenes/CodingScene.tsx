import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import TechTotem from "../components/environment/blocks/TechTotem";
import DataStream from "../components/environment/blocks/DataStream";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "first-code")!;

const TECHS = [
  { label: "PHP", color: "#8892be", x: -2.4 },
  { label: "Laravel", color: "#ff6b57", x: -1.1 },
  { label: "MySQL", color: "#ffb37e", x: 0.2 },
  { label: "JavaScript", color: "#ffe27e", x: 1.4 },
  { label: "HTML", color: "#ff8a5c", x: 2.4 },
  { label: "CSS", color: "#5c9bff", x: -2.9 },
  { label: "Git", color: "#f1502f", x: 3.2 },
];

export default function CodingScene() {
  return (
    <group>
      <Ground chapterId="first-code" z={range.startZ} length={range.length} />
      {TECHS.map((t, i) => {
        const z = range.startZ + range.length * ((i + 1) / (TECHS.length + 1));
        return <TechTotem key={t.label} position={[t.x, 1.5 + (i % 3) * 0.2, z]} label={t.label} color={t.color} floatSpeed={0.6 + i * 0.1} />;
      })}

      {/* branching "git" paths */}
      <DataStream
        points={[
          [0, 0.3, range.startZ + range.length * 0.15],
          [1.6, 0.3, range.startZ + range.length * 0.4],
          [1.2, 0.3, range.startZ + range.length * 0.7],
        ]}
        color="#f1502f"
        speed={0.5}
      />
      <DataStream
        points={[
          [0, 0.3, range.startZ + range.length * 0.15],
          [-1.6, 0.3, range.startZ + range.length * 0.45],
          [-1, 0.3, range.startZ + range.length * 0.75],
        ]}
        color="#4fd1ff"
        speed={0.4}
      />

      <GlowParticles position={[0, 2, range.startZ + range.length / 2]} count={80} color="#4fd1ff" scale={[7, 5, range.length]} size={1.4} speed={0.3} />
    </group>
  );
}
