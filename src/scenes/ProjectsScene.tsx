import { chapterWorldRanges } from "../utils/path";
import { projects } from "../data/projects";
import Ground from "../components/environment/blocks/Ground";
import PortalGate from "../components/environment/blocks/PortalGate";
import DataStream from "../components/environment/blocks/DataStream";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "projects")!;

export default function ProjectsScene() {
  return (
    <group>
      <Ground chapterId="projects" z={range.startZ} length={range.length} />
      {projects.map((p, i) => {
        const z = range.startZ + range.length * ((i + 0.5) / projects.length);
        const side = i % 2 === 0 ? -1 : 1;
        const x = side * (2.4 + (i % 3) * 0.5);
        const rotY = side > 0 ? -0.5 : 0.5;
        const flowPts: [number, number, number][] = p.flow.map((_, fi) => [
          x + side * (0.4 + fi * 0.32),
          1.1 + (fi % 2) * 0.25,
          z + fi * 0.3 - p.flow.length * 0.15,
        ]);
        return (
          <group key={p.id}>
            <PortalGate position={[x, 1.4, z]} rotationY={rotY} name={p.name} stack={p.stack} color={p.accent} id={p.id} />
            <DataStream points={flowPts} color={p.accent} speed={0.4} />
          </group>
        );
      })}
      <GlowParticles position={[0, 2.4, range.startZ + range.length / 2]} count={80} color="#ff8a3c" scale={[10, 5, range.length]} speed={0.3} />
    </group>
  );
}
