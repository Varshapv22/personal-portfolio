// The master timeline of the journey. Everything downstream — camera, character,
// environment kit, lighting, captions — is derived from this single data source.

export type OutfitId = "child" | "student-school" | "student-college" | "professional" | "engineer";
export type CameraStyle = "follow" | "orbit" | "closeup" | "wide" | "interactive";
export type KitId =
  | "village"
  | "school"
  | "college"
  | "digital"
  | "certs"
  | "office-btrac"
  | "office-ioss"
  | "projects"
  | "contact";

export interface Caption {
  at: number; // 0..1 local progress within the chapter
  text: string;
  style?: "lead" | "sub" | "label" | "quote";
}

export interface Panel {
  at: number;
  title: string;
  lines: string[];
}

export interface Theme {
  sky: string;
  fog: string;
  ambient: string;
  sun: string;
  sunIntensity: number;
  accent: string;
}

export interface Chapter {
  id: string;
  index: number;
  navGroup: "Journey" | "Education" | "Experience" | "Projects" | "Contact";
  progressLabel: string;
  kit: KitId;
  weight: number;
  theme: Theme;
  captions: Caption[];
  panels?: Panel[];
  outfit: OutfitId;
  cameraStyle: CameraStyle;
}

const dawn: Theme      = { sky: "#f6d9a8", fog: "#f0c88a", ambient: "#fff1d6", sun: "#ffcf8b", sunIntensity: 1.4, accent: "#e08a3c" };
const day: Theme       = { sky: "#bfe3ff", fog: "#dff0ff", ambient: "#eef7ff", sun: "#fff6e0", sunIntensity: 1.6, accent: "#3c7ce0" };
const brightDay: Theme = { sky: "#a9dcff", fog: "#e9f6ff", ambient: "#ffffff", sun: "#ffffff", sunIntensity: 1.9, accent: "#2f9e6e" };
const coolCode: Theme  = { sky: "#0c1224", fog: "#0a0f1e", ambient: "#1c2a4a", sun: "#6fb8ff", sunIntensity: 0.9, accent: "#4fd1ff" };
const office: Theme    = { sky: "#e7eef5", fog: "#dfe8f2", ambient: "#f4f7fb", sun: "#ffffff", sunIntensity: 1.3, accent: "#5b6cff" };
const officeGreen: Theme = { sky: "#e9f2ea", fog: "#e2eee2", ambient: "#f5faf3", sun: "#fffaf0", sunIntensity: 1.35, accent: "#3f8f4f" };
const future: Theme    = { sky: "#ffd9a0", fog: "#ffe3b8", ambient: "#fff2da", sun: "#ffffff", sunIntensity: 2, accent: "#ff8a3c" };
const contact: Theme   = { sky: "#0b0f1a", fog: "#0b0f1a", ambient: "#1a2036", sun: "#c8d4ff", sunIntensity: 0.6, accent: "#c8d4ff" };

export const chapters: Chapter[] = [
  {
    id: "childhood",
    index: 0,
    navGroup: "Journey",
    progressLabel: "01 Childhood",
    kit: "village",
    weight: 1.1,
    theme: dawn,
    outfit: "child",
    cameraStyle: "follow",
    captions: [
      { at: 0.05, text: "Every journey starts somewhere.", style: "lead" },
      { at: 0.35, text: "Kannur, Kerala", style: "sub" },
      { at: 0.72, text: "VARSHA P V", style: "lead" },
      { at: 0.82, text: "Born & raised in Kerala", style: "sub" },
    ],
  },
  {
    id: "school",
    index: 1,
    navGroup: "Education",
    progressLabel: "02 School",
    kit: "school",
    weight: 1.2,
    theme: day,
    outfit: "student-school",
    cameraStyle: "follow",
    captions: [
      { at: 0.08, text: "A bell rings. A new chapter opens.", style: "lead" },
    ],
    panels: [
      { at: 0.3, title: "10th Board", lines: ["GGHSS MADAYI", "Kerala State Board", "2015 – 2016"] },
      { at: 0.7, title: "12th Board", lines: ["GBHSS MADAYI", "Kerala State Board", "2017 – 2018"] },
    ],
  },
  {
    id: "college",
    index: 2,
    navGroup: "Education",
    progressLabel: "03 Computer Science",
    kit: "college",
    weight: 1.3,
    theme: brightDay,
    outfit: "student-college",
    cameraStyle: "follow",
    captions: [
      { at: 0.55, text: "This is where curiosity became code.", style: "lead" },
    ],
    panels: [
      { at: 0.15, title: "BSc Computer Science", lines: ["Kannur University", "2018 – 2021"] },
    ],
  },
  {
    id: "first-code",
    index: 3,
    navGroup: "Education",
    progressLabel: "04 First Code",
    kit: "digital",
    weight: 1.3,
    theme: coolCode,
    outfit: "student-college",
    cameraStyle: "follow",
    captions: [
      { at: 0.1,  text: "I didn't just learn to write code.", style: "lead" },
      { at: 0.3,  text: "I learned how systems communicate.", style: "lead" },
      { at: 0.85, text: "PHP · Laravel · MySQL · JavaScript · HTML · CSS · Git", style: "label" },
    ],
  },
  {
    id: "certifications",
    index: 4,
    navGroup: "Education",
    progressLabel: "05 Certifications",
    kit: "certs",
    weight: 1,
    theme: coolCode,
    outfit: "student-college",
    cameraStyle: "follow",
    captions: [{ at: 0.1, text: "Learning became a discipline.", style: "sub" }],
    panels: [
      { at: 0.3, title: "PHP (Hypertext Preprocessor)", lines: ["Gtec", "2023"] },
      { at: 0.7, title: "Python Data Science with AI Expert", lines: ["Expertz Lab", "2021 – 2022"] },
    ],
  },
  {
    id: "btrac",
    index: 5,
    navGroup: "Experience",
    progressLabel: "06 BTRAC",
    kit: "office-btrac",
    weight: 1.4,
    theme: office,
    outfit: "professional",
    cameraStyle: "follow",
    captions: [
      { at: 0.12, text: "My first professional chapter taught me that software isn't only about writing code.", style: "lead" },
      { at: 0.4,  text: "It's about solving problems that matter.", style: "lead" },
    ],
    panels: [{ at: 0.15, title: "BTRAC", lines: ["Software Developer", "Jul 2023 – Jan 2025"] }],
  },
  {
    id: "ioss",
    index: 6,
    navGroup: "Experience",
    progressLabel: "07 Infinite Open Source",
    kit: "office-ioss",
    weight: 1.4,
    theme: officeGreen,
    outfit: "engineer",
    cameraStyle: "follow",
    captions: [
      { at: 0.15, text: "Today, I build systems that connect people, platforms, and data.", style: "lead" },
      { at: 0.5,  text: "From APIs to payments, from databases to deployments.", style: "lead" },
    ],
    panels: [{ at: 0.15, title: "Infinite Open Source Solutions", lines: ["Software Engineer — Laravel", "Feb 2025 – Present"] }],
  },
  {
    id: "projects",
    index: 7,
    navGroup: "Projects",
    progressLabel: "08 Projects",
    kit: "projects",
    weight: 2,
    theme: future,
    outfit: "engineer",
    cameraStyle: "follow",
    captions: [{ at: 0.03, text: "Five paths. Five problems solved.", style: "sub" }],
  },
  {
    id: "contact",
    index: 8,
    navGroup: "Contact",
    progressLabel: "09 Contact",
    kit: "contact",
    weight: 1.2,
    theme: contact,
    outfit: "engineer",
    cameraStyle: "follow",
    captions: [],
  },
];


export const totalWeight = chapters.reduce((s, c) => s + c.weight, 0);

// cumulative [start,end) offsets in 0..1 global scroll space for each chapter
export const chapterRanges = (() => {
  let acc = 0;
  return chapters.map((c) => {
    const start = acc / totalWeight;
    acc += c.weight;
    const end = acc / totalWeight;
    return { id: c.id, start, end };
  });
})();

export function chapterIndexAt(globalT: number): number {
  for (let i = 0; i < chapterRanges.length; i++) {
    const r = chapterRanges[i];
    if (globalT >= r.start && globalT < r.end) return i;
  }
  return globalT >= 1 ? chapters.length - 1 : 0;
}

export function localProgressAt(globalT: number, chapterIdx: number): number {
  const r = chapterRanges[chapterIdx];
  if (!r) return 0;
  const span = r.end - r.start || 1;
  return Math.min(1, Math.max(0, (globalT - r.start) / span));
}
