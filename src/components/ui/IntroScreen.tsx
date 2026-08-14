import { useEffect, useState } from "react";
import { useJourneyStore } from "../../state/journeyStore";
import { scrollToGlobalT } from "../../state/scrollControl";
import "./intro-screen.css";

export default function IntroScreen() {
  const started = useJourneyStore((s) => s.started);
  const start = useJourneyStore((s) => s.start);
  const [showButton, setShowButton] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 3400);
    return () => clearTimeout(timer);
  }, []);

  if (started && dismissed) return null;

  const handleStart = () => {
    start();
    setTimeout(() => setDismissed(true), 900);
  };

  const handleSkipToContact = () => {
    start();
    setDismissed(true);
    setTimeout(() => scrollToGlobalT(1, false), 50);
  };

  return (
    <div className={`intro-screen ${started ? "intro-screen--leaving" : ""}`}>
      <div className="intro-screen__content">
        <p className="intro-screen__eyebrow">Software Developer</p>
        <h1 className="intro-screen__name">Varsha P V</h1>
        <div className="intro-screen__divider" aria-hidden="true" />
        <p className="intro-screen__line intro-screen__line--1">This is not just my portfolio.</p>
        <p className="intro-screen__line intro-screen__line--2">It is the journey that brought me here.</p>
        <button
          className={`intro-screen__cta ${showButton ? "is-visible" : ""}`}
          onClick={handleStart}
          disabled={!showButton}
        >
          Begin the Journey
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
        <button className="intro-screen__skip" onClick={handleSkipToContact}>
          Skip to contact
        </button>
      </div>
    </div>
  );
}
