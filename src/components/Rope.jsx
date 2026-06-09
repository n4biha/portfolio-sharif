"use client";

/*
  A realistic climbing rope hanging on the wall (decorative): two thin twisted
  strands with a frayed tip. The twist + shading live in globals.css (`.rope-*`).
  `style` positions it.
*/
export default function Rope({ style, className = "" }) {
  return (
    <div className={`rope-rig ${className}`} style={style} aria-hidden="true">
      <div className="rope-strand rope-strand--a" />
      <div className="rope-strand rope-strand--b" />
      <div className="rope-fray" />
    </div>
  );
}
