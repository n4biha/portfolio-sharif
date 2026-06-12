"use client";

import { useEffect, useState } from "react";
import { playTypeKey } from "@/lib/sfx";

/*
  Types `text` out one character at a time once `start` is true, with a blinking
  "|" caret that disappears the moment the message finishes. Sentence ends and
  line breaks get a slightly longer pause so it reads naturally. Honors
  prefers-reduced-motion by showing the full text immediately (no caret).

  Typing (and its key-click sound) halts when `stop` is true or the tab is hidden
  — e.g. the visitor scrolls off to the experience section or leaves the site
  mid-intro — and resumes where it left off if they come back.
*/
export default function IntroText({ text, start, speed = 25, stop = false, instant = false }) {
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
    // instant: show the whole message at once with no typing + no sound (used when
    // the page is reloaded straight onto another section, so About stays silent).
    if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    // Paused (left the intro / tab hidden) or finished → schedule nothing, so no
    // further characters type and no more key clicks play. The cleanup below also
    // cancels any already-pending keystroke, so the sound stops immediately.
    if (stop || hidden || count >= text.length) return;
    // Natural pauses: longer after line breaks and sentence punctuation.
    const justTyped = text[count - 1];
    const delay =
      justTyped === "\n" ? 220 : ".!?".includes(justTyped) ? 150 : speed;
    const id = window.setTimeout(() => {
      // Click for the character that's about to appear (text[count]); skip
      // whitespace so spaces/newlines stay silent, like a real typewriter.
      const nextChar = text[count];
      if (nextChar && !/\s/.test(nextChar)) playTypeKey(count);
      setCount((n) => n + 1);
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
