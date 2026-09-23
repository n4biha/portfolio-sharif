"use client";

import { useEffect, useRef } from "react";
import AlbumCover from "./AlbumCover";

/*
  The browsing area: a wooden shelf holding every album cover, framed by the lamp
  and the plant. The albums sit in a horizontal row that scrolls if it overflows.
*/
export default function RecordShelf({ projects, selectedId, onSelect }) {
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
    let tracking = false; // pointer is down, but it may still turn out to be a click
    let dragging = false; // it moved far enough to be a real drag
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    // how far the pointer travels before we call it a drag instead of a click
    const DRAG_SLOP = 5;

    // the desktop page renders at 80% zoom, so pointer (screen) pixels and the
    // shelf's own layout pixels differ; convert or the shelf lags the cursor
    const pxRatio = () => {
      const rect = el.getBoundingClientRect();
      return el.offsetWidth ? rect.width / el.offsetWidth : 1;
    };

    const canScroll = () => el.scrollWidth - el.clientWidth > 1;

    const onPointerDown = (e) => {
      if (e.pointerType === "touch" || !canScroll()) return;
      tracking = true;
      dragging = false;
      moved = 0;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };

    /*
      Capture is claimed here rather than on pointerdown. Capturing retargets the
      click that follows to this container, so grabbing it up front would stop
      every plain click from ever reaching the album button underneath.
    */
    const onPointerMove = (e) => {
      if (!tracking) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (!dragging) {
        if (moved <= DRAG_SLOP) return; // still just a click
        dragging = true;
        el.setPointerCapture?.(e.pointerId);
        el.classList.add("is-dragging");
      }
      el.scrollLeft = startScroll - dx / pxRatio();
    };

    const endDrag = (e) => {
      if (!tracking) return;
      tracking = false;
      if (dragging) {
        dragging = false;
        el.releasePointerCapture?.(e.pointerId);
        el.classList.remove("is-dragging");
      }
    };

    // a real drag shouldn't also select whichever record you released over,
    // but a plain click still should
    const onClickCapture = (e) => {
      if (moved > DRAG_SLOP) {
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
        </div>

        <span className="shelf-lip" aria-hidden="true" />
      </div>

    </div>
  );
}
