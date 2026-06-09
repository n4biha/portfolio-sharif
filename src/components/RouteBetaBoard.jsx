"use client";

import { useEffect, useState } from "react";
import ChalkMark from "./ChalkMark";

/*
  The Route Beta Board — beta for a "route" (an experience), drawn in chalk
  directly onto the SAME climbing wall (no floating panel/card: the container is
  transparent, the wall shows through). The only physical objects are the taped
  polaroid and the taped climber-notes scrap. Slides/fades in gently from the
  right when a hold is clicked; the wall pans slightly left and stays visible.
  Keeps showing the last experience while closing. Styling: globals.css (.beta-*).
*/

// tiny chalk icons for the route-info grid
function Icon({ type }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#cfe6ff",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: "beta-ico",
  };
  if (type === "grade") return <svg {...common}><path d="M3 20 L9 8 L13 15 L16 10 L21 20 Z" /></svg>;
  if (type === "loc") return <svg {...common}><path d="M12 22 C12 22 19 14 19 9 A7 7 0 1 0 5 9 C5 14 12 22 12 22 Z" /><circle cx="12" cy="9" r="2.4" /></svg>;
  if (type === "flag") return <svg {...common}><path d="M6 21 V4" /><path d="M6 5 H18 L15 9 L18 13 H6" /></svg>;
  return <svg {...common}><path d="M5 19 C9 19 9 12 13 12 C17 12 17 5 21 5" /><circle cx="5" cy="19" r="1.6" /><circle cx="21" cy="5" r="1.6" /></svg>;
}

// a large hand-drawn climbing route: start at the bottom, zig-zag up to the
// summit — dashed chalk line, arrowheads, hold circles, labels and markers.
function RouteDiagram({ holds = [] }) {
  const pts = [
    [40, 192], // start (bottom)
    [108, 146],
    [50, 96],
    [120, 40], // summit (top)
  ];
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  // arrowhead (a small up-pointing chevron) at each segment's midpoint
  const arrows = pts.slice(0, -1).map(([x1, y1], i) => {
    const [x2, y2] = pts[i + 1];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const a = Math.atan2(y2 - y1, x2 - x1);
    const len = 9;
    const wing = 0.5;
    return [
      [mx - Math.cos(a - wing) * len, my - Math.sin(a - wing) * len],
      [mx, my],
      [mx - Math.cos(a + wing) * len, my - Math.sin(a + wing) * len],
    ];
  });
  return (
    <svg className="beta-diagram-svg" viewBox="0 0 175 215" aria-hidden="true">
      <g filter="url(#chalkRough)">
        <path d={line} fill="none" stroke="#9fc7ff" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" strokeLinejoin="round" />
        {arrows.map((a, i) => (
          <polyline key={`a${i}`} points={a.map((p) => p.join(",")).join(" ")} fill="none" stroke="#cfe6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={i === pts.length - 1 ? 9 : 7.5} fill="none" stroke="#eef0ee" strokeWidth="2" />
            <circle cx={x} cy={y} r="1.8" fill="#eef0ee" />
          </g>
        ))}
        {/* a little summit flag at the top hold */}
        <path d={`M${pts[3][0]} ${pts[3][1] - 9} L${pts[3][0]} ${pts[3][1] - 24} M${pts[3][0]} ${pts[3][1] - 24} L${pts[3][0] + 14} ${pts[3][1] - 21} L${pts[3][0]} ${pts[3][1] - 17}`} fill="none" stroke="#eef0ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {pts.map(([x, y], i) => (
        <text key={i} x={x < 80 ? x - 12 : x + 14} y={y + 3} className="beta-diagram-label" textAnchor={x < 80 ? "end" : "start"}>
          {holds[i]}
        </text>
      ))}
      <text x={pts[0][0] - 12} y={pts[0][1] + 18} className="beta-diagram-tag" textAnchor="end">START</text>
      <text x={pts[3][0] + 16} y={pts[3][1] - 24} className="beta-diagram-tag">TOP</text>
    </svg>
  );
}

export default function RouteBetaBoard({ experience, onClose }) {
  const open = !!experience;
  const [shown, setShown] = useState(experience ?? null);
  useEffect(() => {
    if (experience) setShown(experience);
  }, [experience]);
  const exp = shown;

  return (
    <div className={`beta-board${open ? " is-open" : ""}`} aria-hidden={!open}>
      {exp && (
        <div className="beta-inner">
          <button className="beta-back" type="button" onClick={onClose}>
            ← back to the wall
          </button>

          {/* header */}
          <h2 className="beta-title">{exp.company}</h2>
          <p className="beta-subtitle">{exp.role}</p>

          {/* route info grid */}
          <dl className="beta-grid">
            <div className="beta-cell">
              <Icon type="grade" />
              <dt>Grade</dt>
              <dd className="beta-grade">{exp.grade}</dd>
            </div>
            <div className="beta-cell">
              <Icon type="loc" />
              <dt>Location</dt>
              <dd>{exp.location}</dd>
            </div>
            <div className="beta-cell">
              <Icon type="flag" />
              <dt>First Ascent</dt>
              <dd>{exp.firstAscent}</dd>
            </div>
            <div className="beta-cell">
              <Icon type="route" />
              <dt>Route Type</dt>
              <dd>{exp.routeType}</dd>
            </div>
          </dl>

          {/* description */}
          <p className="beta-label">ROUTE DESCRIPTION</p>
          <p className="beta-desc">{exp.description}</p>

          {/* route diagram (chalk sketch) */}
          <div className="beta-diagram">
            <RouteDiagram holds={exp.diagram} />
          </div>

          {/* techniques */}
          <p className="beta-label">TECHNIQUES USED</p>
          <ul className="beta-tags">
            {exp.techniques.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          {/* climber notes — taped scrap */}
          <p className="beta-label">CLIMBER NOTES</p>
          <div className="beta-notes">
            <span className="beta-notes-tape" />
            <ul>
              {exp.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>

          {/* chalk annotations + route markings (added over time) */}
          <span className="beta-anno anno-crux">crux →</span>
          <span className="beta-anno anno-growth">growth zone</span>
          <span className="beta-anno anno-fav">favorite move ✦</span>
          <span className="beta-anno anno-keep">keep climbing</span>
          <span className="beta-anno anno-send">send it!</span>
          <span className="beta-anno anno-reach">big reach ↗</span>
          <span className="beta-anno anno-sticky">sticky ✦</span>
          <span className="beta-anno anno-beta">good beta</span>
          <ChalkMark type="star" size={26} strokeWidth={3} className="beta-doodle doodle-star" />
          <ChalkMark type="star" size={18} strokeWidth={3.2} className="beta-doodle doodle-star2" />
          <ChalkMark type="arrowUpRight" size={32} strokeWidth={3} className="beta-doodle doodle-arrow" />
          <ChalkMark type="arrowUp" size={30} strokeWidth={3} className="beta-doodle doodle-arrow2" />
          <ChalkMark type="circle" size={50} strokeWidth={2.2} className="beta-doodle doodle-circ" />
          <ChalkMark type="check" size={28} strokeWidth={3.4} className="beta-doodle doodle-check" />
          <ChalkMark type="x" size={22} strokeWidth={3.2} className="beta-doodle doodle-x" />
          <ChalkMark type="squiggle" size={54} strokeWidth={2.6} className="beta-doodle doodle-squig" />
        </div>
      )}
    </div>
  );
}
