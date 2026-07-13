"use client";

import { useEffect, useState } from "react";

/*
  Turbo typewriter: types `text` out in small BURSTS of characters (rather than
  one at a time) once `start` is true, with a blinking "|" caret that disappears
  the moment the message finishes. Same personality as a per-letter typewriter —
  caret and natural pauses at sentence ends and line breaks — but the whole
  intro lands in ~2.5s instead of 12s+. Honors prefers-reduced-motion by showing
  the full text immediately (no caret).

  Typing halts when `stop` is true or the tab is hidden — e.g. the visitor
  scrolls off to the experience section or leaves the site mid-intro — and
  resumes where it left off if they come back.
*/
const CHUNK = 3; // characters revealed per tick

export default function IntroText({ text, start, speed = 18, stop = false, instant = false }) {
  // Starts empty and fills in as it types. (Starting at 0 is the whole point —
  // initialising to text.length would make it render "finished" and never run.)
  const [count, setCount] = useState(0);
  const [hidden, setHidden] = useState(false);
  const done = count >= text.length;

  // Pause the moment the tab/window is hidden (navigated away from the site).
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!start) return;
    // instant: show the whole message at once with no typing (used when the page
    // is reloaded straight onto another section).
    if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    // Paused (left the intro / tab hidden) or finished → schedule nothing, so no
    // further characters type. The cleanup below also cancels any already-pending
    // tick, so typing stops immediately.
    if (stop || hidden || count >= text.length) return;
    // Natural pauses: if the last burst crossed a line break or sentence end,
    // breathe a little before the next one (shorter than the per-letter delays).
    const justTyped = text.slice(Math.max(0, count - CHUNK), count);
    const delay = justTyped.includes("\n")
      ? 120
      : /[.!?]/.test(justTyped)
        ? 80
        : speed;
    const id = window.setTimeout(() => {
      setCount((n) => Math.min(n + CHUNK, text.length));
    }, delay);
    return () => window.clearTimeout(id);
  }, [start, stop, hidden, count, text, speed, instant]);

  return (
    <p
      className="whitespace-pre-wrap font-bold text-ink"
      style={{ fontFamily: "var(--font-courier), 'Courier New', monospace" }}
    >
      {text.slice(0, count)}
      {start && !done && (
        <span aria-hidden="true" className="caret">
          |
        </span>
      )}
    </p>
  );
}
