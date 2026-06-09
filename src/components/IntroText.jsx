"use client";

import { useEffect, useState } from "react";
import { playTypeKey } from "@/lib/sfx";

/*
  Types `text` out one character at a time once `start` is true, with a blinking
  "|" caret that disappears the moment the message finishes. Sentence ends and
  line breaks get a slightly longer pause so it reads naturally. Honors
  prefers-reduced-motion by showing the full text immediately (no caret).
*/
export default function IntroText({ text, start, speed = 55 }) {
  // Starts empty and fills in as it types. (Starting at 0 is the whole point —
  // initialising to text.length would make it render "finished" and never run.)
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    if (count >= text.length) return;
    // Natural pauses: longer after line breaks and sentence punctuation.
    const justTyped = text[count - 1];
    const delay =
      justTyped === "\n" ? 480 : ".!?".includes(justTyped) ? 320 : speed;
    const id = window.setTimeout(() => {
      // Click for the character that's about to appear (text[count]); skip
      // whitespace so spaces/newlines stay silent, like a real typewriter.
      const nextChar = text[count];
      if (nextChar && !/\s/.test(nextChar)) playTypeKey(count);
      setCount((n) => n + 1);
    }, delay);
    return () => window.clearTimeout(id);
  }, [start, count, text, speed]);

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
