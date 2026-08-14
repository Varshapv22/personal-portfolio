import { useMemo } from "react";
import * as THREE from "three";
import { chapters } from "../../../data/chapters";
import { terrainColors } from "../../../data/terrain";

interface GroundProps {
  chapterId: string;
  z: number;
  length: number;
}

const LENGTH_SEGMENTS = 24;
const BLEND_FRACTION = 0.18;

function neighborColor(chapterId: string, dir: -1 | 1, pick: "ground" | "road"): string {
  const idx = chapters.findIndex((c) => c.id === chapterId);
  const neighbor = chapters[idx + dir];
  return neighbor ? terrainColors[neighbor.id][pick] : terrainColors[chapterId][pick];
}

// A plane subdivided along its length with per-vertex colors that fade from the
// previous chapter's tone, through this chapter's own tone, into the next
// chapter's tone — so no chapter boundary is ever a hard, unfogged color seam.
function buildBlendedPlaneGeometry(planeWidth: number, planeLength: number, own: string, prev: string, next: string) {
  const geo = new THREE.PlaneGeometry(planeWidth, planeLength, 1, LENGTH_SEGMENTS);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cOwn = new THREE.Color(own);
  const cPrev = new THREE.Color(prev);
  const cNext = new THREE.Color(next);
  const tmp = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const localY = pos.getY(i);
    const frac = (localY + planeLength / 2) / planeLength; // 0 = start (prev side), 1 = end (next side)
    if (frac < BLEND_FRACTION) {
      tmp.copy(cPrev).lerp(cOwn, frac / BLEND_FRACTION);
    } else if (frac > 1 - BLEND_FRACTION) {
      tmp.copy(cOwn).lerp(cNext, (frac - (1 - BLEND_FRACTION)) / BLEND_FRACTION);
    } else {
      tmp.copy(cOwn);
    }
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

export default function Ground({ chapterId, z, length }: GroundProps) {
  const { road, ground, width } = terrainColors[chapterId];
  const centerZ = z + length / 2;
  const planeLength = length + 4;

  const groundGeo = useMemo(
    () => buildBlendedPlaneGeometry(60, planeLength, ground, neighborColor(chapterId, -1, "ground"), neighborColor(chapterId, 1, "ground")),
    [chapterId, ground, planeLength]
  );
  const roadGeo = useMemo(
    () => buildBlendedPlaneGeometry(width, length + 2, road, neighborColor(chapterId, -1, "road"), neighborColor(chapterId, 1, "road")),
    [chapterId, road, width, length]
  );

  return (
    <group>
      {/* A ground plane this large, viewed mostly at grazing angles, is the
          worst case for shadow-map texel aliasing — it doesn't receive
          shadows, trading a faint contact shadow for guaranteed clean shading. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, centerZ]} geometry={groundGeo}>
        <meshStandardMaterial vertexColors roughness={1} flatShading />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, centerZ]} geometry={roadGeo}>
        <meshStandardMaterial vertexColors roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}
