"use client";

import { useEffect, useRef } from "react";
import AlbumCover from "./AlbumCover";
import { CATEGORIES } from "@/lib/projects";

/*
  The browsing area: category filter tabs, then a wooden shelf holding the album
  covers (filtered). Lamp / plant / books decor frame the shelf. The albums sit in
  a horizontal row that scrolls if it overflows, with little crate dots underneath.
*/
export default function RecordShelf({
  projects,
  selectedId,
  onSelect,
  category,
  onCategory,
}) {
  const rowRef = useRef(null);

  /*
    Wheel/trackpad → sideways shelf scroll. Two reasons this needs a real
    listener rather than native behaviour:
      1. a mouse wheel only produces deltaY, which won't move a
         horizontal-only container on its own;
      2. the home flow's pager listens for wheel on window and preventDefaults
         it to glide between screens, so without stopping propagation here the
         page would change instead of the shelf moving.
    At either end we bow out and let the pager have the event, so the shelf
    never traps the scroll.
  */
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return undefined;

    const onWheel = (e) => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return; // everything fits — nothing to scroll
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!delta) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= max - 1;
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return; // hand it back
      e.preventDefault();
      e.stopPropagation();
      el.scrollLeft += delta;
    };

    /*
      Click-and-drag the shelf sideways, like sliding real records along a
      plank. Only bound for mouse/pen — touch already scrolls natively and
      hijacking it would fight the momentum.
    */
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    // the desktop page renders at 80% zoom, so pointer (screen) pixels and the
    // shelf's own layout pixels differ; convert or the shelf lags the cursor
    const pxRatio = () => {
      const rect = el.getBoundingClientRect();
      return el.offsetWidth ? rect.width / el.offsetWidth : 1;
    };

    const canScroll = () => el.scrollWidth - el.clientWidth > 1;

    const onPointerDown = (e) => {
      if (e.pointerType === "touch" || !canScroll()) return;
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture?.(e.pointerId);
      el.classList.add("is-dragging");
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = startScroll - dx / pxRatio();
    };

    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      el.releasePointerCapture?.(e.pointerId);
      el.classList.remove("is-dragging");
    };

    // a real drag shouldn't also select whichever record you released over,
    // but a plain click still should
    const onClickCapture = (e) => {
      if (moved > 5) {
        e.preventDefault();
        e.stopPropagation();
      }
      moved = 0;
    };

    // keep the grab cursor honest: only show it when there's overflow
    const syncDraggable = () => el.classList.toggle("is-draggable", canScroll());
    syncDraggable();
    const ro = new ResizeObserver(syncDraggable);
    ro.observe(el);

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      ro.disconnect();
    };
  }, [projects.length]);

  return (
    <div className="record-shelf-area">
      {/* category crate tabs */}
      <div className="crate-tabs" role="tablist" aria-label="Filter projects by category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            className={`crate-tab${category === c ? " is-on" : ""}`}
            onClick={() => onCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* the shelf itself */}
      <div className="record-shelf">
        {/* warm decor */}
        <span className="shelf-lamp" aria-hidden="true">
          <span className="lamp-glow" />
          <span className="lamp-shade" />
          <span className="lamp-stand" />
        </span>
        <span className="shelf-plant" aria-hidden="true">
          <span className="plant-pot" />
          <span className="plant-leaf l1" />
          <span className="plant-leaf l2" />
          <span className="plant-leaf l3" />
        </span>

        <div className="shelf-row" ref={rowRef}>
          {projects.map((p) => (
            <AlbumCover
              key={p.id}
              project={p}
              selected={p.id === selectedId}
              onSelect={onSelect}
            />
          ))}
          {projects.length === 0 && (
            <p className="shelf-empty hand">no records in this crate yet…</p>
          )}
        </div>

        <span className="shelf-lip" aria-hidden="true" />
      </div>

      {/* crate dots — quick visual of how many are in the current crate */}
      <div className="shelf-dots" aria-hidden="true">
        {projects.map((p) => (
          <span key={p.id} className={`shelf-dot${p.id === selectedId ? " is-on" : ""}`} />
        ))}
      </div>
    </div>
  );
}
