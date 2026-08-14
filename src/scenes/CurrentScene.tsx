import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import Buildings from "../components/environment/blocks/Buildings";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "current")!;

export default function CurrentScene() {
  return (
    <group>
      <Ground chapterId="current" z={range.startZ} length={range.length} />
      <Buildings z={range.startZ} length={range.length} count={4} seed={91} palette={["#eef1f5", "#dfe4ea"]} minH={3} maxH={5} roadWidth={4.4} roofed={false} />
      <GlowParticles position={[0, 3, range.startZ + range.length / 2]} count={40} color="#ffffff" scale={[8, 4, range.length]} speed={0.15} />
    </group>
  );
}
