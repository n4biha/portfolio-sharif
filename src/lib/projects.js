/*
  Projects → polaroids pinned to the gallery wall. `id` matches an entry in
  GALLERY (GalleryWall.jsx), which controls where each polaroid sits. Each project
  is framed as a snapshot: a short caption under the photo, then the full story in
  the ProjectCard that slides in when the polaroid is clicked.
  `photo` is a placeholder for now — drop a real path in /public/images later.
*/
export const PROJECTS = {
  "scrapbook-portfolio": {
    title: "Scrapbook Portfolio",
    year: "2025",
    type: "Personal Site",
    caption: "this very site!",
    description:
      "An interactive, hand-made portfolio: a cut-out paper name that scatters in, a climbing-wall experience timeline, and scroll-revealed pages — all stitched together with GSAP and Lenis.",
    tech: ["Next.js", "React", "GSAP", "Lenis", "Framer Motion"],
    links: { live: "#", repo: "#" },
    notes: [
      "Everything is built from scratch — no template.",
      "Favourite detail: the scatter-in name.",
    ],
    photo: null,
  },
  "data-dashboard": {
    title: "Insight Dashboard",
    year: "2024",
    type: "Data Viz",
    caption: "numbers → stories",
    description:
      "A dashboard that turns messy CSV exports into clean, interactive charts. Upload a file and it auto-detects schema, suggests visualisations, and lets you drill into the story behind the numbers.",
    tech: ["Python", "Streamlit", "Pandas", "Plotly"],
    links: { live: "#", repo: "#" },
    notes: [
      "Built in a weekend, used for months.",
      "Schema auto-detection was the fun part.",
    ],
    photo: null,
  },
  "study-buddy": {
    title: "Study Buddy",
    year: "2024",
    type: "Mobile App",
    caption: "late-night idea ✦",
    description:
      "A spaced-repetition study app with shared decks and streaks. Friends can study the same set and nudge each other to keep their streaks alive.",
    tech: ["React Native", "TypeScript", "Supabase"],
    links: { live: "#", repo: "#" },
    notes: [
      "First time shipping to the App Store.",
      "Streaks are weirdly motivating.",
    ],
    photo: null,
  },
  "next-thing": {
    title: "Next Thing",
    year: "2025 →",
    type: "In Progress",
    caption: "coming soon!",
    description:
      "Something new I'm tinkering with. Check back soon — or peek at the repo to follow along as it takes shape.",
    tech: ["TBD"],
    links: { live: "#", repo: "#" },
    notes: ["Still figuring out the shape of it.", "Ideas welcome."],
    photo: null,
  },
};
