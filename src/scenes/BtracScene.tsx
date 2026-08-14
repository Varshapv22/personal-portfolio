import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import Buildings from "../components/environment/blocks/Buildings";
import DataStream from "../components/environment/blocks/DataStream";
import TechTotem from "../components/environment/blocks/TechTotem";
import DeskSetup, { Whiteboard } from "../components/environment/blocks/DeskSetup";

const range = chapterWorldRanges.find((r) => r.id === "btrac")!;

export default function BtracScene() {
  const officeZ = range.startZ + range.length * 0.4;
  const flowZ = range.startZ + range.length * 0.75;
  const trainingZ = range.startZ + range.length * 0.15;
  return (
    <group>
      <Ground chapterId="btrac" z={range.startZ} length={range.length} />
      <Buildings z={range.startZ} length={range.length * 0.5} count={2} seed={41} palette={["#eef1f5"]} minH={3} maxH={4.2} roadWidth={4.2} roofed={false} />

      <group position={[-2.4, 0, officeZ]}>
        <mesh castShadow receiveShadow position={[0, 1.6, 0]}>
          <boxGeometry args={[2.6, 3.2, 2.4]} />
          <meshStandardMaterial color="#eef1f5" flatShading roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.6, 1.21]}>
          <planeGeometry args={[2.2, 2.6]} />
          <meshStandardMaterial color="#0b1220" emissive="#5b6cff" emissiveIntensity={0.25} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Training room — the "first professional experience" beat: a trainer's
          whiteboard flanked by trainee workstations, right where the character
          walks past early in the chapter. */}
      <Whiteboard position={[-2.6, 1.1, trainingZ]} rotation={Math.PI / 2} />
      <DeskSetup position={[-1.6, 0, trainingZ - 0.7]} rotation={0.3} accent="#5b6cff" />
      <DeskSetup position={[-1.5, 0, trainingZ + 0.7]} rotation={-0.3} accent="#7ef7c4" />

      <TechTotem position={[0.4, 1.1, flowZ - 1]} label="MySQL Query" color="#ffb37e" height={1} />
      <TechTotem position={[1.6, 1.3, flowZ]} label="REST API" color="#4fd1ff" height={1.1} floatSpeed={0.9} />
      <TechTotem position={[0.6, 1.5, flowZ + 1]} label="Web App" color="#7ef7c4" height={1.2} floatSpeed={0.7} />
      <TechTotem position={[1.8, 1.7, flowZ + 2]} label="WooCommerce" color="#c39bff" height={1.3} floatSpeed={1.1} />

      <DataStream
        points={[
          [0.4, 1.1, flowZ - 1],
          [1.6, 1.3, flowZ],
          [0.6, 1.5, flowZ + 1],
          [1.8, 1.7, flowZ + 2],
        ]}
        color="#5b6cff"
      />
    </group>
  );
}
