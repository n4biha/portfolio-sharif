"use client";

/*
  Mobile About/Home — the editorial intro: left-aligned kicker, a big
  typographic greeting (one terracotta accent on the name), a readable bio, and
  the portrait full-width below. No cards, no boxes — the content sits directly
  on the continuous paper. A gentle "scroll" cue closes the screen. (The navbar
  wordmark carries the NABIHA brand mark; socials live in the footer.)
*/

export default function AboutMobile() {
  return (
    <section id="home" className="m-screen m-about">
      <div className="m-hero m-reveal">
        <p className="m-kicker">Data Science @ UC Berkeley</p>
        <h1 className="m-hero-title">
          Hi, I&rsquo;m <span className="m-hero-accent">Nabiha.</span>
        </h1>
        <p className="m-hero-bio">
          I&rsquo;m a Data Science student at UC Berkeley. I build AI-powered
          products that create real impact.
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/photo-portrait.jpg" alt="Nabiha" className="m-hero-photo" />
      </div>

      <p className="m-scroll-cue m-meta" aria-hidden="true">
        scroll <span className="m-scroll-cue-arrow">↓</span>
      </p>
    </section>
  );
}
