import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { journeyCurve } from "../../utils/path";
import { journeyProgress, useJourneyStore } from "../../state/journeyStore";
import { chapters } from "../../data/chapters";
import { outfits } from "./outfits";
import { recolorShirtPixels } from "./recolorTexture";

const UP = new THREE.Vector3(0, 1, 0);
const BODY_URL = `${import.meta.env.BASE_URL}models/character-body.glb`;
const ANIMS_SRC_URL = `${import.meta.env.BASE_URL}models/character-anims-src.glb`;

useGLTF.preload(BODY_URL);
useGLTF.preload(ANIMS_SRC_URL);

function findSkinnedMesh(obj: THREE.Object3D): THREE.SkinnedMesh | undefined {
  let found: THREE.SkinnedMesh | undefined;
  obj.traverse((o) => {
    if (!found && (o as THREE.SkinnedMesh).isSkinnedMesh) found = o as THREE.SkinnedMesh;
  });
  return found;
}

const SPINE_BONE = "mixamorig:Spine2";
const HAND_BONE  = "mixamorig:LeftHand";

// The path is always straight (+Z direction). Pre-compute the quaternion so
// the character snaps to the correct facing on its very first frame, avoiding
// any partial-rotation artifact during the slerp warm-up.
const FORWARD_FACING = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(0, 1, 0),
  Math.PI
);

export default function Character() {
  const root        = useRef<THREE.Group>(null);
  const rig         = useRef<THREE.Group>(null);
  const backpackRef = useRef<THREE.Mesh>(null);
  const satchelRef  = useRef<THREE.Mesh>(null);
  const laptopBagRef = useRef<THREE.Mesh>(null);
  const facingSnapped = useRef(false);

  const { scene: bodyScene } = useGLTF(BODY_URL);
  const { scene: animsSrcScene, animations: animsSrcClips } = useGLTF(ANIMS_SRC_URL);

  const clonedScene = useMemo(() => SkeletonUtils.clone(bodyScene) as THREE.Group, [bodyScene]);

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
  const started      = useJourneyStore((s) => s.started);
  const outfitId = chapters[chapterIndex]?.outfit ?? "engineer";
  const outfit   = outfits[outfitId];

  const prevT      = useRef(0);
  const moveBlend  = useRef(0);
  const facing     = useRef(FORWARD_FACING.clone());
  const tmpPoint   = useMemo(() => new THREE.Vector3(), []);
  const tmpTangent = useMemo(() => new THREE.Vector3(), []);
  const tmpLook    = useMemo(() => new THREE.Vector3(), []);
  const tmpMatrix  = useMemo(() => new THREE.Matrix4(), []);

  useEffect(() => {
    const idle = actions.idle;
    const walk = actions.walk;
    idle?.reset().setEffectiveWeight(1).play();
    walk?.reset().setEffectiveWeight(0).play();
    return () => { idle?.stop(); walk?.stop(); };
  }, [actions]);

  useEffect(() => {
    const mesh = findSkinnedMesh(clonedScene);
    const material = mesh?.material as THREE.MeshStandardMaterial | undefined;
    const tex = material?.map;
    const image = tex?.image as (HTMLImageElement | ImageBitmap | undefined);
    if (!tex || !image || !image.width || !image.height) return;
    const canvas = document.createElement("canvas");
    canvas.width  = image.width;
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

  useEffect(() => {
    const spine = clonedScene.getObjectByName(SPINE_BONE);
    const hand  = clonedScene.getObjectByName(HAND_BONE);
    if (spine && backpackRef.current)  spine.add(backpackRef.current);
    if (spine && satchelRef.current)   spine.add(satchelRef.current);
    if (hand  && laptopBagRef.current) hand.add(laptopBagRef.current);
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

      if (!facingSnapped.current) {
        // Snap to the correct facing instantly on the first frame so the
        // character never shows a partially-rotated pose at startup.
        root.current.quaternion.copy(facing.current);
        facingSnapped.current = true;
      } else {
        root.current.quaternion.slerp(facing.current, Math.min(1, delta * 8));
      }
    }

    const moving = started && speed > 0.00003;
    moveBlend.current = THREE.MathUtils.damp(moveBlend.current, moving ? 1 : 0, 6, delta);

    actions.idle?.setEffectiveWeight(1 - moveBlend.current);
    actions.walk?.setEffectiveWeight(moveBlend.current);
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
