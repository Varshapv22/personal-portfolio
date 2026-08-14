// The body mesh's baked diffuse texture ("Ch03_Body") has one bright-yellow
// shirt region baked in, with no separate cloth material slot to recolor via
// props (see character-system notes). This hue-shifts just that yellow band
// to a dusty-rose to better match the portfolio subject's actual wardrobe,
// leaving skin/hair/trim colors (which fall outside the yellow hue band)
// untouched. Self-guarding: a pixel already shifted to dusty-rose no longer
// falls in the yellow hue band, so re-running this on an already-recolored
// canvas (e.g. a React StrictMode double effect) is a safe no-op.
const YELLOW_HUE_MIN = 0.09;
const YELLOW_HUE_MAX = 0.2;
const YELLOW_SAT_MIN = 0.35;
const YELLOW_VAL_MIN = 0.35;
const TARGET_HUE = 355 / 360;
const SAT_SCALE = 0.55;
const VAL_SCALE = 0.92;

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
    if (h < 0) h += 1;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    default:
      return [v, p, q];
  }
}

export function recolorShirtPixels(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const [h, s, v] = rgbToHsv(r, g, b);
    if (h >= YELLOW_HUE_MIN && h <= YELLOW_HUE_MAX && s > YELLOW_SAT_MIN && v > YELLOW_VAL_MIN) {
      const [nr, ng, nb] = hsvToRgb(TARGET_HUE, Math.min(1, s * SAT_SCALE), Math.min(1, v * VAL_SCALE));
      data[i] = nr * 255;
      data[i + 1] = ng * 255;
      data[i + 2] = nb * 255;
    }
  }
}
