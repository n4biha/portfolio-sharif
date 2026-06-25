/*
  Projects as a record collection — "Projects on Repeat". Each project is an album:
  browse them on the shelf, click one to "play" it (Now Playing record player +
  liner-notes sheet + laptop live preview).

  `coverStyle` drives the CSS-generated album art (no real images yet — drop a path
  into `coverImage` later to override). `motif` picks a simple cover illustration;
  `demoPreview.kind` picks the laptop mock UI.

  Schema per project:
    id, title, subtitle, category, year,
    coverImage (null for now), coverStyle { bg, ink, accent, motif },
    linerNotes, tools[], technicalHighlights,
    demoPreview { title, tagline, accent, kind }, liveDemoUrl, caseStudyUrl
*/

export const PROJECTS = [
  {
    id: "neurotrace",
    title: "NeuroTrace",
    subtitle: "Parkinson's Risk Classifier",
    category: "ML / AI",
    fields: ["Data Science", "Computer Vision", "Full-Stack ML"],
    year: "2025",
    coverImage: null,
    coverStyle: { bg: "#1f3a4d", ink: "#eaf2f5", accent: "#4da6ff", motif: "brain" },
    linerNotes:
      "An explainable machine learning web app that screens for Parkinson's-related risk patterns using both clinical questionnaire data and spiral drawing analysis. The app combines two model outputs into a clear risk interpretation for Parkinson's disease.",
    tools: ["Python", "Streamlit", "Scikit-learn", "PyTorch", "MobileNetV2", "OpenCV", "SHAP", "Pandas", "Plotly", "Gemini API"],
    technicalHighlights:
      "Multi-modal ML pipeline combining a Random Forest clinical model, MobileNetV2 spiral-drawing CNN, SHAP explainability, and late-fusion risk logic.",
    demoPreview: {
      title: "NeuroTrace",
      tagline: "Screen early. Understand the risk.",
      accent: "#4da6ff",
      kind: "dashboard",
    },
    liveDemoUrl: "https://parkinsons-screener.streamlit.app/",
    caseStudyUrl: "#",
  },
  {
    id: "studio-terraluna",
    title: "Studio Terraluna",
    subtitle: "Creative Studio Website",
    category: "Web App",
    year: "2024",
    coverImage: null,
    coverStyle: { bg: "#2f2a3d", ink: "#f3ecff", accent: "#c9a3ff", motif: "moon" },
    linerNotes:
      "A warm, editorial marketing site for a boutique creative studio — case-study driven, with smooth scroll storytelling and a CMS the team can update themselves.",
    tools: ["Next.js", "TypeScript", "Sanity CMS", "Framer Motion", "Tailwind"],
    technicalHighlights:
      "The case-study reveal where project shots parallax as you read.",
    demoPreview: {
      title: "Studio Terraluna",
      tagline: "Design that feels like dusk.",
      accent: "#c9a3ff",
      kind: "site",
    },
    liveDemoUrl: "#",
    caseStudyUrl: "#",
  },
  {
    id: "crop-companion",
    title: "Crop Companion",
    subtitle: "AI Plant Health Assistant",
    category: "ML / AI",
    year: "2025",
    coverImage: null,
    coverStyle: { bg: "#234032", ink: "#eef6ec", accent: "#7fc98a", motif: "leaf" },
    linerNotes:
      "Snap a photo of a struggling plant and get a diagnosis + care plan. A vision model flags disease and deficiency, then explains the fix in plain language.",
    tools: ["PyTorch", "FastAPI", "React Native", "Expo", "Supabase"],
    technicalHighlights:
      "On-device first pass so it still helps you when the signal in the greenhouse is bad.",
    demoPreview: {
      title: "Crop Companion",
      tagline: "Healthier plants, one photo at a time.",
      accent: "#7fc98a",
      kind: "app",
    },
    liveDemoUrl: "#",
    caseStudyUrl: "#",
  },
  {
    id: "shelf-sense",
    title: "Shelf Sense",
    subtitle: "Smart Inventory for Small Retailers",
    category: "Product / Data",
    year: "2024",
    coverImage: null,
    coverStyle: { bg: "#4a3220", ink: "#f7ecdd", accent: "#e3a857", motif: "shelf" },
    linerNotes:
      "An inventory tool that learns each shop's rhythm and nudges owners before they run out — reorder suggestions, slow-mover alerts, and a dead-simple count flow.",
    tools: ["Next.js", "tRPC", "Prisma", "PostgreSQL", "Recharts"],
    technicalHighlights:
      "The 'reorder by Friday' digest that turns a spreadsheet chore into one tap.",
    demoPreview: {
      title: "Shelf Sense",
      tagline: "Never run out of the good stuff.",
      accent: "#e3a857",
      kind: "dashboard",
    },
    liveDemoUrl: "#",
    caseStudyUrl: "#",
  },
  {
    id: "between-pages",
    title: "Between Pages",
    subtitle: "Reading Tracker",
    category: "Research",
    year: "2023",
    coverImage: null,
    coverStyle: { bg: "#3a2230", ink: "#fce9f0", accent: "#f29bb5", motif: "book" },
    linerNotes:
      "A cozy reading companion: log books, track streaks, and surface gentle stats about what you actually finish vs. what's been on the nightstand for a year.",
    tools: ["React", "Vite", "IndexedDB", "D3.js"],
    technicalHighlights:
      "The year-in-reading wrap-up that feels like a little mixtape of your shelf.",
    demoPreview: {
      title: "Between Pages",
      tagline: "Keep your place, keep the habit.",
      accent: "#f29bb5",
      kind: "app",
    },
    liveDemoUrl: "#",
    caseStudyUrl: "#",
  },
];

// Filter tabs above the shelf — "All" plus each distinct category (in first-seen order).
export const CATEGORIES = [
  "All",
  ...PROJECTS.reduce((acc, p) => (acc.includes(p.category) ? acc : [...acc, p.category]), []),
];
