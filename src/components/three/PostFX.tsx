import { EffectComposer, Bloom, Vignette, N8AO } from "@react-three/postprocessing";
import { useJourneyStore } from "../../state/journeyStore";

// R3F's Canvas already applies ACESFilmicToneMapping at the renderer level by
// default, so this only adds what it doesn't: a soft bloom on the many
// emissive accents already in the scene (window glow, screens, particles)
// and a gentle vignette to focus the frame — the two biggest levers for
// "cinematic" over "game-ish" that don't require new geometry or textures.
// Gated by quality tier — full chain on high, a lighter one on medium, off
// entirely on low so it never costs a struggling device a frame.
export default function PostFX() {
  const quality = useJourneyStore((s) => s.quality);
  if (quality === "low") return null;

  return (
    <EffectComposer enableNormalPass={quality === "high"} multisampling={0}>
      {quality === "high" ? <N8AO aoRadius={1.4} intensity={2.2} distanceFalloff={1} /> : <></>}
      <Bloom mipmapBlur luminanceThreshold={0.55} luminanceSmoothing={0.2} intensity={quality === "high" ? 0.55 : 0.35} radius={0.6} />
      <Vignette eskil={false} offset={0.22} darkness={0.55} />
    </EffectComposer>
  );
}
