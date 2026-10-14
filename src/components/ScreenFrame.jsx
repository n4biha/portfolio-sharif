"use client";

import { useState } from "react";

/*
  The screenshot, shown inside a dark browser-window mockup: three traffic
  lights + the project's name in a title bar, the shot filling the body, and a
  thin footer bar carrying the preview note (if any). Phone/tablet shots are
  portrait, so those sit whole (contained) on the dark body instead of being
  cropped to the window.

  Keyed on the project by the scene, so switching records re-mounts it and
  replays the fade/rise (.screen-frame in globals.css).
*/

// The image, held invisible until it has loaded + decoded, then faded in — so a
// cold first visit never shows it painting in half-drawn.
function Shot({ src, alt, contain }) {
  const [loaded, setLoaded] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`screen-frame-img${loaded ? " is-loaded" : ""}${contain ? " is-contain" : ""}`}
      decoding="async"
      onLoad={() => setLoaded(true)}
      // cached images can be complete before onLoad wires up — catch those too
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0) setLoaded(true);
      }}
    />
  );
}

export default function ScreenFrame({ project }) {
  const preview = project?.demoPreview;
  if (!preview?.screenshot) return null;
  const contain = preview.device === "phone" || preview.device === "tablet";
  return (
    <figure className="screen-frame" aria-label={`${project.title} preview`}>
      <div className="screen-frame-bar">
        <span className="screen-frame-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="screen-frame-name">{project.title}</span>
      </div>
      <div className={`screen-frame-body${contain ? " is-contain" : ""}`}>
        <Shot src={preview.screenshot} alt={`${project.title} preview`} contain={contain} />
      </div>
      {preview.note && <figcaption className="screen-frame-note">{preview.note}</figcaption>}
    </figure>
  );
}
