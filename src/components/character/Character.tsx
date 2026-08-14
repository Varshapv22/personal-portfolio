import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { journeyCurve } from "../../utils/path";
import { journeyProgress, useJourneyStore } from "../../state/journeyStore";
import { chapters, chapterIndexAt, localProgressAt, HOSPITAL_HOLD } from "../../data/chapters";
import { outfits } from "./outfits";
import { recolorShirtPixels } from "./recolorTexture";

const UP = new THREE.Vector3(0, 1, 0);
const BODY_URL = "/models/character-body.glb";
// Xbot's own skeleton+mesh (not just bare clips) — SkeletonUtils.retargetClip
// needs the source skeleton to compute per-bone rest-pose deltas. Xbot's rig
// shares Mixamo bone *names* with the body mesh but not the same rest-pose
// orientation, so naively applying its clips to the body's skeleton produces
// a badly twisted pose; retargeting corrects for that. Its own mesh/materials
// are never added to the scene — only `.animations` and the skeleton matter.
const ANIMS_SRC_URL = "/models/character-anims-src.glb";

useGLTF.preload(BODY_URL);
useGLTF.preload(ANIMS_SRC_URL);

function findSkinnedMesh(obj: THREE.Object3D): THREE.SkinnedMesh | undefined {
  let found: THREE.SkinnedMesh | undefined;
  obj.traverse((o) => {
    if (!found && (o as THREE.SkinnedMesh).isSkinnedMesh) found = o as THREE.SkinnedMesh;
  });
  return found;
}

// Bones the rig hangs accessories from — standard Mixamo joint names, present
// on both the body mesh and the retargeted animation source.
const SPINE_BONE = "mixamorig:Spine2";
const HAND_BONE = "mixamorig:LeftHand";

export default function Character() {
  const root = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const backpackRef = useRef<THREE.Mesh>(null);
  const satchelRef = useRef<THREE.Mesh>(null);
  const laptopBagRef = useRef<THREE.Mesh>(null);

  const { scene: bodyScene } = useGLTF(BODY_URL);
  const { scene: animsSrcScene, animations: animsSrcClips } = useGLTF(ANIMS_SRC_URL);

  // useGLTF caches the source scene by URL — clone it (skeleton-aware) so this
  // component owns its own bones/mesh instance instead of mutating the cache.
  const clonedScene = useMemo(() => SkeletonUtils.clone(bodyScene) as THREE.Group, [bodyScene]);

  // Retarget each Xbot clip onto the body's own skeleton once — see the note
  // on ANIMS_SRC_URL above for why this can't just be `mixer.clipAction(clip)`.
  // retargetClip's output tracks address bones via ".bones[name]" paths, which
  // three.js can only resolve against a root that itself has `.skeleton` — so
  // the mixer must be bound to the SkinnedMesh directly, not the outer rig group.
  const { clips: retargetedClips, targetMesh } = useMemo(() => {
    const target = findSkinnedMesh(clonedScene);
    const source = findSkinnedMesh(animsSrcScene);
    if (!target || !source) return { clips: [], targetMesh: undefined };
    const clips = animsSrcClips.map((clip) =>
      SkeletonUtils.retargetClip(target, source, clip, { hip: "mixamorig:Hips" })
    );
    return { clips, targetMesh: target };
  }, [clonedScene, animsSrcScene, animsSrcClips]);

  const { actions } = useAnimations(retargetedClips, targetMesh);

  const chapterIndex = useJourneyStore((s) => s.chapterIndex);
  const started = useJourneyStore((s) => s.started);
  const outfitId = chapters[chapterIndex]?.outfit ?? "engineer";
  const outfit = outfits[outfitId];

  const prevT = useRef(0);
  const moveBlend = useRef(0);
  const facing = useRef(new THREE.Quaternion());
  const tmpPoint = useMemo(() => new THREE.Vector3(), []);
  const tmpTangent = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);
  const tmpMatrix = useMemo(() => new THREE.Matrix4(), []);

  // Start idle + walk both playing, permanently — every frame just re-weights
  // them (see useFrame below), which is how three.js's own skinning-blending
  // example crossfades gait state without popping.
  useEffect(() => {
    const idle = actions.idle;
    const walk = actions.walk;
    idle?.reset().setEffectiveWeight(1).play();
    walk?.reset().setEffectiveWeight(0).play();
    return () => {
      idle?.stop();
      walk?.stop();
    };
  }, [actions]);

  // Recolor the body texture's baked-in yellow shirt to dusty-rose once, in
  // place — see recolorTexture.ts for why this can't be a material prop.
  useEffect(() => {
    const mesh = findSkinnedMesh(clonedScene);
    const material = mesh?.material as THREE.MeshStandardMaterial | undefined;
    const tex = material?.map;
    const image = tex?.image as (HTMLImageElement | ImageBitmap | undefined);
    if (!tex || !image || !image.width || !image.height) return;
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    recolorShirtPixels(imageData.data);
    ctx.putImageData(imageData, 0, 0);
    tex.image = canvas;
    tex.needsUpdate = true;
  }, [clonedScene]);

  // Attach the accessory props to real bones once, so they inherit the
  // skeleton's own arm/back sway instead of sitting rigidly on the root.
  useEffect(() => {
    const spine = clonedScene.getObjectByName(SPINE_BONE);
    const hand = clonedScene.getObjectByName(HAND_BONE);
    if (spine && backpackRef.current) spine.add(backpackRef.current);
    if (spine && satchelRef.current) spine.add(satchelRef.current);
    if (hand && laptopBagRef.current) hand.add(laptopBagRef.current);
    return () => {
      backpackRef.current?.removeFromParent();
      satchelRef.current?.removeFromParent();
      laptopBagRef.current?.removeFromParent();
    };
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!root.current) return;
    const t = journeyProgress.value;
    const speed = Math.abs(t - prevT.current);
    prevT.current = t;

    journeyCurve.getPointAt(t, tmpPoint);
    journeyCurve.getTangentAt(t, tmpTangent);
    root.current.position.copy(tmpPoint);

    if (tmpTangent.lengthSq() > 0.0001) {
      tmpLook.copy(root.current.position).add(tmpTangent);
      tmpMatrix.lookAt(root.current.position, tmpLook, UP);
      facing.current.setFromRotationMatrix(tmpMatrix);
      root.current.quaternion.slerp(facing.current, Math.min(1, delta * 4));
    }

    const moving = started && speed > 0.00003;
    moveBlend.current = THREE.MathUtils.damp(moveBlend.current, moving ? 1 : 0, 6, delta);

    const idle = actions.idle;
    const walk = actions.walk;
    idle?.setEffectiveWeight(1 - moveBlend.current);
    walk?.setEffectiveWeight(moveBlend.current);

    const idx = chapterIndexAt(t);
    const local = localProgressAt(t, idx);
    const inHospitalHold = chapters[idx].id === "childhood" && local < HOSPITAL_HOLD;
    if (rig.current) rig.current.visible = !inHospitalHold;
  });

  return (
    <group ref={root}>
      <group ref={rig} scale={outfit.scale}>
        <primitive object={clonedScene} rotation={[0, Math.PI, 0]} />

        <mesh ref={backpackRef} visible={outfit.accessory === "backpack"} castShadow position={[0, 0.02, 0.06]}>
          <boxGeometry args={[0.09, 0.11, 0.05]} />
          <meshStandardMaterial color={outfit.accentColor} roughness={0.75} />
        </mesh>
        <mesh ref={satchelRef} visible={outfit.accessory === "satchel"} castShadow position={[0.05, -0.02, 0.04]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.06, 0.07, 0.03]} />
          <meshStandardMaterial color={outfit.accentColor} roughness={0.75} />
        </mesh>
        <mesh ref={laptopBagRef} visible={outfit.accessory === "laptop-bag"} castShadow position={[0, -0.10, 0.01]}>
          <boxGeometry args={[0.02, 0.10, 0.07]} />
          <meshStandardMaterial color={outfit.accentColor} roughness={0.55} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
