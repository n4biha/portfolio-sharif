/*
  The five route holds → "routes" on the wall. `id` matches ROUTE in
  ClimbingWall.jsx (bottom "start" to top "future"); grades climb as the route
  gets higher. Each experience is framed as a climbing route's beta, not a job.
  `photo` is a placeholder for now (drop a real path in later).
*/
export const EXPERIENCES = {
  "code-ninjas": {
    company: "Code Ninjas",
    role: "Code Instructor",
    grade: "V1",
    location: "STEM Education",
    firstAscent: "2021 – 2022",
    routeType: "Teaching · JavaScript · Mentorship",
    description:
      "Coached kids through building their first games in JavaScript — turning tricky concepts into small, confidence-building wins.",
    techniques: ["JavaScript", "Teaching", "Game Logic", "Mentorship", "Patience"],
    diagram: ["Basics", "Logic", "Build", "Ship a Game"],
    photo: null,
    caption: "where it started!",
    notes: [
      "First time teaching real skills.",
      "Loved the lightbulb moments.",
    ],
  },
  datastory: {
    company: "DataStory Consulting",
    role: "Data Consultant",
    grade: "V2",
    location: "Analytics Consulting",
    firstAscent: "2022 – 2023",
    routeType: "Python · SQL · Data Viz",
    description:
      "Cleaned and modeled messy client data, then built dashboards that told the story behind the numbers and actually moved decisions.",
    techniques: ["Python", "SQL", "Data Viz", "Stakeholder Alignment"],
    diagram: ["Clean", "Model", "Visualize", "Decide"],
    photo: null,
    caption: "numbers → stories",
    notes: [
      "Learned to make data speak.",
      "First taste of stakeholder work.",
    ],
  },
  behavioral: {
    company: "UC Berkeley",
    role: "Behavioral Research Assistant",
    grade: "V3",
    location: "Cognitive Science Lab",
    firstAscent: "2023 – 2024",
    routeType: "Research · Statistics · Study Design",
    description:
      "Designed and ran behavioral studies, then analyzed the results to understand how people actually make decisions.",
    techniques: ["R", "Study Design", "Statistics", "Research", "Analysis"],
    diagram: ["Question", "Design", "Run", "Analyze"],
    photo: null,
    caption: "asking lots of why",
    notes: [
      "Big learning curve, big payoff.",
      "Fell for the research process.",
    ],
  },
  "pm-intern": {
    company: "Dabble Health",
    role: "Product Management Intern",
    grade: "V5",
    location: "Healthcare Technology",
    firstAscent: "May 2026 – Present",
    routeType: "Product Strategy · Analytics · User Research",
    description:
      "Partnered with cross-functional teams to identify user needs, define product requirements, and ship features that improve engagement and outcomes.",
    techniques: [
      "User Research",
      "Product Strategy",
      "Roadmapping",
      "SQL",
      "Analytics",
      "Stakeholder Alignment",
    ],
    diagram: ["Research", "Analytics", "Roadmapping", "Product Launch"],
    photo: null,
    caption: "an amazing team!",
    notes: [
      "Learned how data influences product decisions.",
      "First time working cross-functionally.",
      "Discovered my love for product.",
    ],
  },
  future: {
    company: "Next Summit",
    role: "Future Goals",
    grade: "V7",
    location: "Data + Product",
    firstAscent: "2025 →",
    routeType: "Data Science · AI / ML · Product",
    description:
      "Data + product roles where I can build things people genuinely love. The route keeps going up — and that's the fun part.",
    techniques: ["Data Science", "AI / ML", "Product", "Storytelling"],
    diagram: ["Learn", "Build", "Ship", "Summit"],
    photo: null,
    caption: "onward + up",
    notes: ["The route keeps going up.", "Excited for the next crux."],
  },
};
