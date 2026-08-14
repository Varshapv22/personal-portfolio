import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "contact")!;

export default function ContactScene() {
  return (
    <group>
      <Ground chapterId="contact" z={range.startZ} length={range.length} />
      <GlowParticles position={[0, 2.5, range.startZ + range.length / 2]} count={100} color="#c8d4ff" scale={[10, 6, range.length]} speed={0.15} />
    </group>
  );
}
