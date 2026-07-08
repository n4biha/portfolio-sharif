"use client";

import { motion } from "framer-motion";

/*
  Lower-right laptop showing a CSS mock of the selected project's UI (keyed off
  demoPreview.kind). A matcha sits beside it. Crossfades the screen on change.
*/
function MockScreen({ preview }) {
  const { title, tagline, accent, kind, screenshot } = preview;

  // real screenshot fills the laptop screen instead of the CSS mock
  if (screenshot) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={screenshot} alt={`${title} preview`} className="mock-shot" />
    );
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
