"use client";

import { motion } from "framer-motion";

/*
  One album cover on the shelf. The art is CSS/SVG-generated from the project's
  `coverStyle` (bg + ink + accent + motif) until a real `coverImage` is dropped in.
  Hover lifts it with a warm glow + a handwritten "play this one" note; the selected
  album gets a "now playing" sticker and sits slightly forward.
*/

// little per-project cover illustration, tinted with the cover's accent/ink
function Motif({ motif, ink, accent }) {
  const s = { stroke: ink, fill: "none", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (motif) {
    case "brain": // a brain-shaped neural network
      return (
        <svg viewBox="0 0 100 60" className="cover-motif" aria-hidden="true">
          <path
            d="M50 8 C34 4 20 12 20 24 C10 28 12 42 22 44 C24 54 40 56 50 50 C60 56 76 54 78 44 C88 42 90 28 80 24 C80 12 66 4 50 8 Z"
            fill={accent}
            fillOpacity="0.18"
            stroke={accent}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <g stroke={ink} strokeWidth="1.4" opacity="0.85">
            <line x1="34" y1="20" x2="50" y2="30" />
            <line x1="66" y1="20" x2="50" y2="30" />
            <line x1="28" y1="38" x2="50" y2="30" />
            <line x1="72" y1="38" x2="50" y2="30" />
            <line x1="34" y1="20" x2="28" y2="38" />
            <line x1="66" y1="20" x2="72" y2="38" />
            <line x1="44" y1="46" x2="50" y2="30" />
          </g>
          <g fill={ink}>
            <circle cx="34" cy="20" r="3.2" />
            <circle cx="66" cy="20" r="3.2" />
            <circle cx="28" cy="38" r="3.2" />
            <circle cx="72" cy="38" r="3.2" />
            <circle cx="44" cy="46" r="3.2" />
          </g>
          <circle cx="50" cy="30" r="4.2" fill="#ffd66e" />
        </svg>
      );
    case "transit": // a weaving train line with stops
      return (
        <svg viewBox="0 0 100 60" className="cover-motif" aria-hidden="true">
          <path d="M8 46 C30 46 30 18 52 18 C74 18 74 40 92 40" {...s} stroke={accent} strokeDasharray="2 7" />
          {[[8,46],[30,32],[52,18],[74,26],[92,40]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="4" fill={accent} stroke={ink} strokeWidth="1.5" />
          ))}
        </svg>
      );
    case "chart": // bar chart + upward trend arrow (market research / business)
      return (
        <svg viewBox="0 0 100 60" className="cover-motif" aria-hidden="true">
          {/* axes */}
          <path d="M18 12 V48 H84" {...s} stroke={ink} opacity="0.7" />
          {/* bars rising left to right */}
          {[[28,18],[42,26],[56,22],[70,34]].map(([x,h],i)=>(
            <rect key={i} x={x} y={48-h} width="9" height={h} fill={accent} opacity={0.55+0.12*i} />
          ))}
          {/* upward trend line with arrowhead */}
          <path d="M26 40 L46 30 L60 34 L80 18" {...s} stroke={ink} />
          <path d="M80 18 L72 18 M80 18 L80 26" {...s} stroke={ink} />
        </svg>
      );
    case "web": // a browser window with code brackets
      return (
        <svg viewBox="0 0 100 60" className="cover-motif" aria-hidden="true">
          <rect x="22" y="12" width="56" height="36" rx="4" fill={accent} fillOpacity="0.16" stroke={accent} strokeWidth="2" />
          <line x1="22" y1="23" x2="78" y2="23" {...s} stroke={accent} strokeWidth="2" />
          <g fill={ink}>
            <circle cx="28" cy="17.5" r="1.8" />
            <circle cx="34" cy="17.5" r="1.8" />
            <circle cx="40" cy="17.5" r="1.8" />
          </g>
          <g {...s} stroke={ink} strokeWidth="2.2">
            <path d="M46 30 L40 36 L46 42" />
            <path d="M54 30 L60 36 L54 42" />
          </g>
        </svg>
      );
    case "moon": // crescent + stars
      return (
        <svg viewBox="0 0 100 60" className="cover-motif" aria-hidden="true">
          <path d="M62 12 A20 20 0 1 0 62 50 A15 15 0 1 1 62 12 Z" fill={accent} />
          {[[20,18],[30,40],[16,46]].map(([x,y],i)=>(
            <path key={i} d={`M${x} ${y-4} L${x+1.4} ${y-1} L${x+4} ${y} L${x+1.4} ${y+1} L${x} ${y+4} L${x-1.4} ${y+1} L${x-4} ${y} L${x-1.4} ${y-1} Z`} fill={ink} />
          ))}
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 100 60" className="cover-motif" aria-hidden="true">
          <path d="M50 54 C50 30 36 16 22 12 C30 34 38 44 50 54 Z" fill={accent} />
          <path d="M50 54 C50 30 64 16 78 12 C70 34 62 44 50 54 Z" fill={accent} opacity="0.7" />
          <path d="M50 54 V20" {...s} />
        </svg>
      );
    case "shelf":
      return (
        <svg viewBox="0 0 100 60" className="cover-motif" aria-hidden="true">
          {[14,34].map((y)=>(<line key={y} x1="14" y1={y+14} x2="86" y2={y+14} {...s} stroke={ink} />))}
          {[[20,16],[30,14],[40,18],[58,34],[68,32],[78,36]].map(([x,h],i)=>(
            <rect key={i} x={x} y={(i<3?14:34)+14-h} width="8" height={h} fill={accent} opacity={0.5+0.1*(i%3)} />
          ))}
        </svg>
      );
    case "book":
    default:
      return (
        <svg viewBox="0 0 100 60" className="cover-motif" aria-hidden="true">
          <path d="M50 16 C40 10 24 10 16 14 V46 C24 42 40 42 50 48 Z" fill={accent} />
          <path d="M50 16 C60 10 76 10 84 14 V46 C76 42 60 42 50 48 Z" fill={accent} opacity="0.75" />
          <path d="M50 16 V48" {...s} stroke={ink} />
        </svg>
      );
  }
}

export default function AlbumCover({ project, selected = false, onSelect }) {
  const { bg, ink, accent, motif } = project.coverStyle;
  return (
    <motion.button
      type="button"
      className={`album-cover${selected ? " is-playing" : ""}`}
      style={{ background: bg, color: ink, "--cover-accent": accent }}
      onClick={() => onSelect?.(project.id)}
      aria-label={`Play ${project.title}`}
      aria-pressed={selected}
      initial={false}
      whileHover={{ y: -14, rotate: -1.5, transition: { type: "spring", stiffness: 320, damping: 18 } }}
      whileTap={{ scale: 0.97 }}
    >
      {project.coverImage ? (
        // real art later: object-fit cover fills the sleeve
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.coverImage} alt={project.title} className="cover-photo" />
      ) : (
        <span className="cover-art" aria-hidden="true">
          <span className="cover-band" style={{ background: accent }} />
          <Motif motif={motif} ink={ink} accent={accent} />
        </span>
      )}

      <span className="cover-meta">
        <span className="cover-title">{project.title}</span>
        <span className="cover-cat">{project.category} · {project.year}</span>
      </span>

      {/* now-playing sticker on the selected album */}
      {selected && <span className="cover-sticker hand" aria-hidden="true">now playing</span>}
    </motion.button>
  );
}
