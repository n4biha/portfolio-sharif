"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/*
  Lower-right laptop showing a CSS mock of the selected project's UI (keyed off
  demoPreview.kind). A matcha sits beside it. Crossfades the screen on change.
*/

// Real screenshot on the laptop screen. Held at opacity 0 until the file has
// actually loaded + decoded, then faded in — so a cold first visit never shows
// the image popping in half-drawn (the source of the choppy first paint).
function Shot({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`mock-shot${loaded ? " is-loaded" : ""}`}
      decoding="async"
      onLoad={() => setLoaded(true)}
      // cached images can be complete before onLoad wires up — catch those too
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0) setLoaded(true);
      }}
    />
  );
}

function MockScreen({ preview }) {
  const { title, tagline, accent, kind, screenshot } = preview;

  // real screenshot fills the laptop screen instead of the CSS mock
  if (screenshot) {
    return <Shot src={screenshot} alt={`${title} preview`} />;
  }

  return (
    <div className="mock" style={{ "--mock-accent": accent }}>
      <div className="mock-topbar">
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-url">{title.toLowerCase().replace(/\s+/g, "")}.app</span>
      </div>
      <div className="mock-body">
        <p className="mock-h">{tagline}</p>

        {kind === "dashboard" && (
          <div className="mock-dash">
            <div className="mock-stats">
              <span /><span /><span />
            </div>
            <div className="mock-chart">
              {[40, 64, 32, 78, 52, 70, 46].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        )}

        {kind === "site" && (
          <div className="mock-site">
            <div className="mock-hero" />
            <div className="mock-cards">
              <span /><span /><span />
            </div>
          </div>
        )}

        {(kind === "app") && (
          <div className="mock-app">
            <div className="mock-app-card" />
            <div className="mock-app-rows">
              <span /><span /><span />
            </div>
          </div>
        )}

        {kind === "chart" && (
          <div className="mock-chart tall">
            {[30, 55, 48, 72, 60, 84, 66, 90].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LivePreview({ project }) {
  if (!project) return null;
  return (
    <div className="live-preview">
      <span className="live-label hand">Live Preview</span>

      <div className="laptop">
        <div className="laptop-screen">
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ height: "100%" }}
          >
            <MockScreen preview={project.demoPreview} />
          </motion.div>
        </div>
        <div className="laptop-base" />
      </div>

      {/* small disclaimer under the laptop — only for projects that set one */}
      {project.demoPreview.note && (
        <p className="live-note">{project.demoPreview.note}</p>
      )}

      {/* a little matcha on the desk */}
      <span className="matcha" aria-hidden="true">
        <span className="matcha-cup" />
        <span className="matcha-straw" />
      </span>
    </div>
  );
}
