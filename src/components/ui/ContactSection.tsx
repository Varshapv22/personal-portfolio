import { useRef } from "react";
import { contact } from "../../data/contact";
import { chapters, chapterIndexAt, localProgressAt } from "../../data/chapters";
import { journeyProgress, useJourneyStore } from "../../state/journeyStore";
import { useRafLoop } from "../../hooks/useRafLoop";
import "./contact-section.css";

const CONTACT_INDEX = chapters.findIndex((c) => c.id === "contact");

export default function ContactSection() {
  const started = useJourneyStore((s) => s.started);
  const ref = useRef<HTMLDivElement>(null);

  useRafLoop(() => {
    if (!ref.current) return;
    const t = journeyProgress.value;
    const idx = chapterIndexAt(t);
    const local = localProgressAt(t, idx);
    const opacity = idx === CONTACT_INDEX ? Math.min(1, local / 0.12) : 0;
    ref.current.style.opacity = String(opacity);
    ref.current.classList.toggle("is-interactive", opacity > 0.6);
  }, started);

  // The outer wrapper and the card itself are both permanently pointer-events:none
  // (see contact-section.css) — a fixed, full-viewport wrapper or an opaque card
  // that ever captured pointer events would block wheel/scroll input to the canvas
  // underneath. Only the actual links/buttons opt back into pointer-events, gated
  // by the "is-interactive" class once the card is visible enough to click.
  return (
    <div id="contact-section" className="contact-section">
      <div ref={ref} className="contact-section__inner glass">
        <p className="contact-section__eyebrow">Let's Build Something</p>
        <h2>{contact.name}</h2>
        <p className="contact-section__role">{contact.role}</p>
        <p className="contact-section__stack">{contact.stack}</p>

        <dl className="contact-section__details">
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{contact.phone}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{contact.location}</dd>
          </div>
        </dl>

        <div className="contact-section__actions">
          <a className="contact-btn" href={contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="contact-btn" href={contact.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="contact-btn contact-btn--primary" href={`mailto:${contact.email}`}>
            Email Me
          </a>
          <a className="contact-btn" href={contact.resumeUrl} download>
            Download Resume
          </a>
        </div>

        <p className="contact-section__closing">
          This is where I started. This is what I built. And this is only the beginning.
        </p>
      </div>
    </div>
  );
}
