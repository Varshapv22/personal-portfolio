import type { OutfitId } from "../../data/chapters";

export interface OutfitDef {
  /** Uniform scale applied to the whole rigged body — the growth cue between life stages. */
  scale: number;
  accessory: "none" | "backpack" | "satchel" | "laptop-bag";
  /** Tint for the accessory prop only — the body mesh uses one baked material, so
   *  per-chapter identity comes from scale + accessory + this accent, not a cloth recolor. */
  accentColor: string;
}

export const outfits: Record<OutfitId, OutfitDef> = {
  child:             { scale: 0.62, accessory: "none",       accentColor: "#e84878" },
  "student-school":  { scale: 0.78, accessory: "satchel",    accentColor: "#3a547a" },
  "student-college": { scale: 0.92, accessory: "backpack",   accentColor: "#6a4fd8" },
  professional:      { scale: 1.00, accessory: "laptop-bag", accentColor: "#3a4a8c" },
  engineer:          { scale: 1.00, accessory: "laptop-bag", accentColor: "#2c3c7c" },
};
