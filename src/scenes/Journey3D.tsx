import { Suspense, useMemo } from "react";
import { chapters } from "../data/chapters";
import { sceneRegistry } from "./index";
import { useJourneyStore } from "../state/journeyStore";
import Character from "../components/character/Character";
import CameraRig from "../components/three/CameraRig";
import Lighting from "../components/three/Lighting";
import PostFX from "../components/three/PostFX";

const RENDER_WINDOW = 1;

export default function Journey3D() {
  const chapterIndex = useJourneyStore((s) => s.chapterIndex);

  const visible = useMemo(() => {
    return chapters
      .map((c, i) => ({ c, i }))
      .filter(({ i }) => Math.abs(i - chapterIndex) <= RENDER_WINDOW);
  }, [chapterIndex]);

  return (
    <>
      <Lighting />
      <CameraRig />
      <PostFX />
      <Suspense fallback={null}>
        {visible.map(({ c }) => {
          const Scene = sceneRegistry[c.id];
          return Scene ? <Scene key={c.id} /> : null;
        })}
        <Character />
      </Suspense>
    </>
  );
}
