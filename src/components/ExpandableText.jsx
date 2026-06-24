"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

/*
  Collapsible body copy. Shows `lines` lines by default and — ONLY when the text
  actually overflows that height — floats an inline toggle ("Show more") onto the
  end of the last visible line, so it reads as part of the sentence rather than a
  button on its own row. Clicking smoothly animates the height open and swaps the
  toggle to "Show less"; collapsing returns to exactly `lines` lines.

  Overflow is measured against the real rendered text via a ref (re-measured on
  resize), so the toggle is hidden entirely when the text fits.

  Styling: the consumer passes `className` to set font-size/line-height/color and
  the matching `--exp-lh` (line-height number); see `.expandable-text` /
  `.expandable-toggle` in globals.css.
*/
export default function ExpandableText({
  text,
  lines = 3,
  className = "",
  moreLabel = "Show more",
  lessLabel = "Show less",
}) {
  const ref = useRef(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Measure whether the text exceeds `lines`, independent of current state, and
  // reset to collapsed when the text changes. Re-runs on resize (responsive card).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const lineH = parseFloat(getComputedStyle(el).lineHeight) || 24;
      const maxH = lineH * lines + 2;
      const prev = el.style.maxHeight;
      el.style.maxHeight = `${maxH}px`;
      const over = el.scrollHeight > el.clientHeight + 2;
      el.style.maxHeight = prev;
      setOverflowing(over);
    };
    setExpanded(false);
    // drop any leftover inline max-height (e.g. "none" set by onTransitionEnd
    // after a previous expand) so the CSS clamp controls the height again —
    // otherwise the text renders fully spilled out while still showing "Show more".
    el.style.maxHeight = "";
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text, lines]);

  // Animate height between the 3-line clamp and full height. The card is
  // auto-height, so animating this child grows/shrinks the whole panel smoothly.
  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) {
      setExpanded((v) => !v);
      return;
    }
    const lineH = parseFloat(getComputedStyle(el).lineHeight) || 24;
    const collapsedH = lineH * lines;
    if (!expanded) {
      el.style.maxHeight = `${collapsedH}px`;
      setExpanded(true);
      requestAnimationFrame(() => {
        el.style.maxHeight = `${el.scrollHeight}px`;
      });
    } else {
      el.style.maxHeight = `${el.scrollHeight}px`;
      requestAnimationFrame(() => {
        el.style.maxHeight = `${collapsedH}px`;
        setExpanded(false);
      });
    }
  }, [expanded, lines]);

  // Hand height control back to CSS once the transition settles.
  const onTransitionEnd = (e) => {
    if (e.propertyName !== "max-height") return;
    const el = ref.current;
    if (el) el.style.maxHeight = expanded ? "none" : "";
  };

  const clamped = overflowing && !expanded;

  return (
    <div
      ref={ref}
      onTransitionEnd={onTransitionEnd}
      style={{ "--exp-lines": lines }}
      className={`expandable-text${clamped ? " is-clamped" : ""}${expanded ? " is-expanded" : ""} ${className}`}
    >
      {clamped && (
        <button type="button" className="expandable-toggle" onClick={toggle}>
          {moreLabel}
        </button>
      )}
      {text}
      {overflowing && expanded && (
        <button type="button" className="expandable-toggle is-less" onClick={toggle}>
          {lessLabel}
        </button>
      )}
    </div>
  );
}
