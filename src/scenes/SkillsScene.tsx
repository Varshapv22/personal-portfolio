import { Text, Billboard } from "@react-three/drei";
import { chapterWorldRanges } from "../utils/path";
import { skillCategories } from "../data/skills";
import Ground from "../components/environment/blocks/Ground";
import TechTotem from "../components/environment/blocks/TechTotem";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "skills")!;

export default function SkillsScene() {
  return (
    <group>
      <Ground chapterId="skills" z={range.startZ} length={range.length} />
      {skillCategories.map((cat, ci) => {
        const clusterZ = range.startZ + range.length * ((ci + 0.5) / skillCategories.length);
        const side = ci % 2 === 0 ? -1 : 1;
        const baseX = side * 2.3;
        return (
          <group key={cat.id}>
            <Billboard position={[baseX, 2.6, clusterZ]}>
              <Text fontSize={0.2} color={cat.accent} anchorX="center" letterSpacing={0.04}>
                {cat.title.toUpperCase()}
              </Text>
            </Billboard>
            {cat.items.map((item, ii) => {
              const angle = (ii / cat.items.length) * Math.PI * 2;
              const r = 1.1;
              const x = baseX + Math.cos(angle) * r;
              const z = clusterZ + Math.sin(angle) * r * 0.6;
              return <TechTotem key={item} position={[x, 1.2 + (ii % 2) * 0.3, z]} label={item} color={cat.accent} height={0.9} radius={0.16} floatSpeed={0.6 + ii * 0.15} />;
            })}
          </group>
        );
      })}
      <GlowParticles position={[0, 2.5, range.startZ + range.length / 2]} count={90} color="#4fd1ff" scale={[9, 5, range.length]} speed={0.3} />
    </group>
  );
}
