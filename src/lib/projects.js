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
      screenshot: "/images/neurotrace-preview.png",
    },
    liveDemoUrl: "https://github.com/n4biha/parkinsons_model",
    liveDemoLabel: "GitHub",
    caseStudyUrl: "#",
  },
  {
    id: "marketmap",
    title: "MarketMap",
    subtitle: "AI-powered market research agent",
    category: "Product / Data",
    fields: ["Agentic AI", "LLM Pipeline", "RAG"],
    year: "2024",
    coverImage: null,
    coverStyle: { bg: "#2f2a3d", ink: "#f3ecff", accent: "#c9a3ff", motif: "chart" },
    linerNotes:
      "An AI-powered market research tool that turns any app idea into a structured opportunity brief by autonomously researching competitors, user sentiment, and market gaps across five live data sources.",
    tools: ["Python", "LangChain/LangGraph", "Anthropic Claude (Opus)", "ChromaDB", "FastAPI", "Next.js/TypeScript", "Pydantic"],
    technicalHighlights:
      "Multi-agent LangGraph pipeline (Scout → Analyst → Strategist → Formatter) with conditional routing, a RAG layer over real-time scraped data (Tavily, App Store, Google Play, Hacker News, Product Hunt), LLM-based relevance filtering to ground competitor extraction in evidence, typed Pydantic schemas enforcing structured output at every stage, and a full-stack delivery layer (FastAPI + Next.js) connecting the pipeline to a live product UI.",
    demoPreview: {
      title: "MarketMap",
      tagline: "Any app idea into an opportunity brief.",
      accent: "#c9a3ff",
      kind: "dashboard",
      screenshot: "/images/marketmap-preview.jpg",
    },
    liveDemoUrl: "https://www.youtube.com/watch?v=nNAQZ_gS6GI",
    liveDemoLabel: "Video Demo",
    caseStudyUrl: "#",
  },
  {
    id: "portfolio",
    title: "Nabiha's Portfolio",
    subtitle: "My website portfolio",
    category: "Web App",
    year: "2026",
    coverImage: null,
    coverStyle: { bg: "#481f30", ink: "#f8e7ef", accent: "#e388ab", motif: "web" },
    linerNotes:
      "My creative take on a personal portfolio, built around the things I love. The About page is a scrapbook I'm piecing together about myself; since I'm a rock climber, you climb up the wall to explore my experiences; and because I love music, my projects live in a record room you can browse and play.",
    tools: ["Next.js", "React", "TypeScript", "Framer Motion", "GSAP", "Lenis", "Tailwind CSS"],
    technicalHighlights:
      "Designed and built end to end in Next.js (App Router), React, and TypeScript, styled entirely with Tailwind CSS. I designed the full visual system myself, from the scrapbook and record-room scenes to the CSS-drawn art and album covers, plus a responsive layout with its own mobile experience. Motion comes from Framer Motion and GSAP with Lenis smooth scrolling, and the projects and experience sections are driven from typed data files.",
    demoPreview: {
      title: "Nabiha",
      tagline: "Projects on repeat.",
      accent: "#e388ab",
      kind: "site",
      screenshot: "/images/portfolio-preview.svg",
    },
    liveDemoUrl: "https://github.com/n4biha/portfolio-sharif",
    liveDemoLabel: "GitHub",
    caseStudyUrl: "#",
  },
  {
    id: "mindclear",
    title: "MindClear Dashboard",
    subtitle: "UI redesign + interview analytics",
    category: "Product / Data",
    fields: ["Frontend Development", "Data Visualization"],
    year: "2025",
    coverImage: null,
    coverStyle: { bg: "#173a44", ink: "#e7f3f4", accent: "#4fbdb0", motif: "chart" },
    linerNotes:
      "During my internship, I was tasked with improving our product development coordinator dashboard. I redesigned the UI to make it cleaner and more consistent, reworked the charts so trends and drop-offs were easier to understand at a glance, and built a new Interview Analytics section that turns AI-parsed interview transcripts into structured insights around participant concerns, sentiment, and research-hypothesis alignment.",
    tools: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Firestore", "Google Gemini API", "Recharts"],
    technicalHighlights:
      "Improved the coordinator dashboard by rebuilding its UI into a reusable component system and restructuring the layout so the most important numbers are easy to scan. Designed and built a new Interview Analytics section end to end: Next.js API routes that aggregate Gemini-parsed interview transcripts across participants, a lightweight stats library (Wilson score intervals and chi-square) powering hypothesis-alignment confidence, and a searchable quote bank.",
    demoPreview: {
      title: "MindClear",
      tagline: "Cleaner dashboard, clearer insight.",
      accent: "#4fbdb0",
      kind: "dashboard",
      screenshot: "/images/mindclear-preview.jpg",
      note: "Not real data, just a project reference.",
    },
    liveDemoUrl: null,
    caseStudyUrl: "#",
  },
];

// Filter tabs above the shelf — "All" plus each distinct category (in first-seen order).
export const CATEGORIES = [
  "All",
  ...PROJECTS.reduce((acc, p) => (acc.includes(p.category) ? acc : [...acc, p.category]), []),
];
