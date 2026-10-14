/*
  Monoline icon for a project, keyed by its `coverStyle.motif` — the simple
  glyph the desktop carousel card and the Now Playing disc label carry (the
  busier Motif illustration stays on the phone list). Drawn in currentColor so
  the parent sets the accent.
*/

function Svg({ children }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ICONS = {
  // a brain: two lobes with a few folds
  brain: (
    <Svg>
      <path d="M22 10.5a6 6 0 0 0-8.4 5.4 5.6 5.6 0 0 0-3 9.2 5.6 5.6 0 0 0 3.8 7.8A5.8 5.8 0 0 0 22 36.5V10.5Z" />
      <path d="M26 10.5a6 6 0 0 1 8.4 5.4 5.6 5.6 0 0 1 3 9.2 5.6 5.6 0 0 1-3.8 7.8A5.8 5.8 0 0 1 26 36.5V10.5Z" />
      <path d="M22 18c-2.4.4-4 1.8-4.6 3.8M22 28c-2.6-.2-4.6.8-5.8 2.6M26 18c2.4.4 4 1.8 4.6 3.8M26 28c2.6-.2 4.6.8 5.8 2.6" />
    </Svg>
  ),
  // a magnifier
  lens: (
    <Svg>
      <circle cx="21" cy="21" r="10.5" />
      <path d="M28.8 28.8 38 38" strokeWidth="2.6" />
    </Svg>
  ),
  // rising bars
  chart: (
    <Svg>
      <rect x="11" y="24" width="6" height="13" rx="1.2" fill="currentColor" stroke="none" opacity="0.55" />
      <rect x="21" y="17" width="6" height="20" rx="1.2" fill="currentColor" stroke="none" opacity="0.8" />
      <rect x="31" y="10" width="6" height="27" rx="1.2" fill="currentColor" stroke="none" />
    </Svg>
  ),
  // code brackets
  web: (
    <Svg>
      <path d="M17 15 8 24l9 9" />
      <path d="m31 15 9 9-9 9" />
      <path d="m27 11-6 26" opacity="0.7" />
    </Svg>
  ),
  // a lotus: three petals on a base
  pause: (
    <Svg>
      <path d="M24 33c-4.4-3-6.2-7.4-6-13 3.6 1.2 5.4 4.2 6 7.2.6-3 2.4-6 6-7.2.2 5.6-1.6 10-6 13Z" />
      <path d="M24 33c-6.2 1-11.4-1.4-14.6-5.6 4.6-1.6 9.4-.6 12.6 2.4M24 33c6.2 1 11.4-1.4 14.6-5.6-4.6-1.6-9.4-.6-12.6 2.4" />
      <path d="M13 36.5c3.4 1.6 7.2 2.4 11 2.4s7.6-.8 11-2.4" />
    </Svg>
  ),
  // a tablet with a tick
  kiosk: (
    <Svg>
      <rect x="11" y="8" width="26" height="32" rx="3.5" />
      <path d="M21 36h6" />
      <path d="m18.5 22 4 4 7.5-8" />
    </Svg>
  ),
};

const DEFAULT_ICON = (
  <Svg>
    <circle cx="24" cy="24" r="11" />
    <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" />
  </Svg>
);

export default function ProjectIcon({ motif }) {
  return ICONS[motif] ?? DEFAULT_ICON;
}
