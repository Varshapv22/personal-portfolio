// Per-chapter ground/road palette. Kept separate from `chapters.ts` theme
// (sky/fog/lighting) because terrain needs its own smooth cross-fade at
// chapter boundaries — see Ground.tsx, which blends each plane into its
// neighbors' `ground` color so the seam between drastically different
// chapters (e.g. a dark "digital" scene next to a bright office) never
// shows as a hard, unfogged edge.
export interface TerrainSpec {
  road: string;
  ground: string;
  width: number;
}

export const terrainColors: Record<string, TerrainSpec> = {
  childhood: { road: "#c2a868", ground: "#4a7c2a", width: 2.6 },
  school: { road: "#c4b48c", ground: "#4e8040", width: 3.2 },
  college: { road: "#c7c2b6", ground: "#4a7a4a", width: 3.6 },
  "first-code": { road: "#0e1424", ground: "#070a14", width: 4.2 },
  certifications: { road: "#0e1424", ground: "#070a14", width: 4 },
  btrac: { road: "#cfd3da", ground: "#8a9098", width: 4.2 },
  momentum: { road: "#0e1424", ground: "#070a14", width: 4.4 },
  ioss: { road: "#d5d9e0", ground: "#9096a2", width: 4.6 },
  skills: { road: "#0e1424", ground: "#070a14", width: 4.4 },
  projects: { road: "#1a1420", ground: "#0c0810", width: 5 },
  database: { road: "#050810", ground: "#02040a", width: 4.2 },
  api: { road: "#050810", ground: "#02040a", width: 4.2 },
  payment: { road: "#050c0a", ground: "#020604", width: 4 },
  ai: { road: "#0e1424", ground: "#070a14", width: 4 },
  engineering: { road: "#d8dce2", ground: "#aab0ba", width: 4 },
  current: { road: "#d5d9e0", ground: "#9096a2", width: 4.4 },
  future: { road: "#241a30", ground: "#150e22", width: 3.6 },
  contact: { road: "#1c2036", ground: "#0b0f1a", width: 3.4 },
};
