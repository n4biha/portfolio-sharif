"use client";

import { useState } from "react";

/*
  The project's screenshot, shown on the device it actually runs on:
    - default: a dark browser window (three traffic lights + the project's name
      in a title bar, the shot filling the body, a thin footer bar for the note)
    - demoPreview.device === "phone": an iPhone — rounded black body, side
      buttons, the shot filling the screen (the Tiny Pause capture already
      carries simulator bezels, so the screen is cut a touch narrow to crop them)
    - demoPreview.device === "tablet": a sign-in kiosk — a tablet in a thick
      bezel standing on a neck + base plate, the shot filling the screen
  The note (if any) sits in the window's footer bar, or as a caption under the
  device.

  Switching records crossfades the frame (ProjectsScene wraps it in a keyed
  motion cell).
*/

// The image, held invisible until it has loaded + decoded, then faded in — so a
// cold first visit never shows it painting in half-drawn.
function Shot({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`screen-frame-img${loaded ? " is-loaded" : ""}`}
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
  const alt = `${project.title} preview`;

  if (preview.device === "phone") {
    return (
      <figure className="screen-frame is-device device-phone" aria-label={alt}>
        <div className="phone" aria-hidden="true">
          <span className="phone-btn phone-btn-mute" />
          <span className="phone-btn phone-btn-vol phone-btn-vol-up" />
          <span className="phone-btn phone-btn-vol phone-btn-vol-down" />
          <span className="phone-btn phone-btn-power" />
          <div className="phone-screen">
            <Shot src={preview.screenshot} alt={alt} />
          </div>
        </div>
        {preview.note && <figcaption className="device-note">{preview.note}</figcaption>}
      </figure>
    );
  }

  if (preview.device === "tablet") {
    return (
      <figure className="screen-frame is-device device-kiosk" aria-label={alt}>
        <div className="kiosk" aria-hidden="true">
          <div className="kiosk-tablet">
            <span className="kiosk-cam" />
            <div className="kiosk-screen">
              <Shot src={preview.screenshot} alt={alt} />
            </div>
          </div>
          <span className="kiosk-neck" />
          <span className="kiosk-base" />
        </div>
        {preview.note && <figcaption className="device-note">{preview.note}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className="screen-frame" aria-label={alt}>
      <div className="screen-frame-bar">
        <span className="screen-frame-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="screen-frame-name">{project.title}</span>
      </div>
      <div className="screen-frame-body">
        <Shot src={preview.screenshot} alt={alt} />
      </div>
      {preview.note && <figcaption className="screen-frame-note">{preview.note}</figcaption>}
    </figure>
  );
}
