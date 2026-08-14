import { Sparkles } from "@react-three/drei";
import { useJourneyStore } from "../../../state/journeyStore";

interface GlowParticlesProps {
  position: [number, number, number];
  count?: number;
  color?: string;
  scale?: [number, number, number] | number;
  size?: number;
  speed?: number;
}

export default function GlowParticles({ position, count = 60, color = "#ffffff", scale = 6, size = 1.4, speed = 0.25 }: GlowParticlesProps) {
  const quality = useJourneyStore((s) => s.quality);
  const factor = quality === "high" ? 1 : quality === "medium" ? 0.55 : 0.25;
  const n = Math.max(4, Math.round(count * factor));
  return <Sparkles position={position} count={n} color={color} scale={scale} size={size} speed={speed} noise={1} />;
}
