"use client";

/*
  Mobile About/Home — a calm scrapbook intro: a small ransom-note "Nabiha", one
  centered torn-paper card holding a polaroid, a short bio, and a row of social
  links, with a single small star sticker. Reuses the existing /public image
  assets (cut-out letters, portrait, star) so it matches the desktop brand.
*/

const LETTERS = [
  { src: "/images/letter-1-n.png", alt: "N", rot: -6 },
  { src: "/images/letter-2-a.png", alt: "a", rot: 4 },
  { src: "/images/letter-3-b.png", alt: "b", rot: -3 },
  { src: "/images/letter-4-i.png", alt: "i", rot: 5 },
  { src: "/images/letter-5-h.png", alt: "h", rot: -4 },
  { src: "/images/letter-6-a.png", alt: "a", rot: 3 },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nabihasharif/",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.78c0-1.38-.03-3.15-1.97-3.15-1.97 0-2.27 1.5-2.27 3.05V21H9V9Z",
  },
  {
    label: "GitHub",
    href: "https://github.com/n4biha",
    path: "M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z",
  },
  {
    label: "Email",
    href: "mailto:nabihasharif@berkeley.edu",
    path: "M3 5.5h18c.55 0 1 .45 1 1V17.5c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V6.5c0-.55.45-1 1-1Zm.9 2L12 12.7 20.1 7.5H3.9ZM20 9.55l-7.46 4.79a1 1 0 0 1-1.08 0L4 9.55V16.5h16V9.55Z",
  },
];

export default function AboutMobile() {
  return (
    <section id="home" className="m-screen m-about">
      <h1 className="m-about-name" aria-label="Nabiha">
        {LETTERS.map((l, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={l.src}
            alt={l.alt}
            aria-hidden="true"
            className="m-about-letter"
            style={{ transform: `rotate(${l.rot}deg)` }}
          />
        ))}
      </h1>

      <article className="m-about-card">
        <div className="m-about-polaroid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/photo-portrait.jpg" alt="Nabiha" />
        </div>

        <div className="m-about-text">
          <p className="m-about-hi">Hi, I&rsquo;m Nabiha.</p>
          <p>I&rsquo;m a Data Science student at UC Berkeley.</p>
          <p>I build AI-powered products that create real impact.</p>
        </div>

        <ul className="m-about-socials">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="m-social"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* one small star sticker — the only decoration */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/stars-sticker.png" alt="" aria-hidden="true" className="m-about-star" />
      </article>
    </section>
  );
}
