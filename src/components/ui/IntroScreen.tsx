import { useEffect, useState } from "react";
import { useJourneyStore } from "../../state/journeyStore";
import { scrollToGlobalT } from "../../state/scrollControl";
import "./intro-screen.css";

const NAME = "Varsha P V";

const SKILLS_ROW_1 = [
  { name: "PHP",        color: "#8993be" },
  { name: "Laravel",   color: "#ff2d20" },
  { name: "MySQL",     color: "#4479a1" },
  { name: "JavaScript",color: "#f7df1e" },
  { name: "REST API",  color: "#4fd1c5" },
];
const SKILLS_ROW_2 = [
  { name: "WordPress", color: "#21759b" },
  { name: "Python",    color: "#3572a5" },
  { name: "HTML",      color: "#e34c26" },
  { name: "CSS",       color: "#264de4" },
  { name: "Git",       color: "#f05032" },
];

export default function IntroScreen() {
  const started  = useJourneyStore((s) => s.started);
  const start    = useJourneyStore((s) => s.start);
  const [showCta, setShowCta]       = useState(false);
  const [dismissed, setDismissed]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCta(true), 2600);
    return () => clearTimeout(t);
  }, []);

  if (started && dismissed) return null;

  const handleStart = () => {
    start();
    setTimeout(() => setDismissed(true), 900);
  };

  const handleSkip = () => {
    start();
    setDismissed(true);
    setTimeout(() => scrollToGlobalT(1, false), 50);
  };

  return (
    <div className={`is-root${started ? " is-root--out" : ""}`}>
      {/* ── Ambient background orbs ── */}
      <div className="is-orb is-orb--1" aria-hidden="true" />
      <div className="is-orb is-orb--2" aria-hidden="true" />
      <div className="is-orb is-orb--3" aria-hidden="true" />

      {/* ── Dot-grid overlay ── */}
      <div className="is-grid" aria-hidden="true" />

      {/* ── Horizontal scan line ── */}
      <div className="is-scanline" aria-hidden="true" />

      <div className="is-body">
        {/* Eyebrow */}
        <div className="is-eyebrow" aria-hidden="true">
          <span className="is-eyebrow__line" />
          <span className="is-eyebrow__text">Software Developer</span>
          <span className="is-eyebrow__line" />
        </div>

        {/* Name — letter-by-letter clip reveal */}
        <h1 className="is-name" aria-label={NAME}>
          {NAME.split("").map((ch, i) => (
            <span
              key={i}
              className="is-name__letter"
              style={{ "--li": i } as React.CSSProperties}
              aria-hidden="true"
            >
              {ch === " " ? "\u00a0" : ch}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <p className="is-tagline">
          <span className="is-tagline__l1">This is not just my portfolio.</span>
          <span className="is-tagline__l2">It is the journey that brought me here.</span>
        </p>

        {/* Skill tags */}
        <div className="is-skills" aria-label="Tech skills">
          <div className="is-skills__row is-skills__row--a">
            {SKILLS_ROW_1.map((s, i) => (
              <span
                key={s.name}
                className="is-tag"
                style={{ "--tc": s.color, "--ti": i } as React.CSSProperties}
              >
                <span className="is-tag__dot" />
                {s.name}
              </span>
            ))}
          </div>
          <div className="is-skills__row is-skills__row--b">
            {SKILLS_ROW_2.map((s, i) => (
              <span
                key={s.name}
                className="is-tag"
                style={{ "--tc": s.color, "--ti": i } as React.CSSProperties}
              >
                <span className="is-tag__dot" />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          className={`is-cta${showCta ? " is-cta--ready" : ""}`}
          onClick={handleStart}
          disabled={!showCta}
        >
          <span className="is-cta__shimmer" aria-hidden="true" />
          <span className="is-cta__label">Begin the Journey</span>
          <span className="is-cta__icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
          <span className="is-cta__ring" aria-hidden="true" />
        </button>

        <button className="is-skip" onClick={handleSkip}>
          Skip to contact
        </button>
      </div>
    </div>
  );
}
