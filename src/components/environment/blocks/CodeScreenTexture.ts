import * as THREE from "three";

// Procedural "code editor" look for monitor screens — syntax-colored bars on
// a dark background, drawn once to a canvas and cached per accent color.
// Cheap alternative to a real texture asset, matches the codebase's existing
// pattern of canvas/procedural surfaces over imported images.
const cache = new Map<string, THREE.CanvasTexture>();

const LINE_COLORS = ["#4fd1ff", "#7ef7c4", "#ff9c8a", "#c39bff", "#eef1f5"];

export function getCodeScreenTexture(accent: string): THREE.CanvasTexture {
  const cached = cache.get(accent);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0b0f1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // faint accent glow along the top, like a title bar
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(0, 0, canvas.width, 10);
  ctx.globalAlpha = 1;

  const rand = mulberry(accent);
  let y = 22;
  while (y < canvas.height - 10) {
    const indent = Math.floor(rand() * 4) * 10;
    const width = 30 + rand() * (canvas.width - indent - 40);
    ctx.fillStyle = LINE_COLORS[Math.floor(rand() * LINE_COLORS.length)];
    ctx.globalAlpha = 0.75;
    ctx.fillRect(14 + indent, y, width, 6);
    ctx.globalAlpha = 1;
    y += 12;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  cache.set(accent, texture);
  return texture;
}

function mulberry(seedStr: string) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) | 0;
  let a = h >>> 0 || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
