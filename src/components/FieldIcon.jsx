/*
  Small line icon shown beside a project "field" tag (Data Science, Computer
  Vision, etc.). Keyed by the field label; falls back to a generic tag icon.
  Shared by the desktop liner-notes and the mobile project card.
*/

function Svg({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ICONS = {
  "Data Science": (
    <Svg>
      <rect x="5" y="12" width="3.2" height="7" rx="0.6" fill="currentColor" stroke="none" />
      <rect x="10.4" y="8.5" width="3.2" height="10.5" rx="0.6" fill="currentColor" stroke="none" />
      <rect x="15.8" y="5" width="3.2" height="14" rx="0.6" fill="currentColor" stroke="none" />
    </Svg>
  ),
  "Computer Vision": (
    <Svg>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.7" />
    </Svg>
  ),
  "Full-Stack ML": (
    <Svg>
      <path d="M12 3 2.5 7.5 12 12l9.5-4.5L12 3Z" />
      <path d="M2.5 12 12 16.5 21.5 12" />
      <path d="M2.5 16.5 12 21 21.5 16.5" />
    </Svg>
  ),
  "Health AI": (
    <Svg>
      <path d="M12 20s-7-4.35-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
    </Svg>
  ),
};

const DEFAULT_ICON = (
  <Svg>
    <path d="M4 4h7l9 9-7 7-9-9V4Z" />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
  </Svg>
);

export default function FieldIcon({ label }) {
  return ICONS[label] ?? DEFAULT_ICON;
}
