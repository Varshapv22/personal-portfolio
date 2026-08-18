import * as THREE from "three";
import { chapters, chapterRanges } from "../data/chapters";

// World units per unit of chapter "weight". The whole journey is one continuous
// road; each chapter owns a contiguous stretch of it.
const UNIT = 46;

interface ChapterWorldRange {
  id: string;
  startZ: number;
  endZ: number;
  length: number;
}

export const chapterWorldRanges: ChapterWorldRange[] = (() => {
  let z = 0;
  return chapters.map((c) => {
    const length = c.weight * UNIT;
    const startZ = z;
    z += length;
    const endZ = z;
    return { id: c.id, startZ, endZ, length };
  });
})();

export const totalPathLength = chapterWorldRanges[chapterWorldRanges.length - 1]?.endZ ?? 1;

// Control points along X=0: character and camera both follow this straight line,
// matching the road and all scene objects which are also centered at X=0.
const controlPoints: THREE.Vector3[] = [];
chapterWorldRanges.forEach((r) => {
  const midZ = (r.startZ + r.endZ) / 2;
  controlPoints.push(new THREE.Vector3(0, 0, r.startZ));
  controlPoints.push(new THREE.Vector3(0, 0, midZ));
});
const last = chapterWorldRanges[chapterWorldRanges.length - 1];
controlPoints.push(new THREE.Vector3(0, 0, last.endZ));

export const journeyCurve = new THREE.CatmullRomCurve3(controlPoints, false, "catmullrom", 0.15);
// Pre-cache arc-length divisions so getPointAt() is evenly spaced in distance.
journeyCurve.arcLengthDivisions = Math.max(200, chapterWorldRanges.length * 40);

export function worldZToGlobalT(z: number): number {
  return Math.min(1, Math.max(0, z / totalPathLength));
}

export function chapterRangeFor(index: number) {
  return chapterWorldRanges[index] ?? chapterWorldRanges[0];
}

export function globalTForChapterLocal(index: number, local: number): number {
  const r = chapterRangeFor(index);
  const z = r.startZ + (r.endZ - r.startZ) * local;
  return worldZToGlobalT(z);
}

export { chapterRanges };
