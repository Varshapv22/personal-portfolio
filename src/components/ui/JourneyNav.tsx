import { useState } from "react";
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

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function JourneyNav() {
  const started = useJourneyStore((s) => s.started);
  const audioOn = useJourneyStore((s) => s.audioOn);
  const toggleAudio = useJourneyStore((s) => s.toggleAudio);
  const chapterIndex = useJourneyStore((s) => s.chapterIndex);
  const activeNavGroup = chapters[chapterIndex]?.navGroup ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!started) return null;

  const goTo = (navGroup: string) => {
    const chapter = chapters.find((c) => c.navGroup === navGroup);
    if (!chapter) return;
    const range = chapterRanges[chapter.index];
    const span = range.end - range.start;
    // For Contact, jump 35% into the chapter so the contact panel is immediately
    // visible (it fades in during the first 25% of local progress). Every other
    // jump nudges 1% in rather than landing exactly on `range.start` — scrollTop
    // gets quantized to whole pixels, and at some viewport heights that rounds
    // the achieved scroll fraction a hair *below* the boundary, so chapterIndexAt
    // never actually crosses into the target chapter (nav highlight/ProjectBubbles
    // etc. silently never activate). All nav jumps use smooth=false — smooth
    // scroll flies the camera through all intermediate 3D geometry which causes
    // visual chaos.
    const t = navGroup === "Contact"
      ? range.start + span * 0.35
      : range.start + span * 0.01;
    scrollToGlobalT(t, false);
    setMobileOpen(false);
  };

  return (
    <header className="journey-nav glass">
      <span className="journey-nav__brand">Varsha P V</span>

      <nav className="journey-nav__links" aria-label="Chapters">
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
        <a className="journey-nav__resume" href={contact.resumeUrl} download="Varsha_P_V_Resume.pdf">
          Resume
        </a>
      </div>

      <button
        className="journey-nav__hamburger"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
        aria-controls="journey-nav-mobile-menu"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <IconClose /> : <IconMenu />}
      </button>

      {mobileOpen && (
        <div id="journey-nav-mobile-menu" className="journey-nav__mobile-menu glass">
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
          <div className="journey-nav__mobile-menu-footer">
            <button
              className="journey-nav__icon-btn"
              onClick={toggleAudio}
              aria-pressed={audioOn}
              aria-label={audioOn ? "Mute ambient sound" : "Unmute ambient sound"}
            >
              {audioOn ? <IconVolume /> : <IconMute />}
              {audioOn ? "Mute" : "Unmute"}
            </button>
            <a
              className="journey-nav__resume"
              href={contact.resumeUrl}
              download="Varsha_P_V_Resume.pdf"
              onClick={() => setMobileOpen(false)}
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
