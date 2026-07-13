"use client";

import { useEffect, useRef, useState } from "react";

const LOAD_FAILSAFE_MS = 8000;

const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

function waitForWindowLoad() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
}

function isInViewport(image) {
  const rect = image.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth &&
    window.getComputedStyle(image).display !== "none"
  );
}

async function decodeImage(image) {
  if (!image.complete) {
    await new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
  }

  if (image.naturalWidth > 0 && typeof image.decode === "function") {
    await image.decode().catch(() => undefined);
  }
}

export default function SiteLoadGate({ children }) {
  const preloadRootRef = useRef(null);
  const releasedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const html = document.documentElement;
    html.dataset.siteLoading = "true";

    const release = () => {
      if (cancelled || releasedRef.current) return;
      releasedRef.current = true;
      delete html.dataset.siteLoading;
      setReady(true);
    };

    const failsafe = window.setTimeout(release, LOAD_FAILSAFE_MS);

    const prepare = async () => {
      await waitForWindowLoad();
      await document.fonts?.ready;

      // Let viewport detection, restored-hash scrolling, and responsive tree
      // selection settle before deciding which images are actually visible.
      await nextFrame();
      await nextFrame();

      if (cancelled) return;
      const images = Array.from(preloadRootRef.current?.querySelectorAll("img") ?? [])
        .filter(isInViewport);
      await Promise.all(images.map(decodeImage));
      await nextFrame();
      release();
    };

    prepare().catch(release);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      delete html.dataset.siteLoading;
    };
  }, []);

  return (
    <>
      <div
        key={ready ? "site-ready" : "site-preload"}
        ref={ready ? undefined : preloadRootRef}
        className={ready ? "site-ready-shell" : "site-preload-shell"}
        aria-hidden={ready ? undefined : "true"}
        inert={ready ? undefined : true}
      >
        {children}
      </div>

      {!ready && (
        <div className="site-load-screen" role="status" aria-live="polite">
          <span className="site-load-status">Loading portfolio</span>
        </div>
      )}
    </>
  );
}
