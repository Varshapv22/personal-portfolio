import { chapters, chapterRanges } from "../../data/chapters";
import { useJourneyStore } from "../../state/journeyStore";
import { scrollToGlobalT } from "../../state/scrollControl";
import { contact } from "../../data/contact";
import "./journey-nav.css";

const GROUPS: Array<{ label: string; navGroup: string }> = [
  { label: "Journey",    navGroup: "Journey" },
  { label: "Education",  navGroup: "Education" },
  { label: "Experience", navGroup: "Experience" },
  { label: "Projects",   navGroup: "Projects" },
  { label: "Contact",    navGroup: "Contact" },
];

function IconVolume() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function IconMute() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

export default function JourneyNav() {
  const started = useJourneyStore((s) => s.started);
  const audioOn = useJourneyStore((s) => s.audioOn);
  const toggleAudio = useJourneyStore((s) => s.toggleAudio);
  const chapterIndex = useJourneyStore((s) => s.chapterIndex);
  const activeNavGroup = chapters[chapterIndex]?.navGroup ?? "";

  if (!started) return null;

  const goTo = (navGroup: string) => {
    const chapter = chapters.find((c) => c.navGroup === navGroup);
    if (!chapter) return;
    const range = chapterRanges[chapter.index];
    // For Contact, jump 35% into the chapter so the contact panel is immediately
    // visible (it fades in during the first 25% of local progress).
    // All nav jumps use smooth=false — smooth scroll flies the camera through
    // all intermediate 3D geometry which causes visual chaos.
    const t = navGroup === "Contact"
      ? range.start + (range.end - range.start) * 0.35
      : range.start;
    scrollToGlobalT(t, false);
  };

  return (
    <header className="journey-nav glass">
      <span className="journey-nav__brand">Varsha P V</span>
      <nav aria-label="Chapters">
        <ul>
          {GROUPS.map((g) => (
            <li key={g.label}>
              <button
                onClick={() => goTo(g.navGroup)}
                className={activeNavGroup === g.navGroup ? "is-active" : ""}
                aria-current={activeNavGroup === g.navGroup ? "page" : undefined}
              >
                {g.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="journey-nav__actions">
        <button
          className="journey-nav__icon-btn"
          onClick={toggleAudio}
          aria-pressed={audioOn}
          aria-label={audioOn ? "Mute ambient sound" : "Unmute ambient sound"}
          title={audioOn ? "Mute" : "Unmute"}
        >
          {audioOn ? <IconVolume /> : <IconMute />}
        </button>
        <a className="journey-nav__resume" href={contact.resumeUrl} download>
          Resume
        </a>
      </div>
    </header>
  );
}
