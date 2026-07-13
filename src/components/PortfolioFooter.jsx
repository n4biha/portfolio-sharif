"use client";

import Image from "next/image";
import { forwardRef, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export const CONTACT_EMAIL = "nabihasharif@berkeley.edu";
// Add the final PDF at public/resume.pdf, then set this to "/resume.pdf".
// Until then the résumé action remains useful by opening an email request.
export const RESUME_URL = "";

const SOCIAL_LINKS = [
  { label: "Email Nabiha", href: `mailto:${CONTACT_EMAIL}`, icon: "email" },
  { label: "Nabiha on LinkedIn", href: "https://www.linkedin.com/in/nabihasharif/", icon: "linkedin", external: true },
  { label: "Nabiha on GitHub", href: "https://github.com/n4biha", icon: "github", external: true },
];

export const SMISKI_CHARACTERS = [
  { id: "berkeley", dims: [612, 736], left: "3%", top: "15%", tabletLeft: "2%", tabletTop: "17%", mobileLeft: "-3%", mobileTop: "7%", width: "clamp(120px, 11vw, 225px)", mobileWidth: "34vw", rotation: -2, z: 4, idle: "sway", reaction: "flag", entry: [-35, -20], mobile: true },
  { id: "coding", dims: [706, 501], left: "27%", top: "12%", tabletLeft: "28%", tabletTop: "13%", mobileLeft: "54%", mobileTop: "13%", width: "clamp(165px, 16vw, 320px)", mobileWidth: "46vw", rotation: 1, z: 3, idle: "breathe", reaction: "code", entry: [0, -35], mobile: true },
  { id: "artist", dims: [468, 740], left: "61%", top: "9%", tabletLeft: "62%", tabletTop: "11%", mobileLeft: "1%", mobileTop: "58%", width: "clamp(105px, 10vw, 205px)", mobileWidth: "29vw", rotation: 2, z: 3, idle: "sway", reaction: "paint", entry: [0, -35], mobile: true },
  { id: "music", dims: [484, 605], left: "79%", top: "17%", tabletLeft: "81%", tabletTop: "19%", mobileLeft: "69%", mobileTop: "58%", width: "clamp(115px, 11vw, 220px)", mobileWidth: "31vw", rotation: -1, z: 3, idle: "breathe", reaction: "music", entry: [35, -20], mobile: true },
  { id: "peeking", dims: [319, 707], left: "94%", top: "36%", tabletLeft: "92%", tabletTop: "37%", mobileLeft: "94%", mobileTop: "38%", width: "clamp(72px, 7vw, 140px)", mobileWidth: "22vw", rotation: 0, z: 5, idle: "peek", reaction: "hide", entry: [40, 0], draggable: false },
  { id: "hanging", dims: [500, 611], left: "3%", top: "50%", tabletLeft: "2%", tabletTop: "51%", mobileLeft: "2%", mobileTop: "49%", width: "clamp(125px, 12vw, 235px)", mobileWidth: "31vw", rotation: -1, z: 3, idle: "swing", reaction: "swing", entry: [-35, 0], draggable: false },
  { id: "data", dims: [622, 608], left: "21%", top: "69%", tabletLeft: "19%", tabletTop: "70%", mobileLeft: "2%", mobileTop: "67%", width: "clamp(130px, 12vw, 245px)", mobileWidth: "38vw", rotation: -1, z: 3, idle: "board", reaction: "data", entry: [-25, 25] },
  { id: "reading", dims: [431, 616], left: "45%", top: "73%", tabletLeft: "44%", tabletTop: "73%", mobileLeft: "8%", mobileTop: "77%", width: "clamp(95px, 9vw, 180px)", mobileWidth: "32vw", rotation: 1, z: 3, idle: "breathe", reaction: "read", entry: [0, 30], mobile: true },
  { id: "lounging", dims: [715, 444], left: "80%", top: "81%", tabletLeft: "78%", tabletTop: "82%", mobileLeft: "65%", mobileTop: "87%", width: "clamp(145px, 14vw, 285px)", mobileWidth: "43vw", rotation: 1, z: 3, idle: "breathe", reaction: "lounge", entry: [30, 25] },
  { id: "resume", dims: [471, 814], left: "78%", top: "60%", tabletLeft: "79%", tabletTop: "59%", mobileLeft: "38%", mobileTop: "47%", width: "clamp(90px, 8.5vw, 170px)", mobileWidth: "28vw", rotation: 1, z: 7, idle: "board", reaction: "data", entry: [30, 0], mobile: true, link: true },
].map((character) => ({
  ...character,
  src: `/images/smiski-footer/smiski-${character.id}.png`,
  alt: `${character.id.replace("-", " ")} Smiski illustration`,
  ariaLabel: character.link ? "Open Nabiha's resume" : `Animate ${character.id.replace("-", " ")} Smiski`,
}));

function SocialIcon({ type }) {
  if (type === "email") return <path d="M3 5.5h18v13H3v-13Zm1.5 2 7.5 5 7.5-5M4.5 17V9.8l7.5 5 7.5-5V17" />;
  if (type === "linkedin") return <path d="M5 9v10M5 5.6v.1M9.5 19V9m0 4.2c.8-2.9 6.5-3.5 6.5 1V19M3.5 9h3M8 9h3" />;
  return <path d="M12 3a9 9 0 0 0-2.8 17.6c.45.08.6-.2.6-.43v-1.7c-2.5.55-3-1.05-3-1.05-.4-1.05-1-1.33-1-1.33-.82-.56.06-.55.06-.55.9.07 1.38.94 1.38.94.8 1.4 2.12 1 2.63.76.08-.6.31-1 .57-1.23-2-.23-4.1-1.02-4.1-4.55 0-1 .35-1.82.92-2.47-.1-.23-.4-1.17.09-2.43 0 0 .75-.25 2.48.94a8.2 8.2 0 0 1 4.5 0c1.72-1.2 2.48-.94 2.48-.94.49 1.26.18 2.2.09 2.43.57.65.92 1.47.92 2.47 0 3.54-2.1 4.32-4.12 4.55.33.28.62.84.62 1.7v2.46c0 .24.16.52.62.43A9 9 0 0 0 12 3Z" />;
}

function FooterSocialLinks() {
  return (
    <nav className="portfolio-footer-socials" aria-label="Contact links">
      {SOCIAL_LINKS.map((link) => (
        <a key={link.icon} href={link.href} aria-label={link.label} {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><SocialIcon type={link.icon} /></svg>
        </a>
      ))}
    </nav>
  );
}

function FooterContactButton() {
  return (
    <motion.a className="portfolio-footer-cta" href="https://www.linkedin.com/in/nabihasharif/" target="_blank" rel="noopener noreferrer" whileHover={{ y: -3, scale: 1.025 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 360, damping: 22 }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><SocialIcon type="linkedin" /></svg>
      <span>Connect with me</span><span className="portfolio-footer-arrow" aria-hidden="true">→</span>
    </motion.a>
  );
}

const TOP_WORDS = [
  { text: "THANKS", offset: 0 },
  { text: "FOR", offset: 6 },
];
const TOP_LETTERS = "THANKSFOR".split("");
const DEFAULT_TITLE_ANCHOR = 6;

function HeadlineSitter({ containerRef, letterRefs, reducedMotion }) {
  const buttonRef = useRef(null);
  const activeAnchorRef = useRef(DEFAULT_TITLE_ANCHOR);
  const movedRef = useRef(false);
  const x = useMotionValue(0);
  const [anchors, setAnchors] = useState([]);
  const [activeAnchor, setActiveAnchor] = useState(DEFAULT_TITLE_ANCHOR);
  const [reactionRun, setReactionRun] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let frame = 0;

    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (cancelled || !containerRef.current || !buttonRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const sitterWidth = buttonRef.current.getBoundingClientRect().width;
        const nextAnchors = letterRefs.current
          .filter(Boolean)
          .map((letter) => {
            const rect = letter.getBoundingClientRect();
            return rect.left - containerRect.left + rect.width / 2 - sitterWidth / 2;
          });

        if (!nextAnchors.length) return;
        const nextIndex = Math.min(activeAnchorRef.current, nextAnchors.length - 1);
        activeAnchorRef.current = nextIndex;
        setActiveAnchor(nextIndex);
        setAnchors(nextAnchors);
        x.set(nextAnchors[nextIndex]);
      });
    };

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    measure();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, letterRefs, x]);

  if (missing) return null;

  const moveToAnchor = (index) => {
    if (!anchors.length) return;
    const nextIndex = Math.max(0, Math.min(index, anchors.length - 1));
    activeAnchorRef.current = nextIndex;
    setActiveAnchor(nextIndex);
    animate(x, anchors[nextIndex], reducedMotion
      ? { duration: 0.01 }
      : { type: "spring", stiffness: 560, damping: 38, mass: 0.45 });
  };

  const snapToNearestLetter = () => {
    if (!anchors.length) return;
    const current = x.get();
    let nearest = 0;
    for (let index = 1; index < anchors.length; index += 1) {
      if (Math.abs(anchors[index] - current) < Math.abs(anchors[nearest] - current)) nearest = index;
    }
    moveToAnchor(nearest);
  };

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className={`portfolio-title-sitter${dragging ? " is-dragging" : ""}`}
      style={{ x }}
      drag="x"
      dragConstraints={{ left: anchors[0] ?? 0, right: anchors.at(-1) ?? 0 }}
      dragElastic={reducedMotion ? 0 : 0.02}
      dragMomentum={false}
      whileHover={reducedMotion ? undefined : { scale: 1.035 }}
      whileDrag={reducedMotion ? undefined : { scale: 1.055 }}
      onDragStart={() => { movedRef.current = true; setDragging(true); }}
      onDragEnd={() => {
        setDragging(false);
        snapToNearestLetter();
        window.setTimeout(() => { movedRef.current = false; }, 0);
      }}
      onClick={() => { if (!movedRef.current && !reducedMotion) setReactionRun((run) => run + 1); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End") {
          event.preventDefault();
          if (event.key === "Home") moveToAnchor(0);
          else if (event.key === "End") moveToAnchor(anchors.length - 1);
          else moveToAnchor(activeAnchorRef.current + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
      aria-label={`Title Smiski on the letter ${TOP_LETTERS[activeAnchor]}. Drag horizontally or use arrow keys to move it.`}
    >
      <span className="smiski-idle smiski-idle-feet">
        <span key={reactionRun} className={reactionRun ? "smiski-reaction smiski-reaction-bounce" : "smiski-reaction"}>
          <Image
            src="/images/smiski-footer/smiski-title-sitter.png"
            alt="Smiski sitting on the Thanks for stopping by heading"
            width={289}
            height={486}
            sizes="62px"
            draggable={false}
            onError={() => {
              console.warn("[PortfolioFooter] Missing processed character asset: /images/smiski-footer/smiski-title-sitter.png");
              setMissing(true);
            }}
          />
        </span>
      </span>
      <span className="smiski-tooltip" role="tooltip">Drag me across the letters</span>
    </motion.button>
  );
}

function FooterHeadline({ reducedMotion }) {
  const containerRef = useRef(null);
  const letterRefs = useRef([]);

  return (
    <div ref={containerRef} className="portfolio-footer-title-wrap">
      <h2 className="portfolio-footer-title" aria-label="Thanks for stopping by">
        <span className="portfolio-footer-title-line portfolio-footer-title-line-top" aria-hidden="true">
          {TOP_WORDS.map((word) => (
            <span key={word.text} className="portfolio-footer-title-word">
              {word.text.split("").map((letter, index) => (
                <span
                  key={`${word.text}-${index}`}
                  ref={(node) => { letterRefs.current[word.offset + index] = node; }}
                  className="portfolio-footer-title-letter"
                >{letter}</span>
              ))}
            </span>
          ))}
        </span>
        <span className="portfolio-footer-title-line" aria-hidden="true">ST<span className="portfolio-footer-o">O<span className="portfolio-footer-star">★</span></span>PPING BY</span>
      </h2>
      <HeadlineSitter containerRef={containerRef} letterRefs={letterRefs} reducedMotion={reducedMotion} />
    </div>
  );
}

function FooterCursor({ containerRef }) {
  const reducedMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 650, damping: 42, mass: 0.22 });
  const y = useSpring(rawY, { stiffness: 650, damping: 42, mass: 0.22 });
  const visibleRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sparkle, setSparkle] = useState(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const updateEnabled = () => setEnabled(finePointer.matches);
    updateEnabled();
    finePointer.addEventListener("change", updateEnabled);
    return () => finePointer.removeEventListener("change", updateEnabled);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled || reducedMotion) return undefined;

    const pointFromEvent = (event) => {
      const rect = container.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const show = () => {
      if (visibleRef.current) return;
      visibleRef.current = true;
      setVisible(true);
    };
    const onMove = (event) => {
      const point = pointFromEvent(event);
      rawX.set(point.x);
      rawY.set(point.y);
      show();
    };
    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const onDown = (event) => {
      const point = pointFromEvent(event);
      setSparkle({ ...point, id: Date.now() });
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("pointerdown", onDown);
    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("pointerdown", onDown);
    };
  }, [containerRef, enabled, rawX, rawY, reducedMotion]);

  if (!enabled || reducedMotion) return null;

  return (
    <div className="portfolio-footer-cursor" aria-hidden="true">
      <motion.span className="portfolio-footer-cursor-dot" style={{ x, y }} animate={{ opacity: visible ? 1 : 0 }}>
        <i />
      </motion.span>
      {sparkle && (
        <motion.span
          key={sparkle.id}
          className="portfolio-footer-cursor-sparkle"
          style={{ left: sparkle.x, top: sparkle.y }}
          initial={{ opacity: 0.9, scale: 0.35, rotate: -18 }}
          animate={{ opacity: 0, scale: 1.5, rotate: 18, y: -8 }}
          transition={{ duration: 0.48, ease: "easeOut" }}
        >★</motion.span>
      )}
    </div>
  );
}

function PropEffects({ character }) {
  return (
    <>
      {character.id === "berkeley" && <span className="smiski-pennant-text" aria-hidden="true">UC BERKELEY</span>}
      {character.id === "coding" && <span className="smiski-code-pop" aria-hidden="true">&lt;/&gt;</span>}
      {character.id === "artist" && <span className="smiski-paint-pop" aria-hidden="true" />}
      {character.id === "music" && <span className="smiski-note-pop" aria-hidden="true">♪</span>}
      {character.id === "data" && <span className="smiski-bars-pop" aria-hidden="true"><i /><i /><i /></span>}
      {character.id === "reading" && <span className="smiski-page-pop" aria-hidden="true" />}
    </>
  );
}

function DraggableSmiski({ character, boundaryRef, index }) {
  const reducedMotion = useReducedMotion();
  const [missing, setMissing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reactionRun, setReactionRun] = useState(0);
  const dragTilt = useMotionValue(0);
  const smoothDragTilt = useSpring(dragTilt, { stiffness: 520, damping: 38, mass: 0.35 });
  const movedRef = useRef(false);
  if (missing) return null;
  const isResume = character.link;
  const isPeeking = character.id === "peeking";
  const isDraggable = character.draggable !== false;
  const resumeHref = RESUME_URL || `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Résumé request")}`;
  const InteractiveCharacter = isResume ? motion.a : motion.div;

  const react = () => {
    if (reducedMotion) return;
    setReactionRun((run) => run + 1);
  };

  const activate = () => react();

  const style = {
    "--sm-left": character.left,
    "--sm-top": character.top,
    "--sm-left-tablet": character.tabletLeft,
    "--sm-top-tablet": character.tabletTop,
    "--sm-left-mobile": character.mobileLeft,
    "--sm-top-mobile": character.mobileTop,
    "--sm-width": character.width,
    "--sm-width-mobile": character.mobileWidth,
    "--sm-rotation": `${character.rotation}deg`,
    "--sm-z": character.z,
    "--sm-idle-delay": `${index * -0.37}s`,
  };

  return (
    <motion.div data-smiski={character.id} className={`smiski-slot${character.mobile ? " smiski-mobile-priority" : ""}`} style={style} initial={{ opacity: 0, x: reducedMotion ? 0 : character.entry[0], y: reducedMotion ? 0 : character.entry[1] }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: reducedMotion ? 0 : 0.18 + index * 0.035, duration: reducedMotion ? 0.15 : 0.42 }}>
      <InteractiveCharacter
        className={`smiski-drag${isResume ? " smiski-resume-link" : ""}${!isDraggable ? " smiski-fixed" : ""}${dragging ? " is-dragging" : ""}`}
        {...(isResume ? { href: resumeHref, ...(RESUME_URL ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : {})}
        drag={isDraggable}
        dragConstraints={boundaryRef}
        dragElastic={reducedMotion ? 0 : 0.06}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 560, bounceDamping: 34 }}
        style={{ rotate: smoothDragTilt }}
        whileHover={reducedMotion ? undefined : { y: -6, scale: 1.045 }}
        whileDrag={isDraggable ? { y: -5, scale: 1.05, zIndex: 30 } : undefined}
        transition={{ type: "spring", stiffness: 440, damping: 30 }}
        role={isResume ? undefined : "button"}
        tabIndex={0}
        aria-label={isPeeking ? "Play the peeking Smiski hide-and-return animation" : character.ariaLabel}
        onDragStart={() => { movedRef.current = true; setDragging(true); }}
        onDrag={(_, info) => dragTilt.set(Math.max(-6, Math.min(6, info.velocity.x / 155)))}
        onDragEnd={() => { setDragging(false); dragTilt.set(0); window.setTimeout(() => { movedRef.current = false; }, 0); }}
        onTap={() => { if (!movedRef.current && !isResume) activate(); }}
        onClick={(event) => { if (isResume && movedRef.current) event.preventDefault(); }}
        onKeyDown={(event) => {
          if (isResume && event.key === " ") {
            event.preventDefault();
            event.currentTarget.click();
          } else if (!isResume && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            activate();
          }
        }}
      >
        <span className={`smiski-idle smiski-idle-${character.idle}`}>
          <span key={reactionRun} className={reactionRun ? `smiski-reaction smiski-reaction-${character.reaction}` : "smiski-reaction"}>
            <Image src={character.src} alt={character.alt} width={character.dims[0]} height={character.dims[1]} sizes="(max-width: 768px) 46vw, 16vw" draggable={false} onError={() => { console.warn(`[PortfolioFooter] Missing processed character asset: ${character.src}`); setMissing(true); }} />
            <PropEffects character={character} />
          </span>
        </span>
        {isResume && <span className="smiski-resume-copy">click to see<br />my resume <i aria-hidden="true">↗</i></span>}
      </InteractiveCharacter>
    </motion.div>
  );
}

const PortfolioFooter = forwardRef(function PortfolioFooter(_, forwardedRef) {
  const footerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const setFooterRef = (node) => {
    footerRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  return (
    <footer id="footer" ref={setFooterRef} className="portfolio-footer">
      <div className="portfolio-footer-grid">
        <div className="portfolio-footer-center">
          <motion.div className="portfolio-footer-center-motion" initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: reducedMotion ? 0.15 : 0.55 }}>
            <FooterHeadline reducedMotion={reducedMotion} />
            <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: reducedMotion ? 0 : 0.16, duration: 0.4 }}>
              <FooterContactButton />
            </motion.div>
          </motion.div>
        </div>

        {SMISKI_CHARACTERS.map((character, index) => <DraggableSmiski key={character.id} character={character} boundaryRef={footerRef} index={index} />)}

        <motion.div className="portfolio-footer-bottom" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: reducedMotion ? 0 : 0.55, duration: 0.35 }}>
          <span>Designed &amp; built by Nabiha</span><i aria-hidden="true" />
          <FooterSocialLinks /><i aria-hidden="true" />
          <span>© 2026 Nabiha Sharif</span>
        </motion.div>
      </div>
      <FooterCursor containerRef={footerRef} />
    </footer>
  );
});

export default PortfolioFooter;
