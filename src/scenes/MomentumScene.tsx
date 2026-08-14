import { Text, Billboard } from "@react-three/drei";
import { chapterWorldRanges } from "../utils/path";
import Ground from "../components/environment/blocks/Ground";
import DataStream from "../components/environment/blocks/DataStream";
import ServerRack from "../components/environment/blocks/ServerRack";
import GlowParticles from "../components/environment/blocks/GlowParticles";

const range = chapterWorldRanges.find((r) => r.id === "momentum")!;
const WORDS = [
  { w: "BUILD", color: "#4fd1ff" },
  { w: "INTEGRATE", color: "#7ef7c4" },
  { w: "OPTIMIZE", color: "#ffe27e" },
  { w: "DEBUG", color: "#ff8a8a" },
  { w: "DEPLOY", color: "#c39bff" },
];

export default function MomentumScene() {
  return (
    <group>
      <Ground chapterId="momentum" z={range.startZ} length={range.length} />
      {WORDS.map((item, i) => {
        const z = range.startZ + range.length * ((i + 0.5) / WORDS.length);
        const side = i % 2 === 0 ? -1 : 1;
        return (
          <Billboard key={item.w} position={[side * 1.8, 1.4, z]}>
            <Text fontSize={0.34} color={item.color} anchorX="center" letterSpacing={0.08}>
              {item.w}
            </Text>
          </Billboard>
        );
      })}
      <ServerRack position={[2.6, 0, range.startZ + range.length * 0.3]} color="#3fe0ff" />
      <ServerRack position={[-2.6, 0, range.startZ + range.length * 0.6]} color="#7ef7c4" />
      <DataStream
        points={[
          [0, 0.6, range.startZ + range.length * 0.1],
          [1, 0.6, range.startZ + range.length * 0.5],
          [-1, 0.6, range.startZ + range.length * 0.9],
        ]}
        color="#4fd1ff"
        speed={0.6}
      />
      <GlowParticles position={[0, 2, range.startZ + range.length / 2]} count={70} color="#4fd1ff" scale={[7, 4, range.length]} speed={0.4} />
    </group>
  );
}
