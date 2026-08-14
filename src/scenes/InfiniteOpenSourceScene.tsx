import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import Buildings from "../components/environment/blocks/Buildings";
import TechTotem from "../components/environment/blocks/TechTotem";
import DataStream from "../components/environment/blocks/DataStream";
import GlowParticles from "../components/environment/blocks/GlowParticles";
import DeskSetup from "../components/environment/blocks/DeskSetup";

const range = chapterWorldRanges.find((r) => r.id === "ioss")!;

const MVC = ["Controllers", "Services", "Models"];

export default function InfiniteOpenSourceScene() {
  const hubZ = range.startZ + range.length * 0.5;
  const deskZ = range.startZ + range.length * 0.18;
  return (
    <group>
      <Ground chapterId="ioss" z={range.startZ} length={range.length} />
      <Buildings z={range.startZ} length={range.length * 0.4} count={2} seed={71} palette={["#f2f4f8"]} minH={3.4} maxH={4.6} roadWidth={4.6} roofed={false} />

      {/* Modern dev workstation row — the "software office" beat before the
          Laravel/MVC data cluster further down the chapter. */}
      <DeskSetup position={[-2.2, 0, deskZ]} rotation={0.2} accent="#ff6b57" />
      <DeskSetup position={[-2.0, 0, deskZ + 0.9]} rotation={-0.15} accent="#4fd1ff" />
      <DeskSetup position={[2.2, 0, deskZ + 0.4]} rotation={-0.4} accent="#c39bff" />

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
