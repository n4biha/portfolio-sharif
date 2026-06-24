/*
  The five route holds → experiences on the wall. `id` matches ROUTE in
  ClimbingWall.jsx (bottom "start" to top "future"). Each entry drives the
  editorial popup (RouteBetaBoard): an eyebrow index, the company title, a split
  role (name + tag), a metadata row (date · location · type), an ABOUT paragraph
  (clamped to 3 lines with an inline "Show more"), KEY CONTRIBUTIONS bullets, a
  HIGHLIGHTS snapshot (photo + caption), and a skills row.

  `highlight.photo` is an image path (drop one into /public/images and point to
  it); until then the HIGHLIGHTS area shows a clean placeholder.
*/
export const EXPERIENCES = {
  "code-ninjas": {
    index: "01",
    company: "Code Ninjas",
    roleName: "Code Sensei",
    roleTag: "Instructor",
    grade: "5.8",
    date: "2023 – 2026",
    location: "Los Angeles, CA",
    employmentType: "Part-time",
    about:
      "Code Ninjas is a global youth education organization that helps children discover technology through coding, game development, robotics, and creative projects. I joined as a Code Sensei when I was in 10th grade, and overtime, the dojo became a place where I grew alongside the students I taught. I’ve guided students through JavaScript, Lua, and C# while developing curricula and leading camps in animation, robotics, and game development. Beyond teaching, I manage weekend operations for 30–40 students, maintain classroom technology, communicate student progress with parents, and design graphics that make the dojo a more engaging place to learn.",
    contributions: [
      "Mentored 300+ students through Code Ninjas’ coding curriculum and a diverse range of STEM camps.",
      "Developed specialized curricula tailored to students with disabilities and different learning needs.",
    ],
    skills: ["JavaScript", "Lua", "C#", "Teaching", "Game Logic", "Mentorship", "Design"],
    highlight: {
      photos: ["/images/code-ninjas-1.jpg", "/images/code-ninjas-2.jpg"],
      caption: "Teaching a junior circuitry camp for kids ages 4-7 yrs old!",
    },
  },
  datastory: {
    index: "02",
    company: "Morton Lab @ USC",
    roleName: "Computational Neuroscience Researcher",
    roleTag: "Research",
    grade: "5.9",
    date: "May 2024 – Aug 2024",
    location: "Los Angeles, CA",
    employmentType: "Internship",
    about:
      "At the University of Southern California I conducted computational neuroscience research, using Drosophila as a model organism to study how neuronal dysfunction can contribute to movement and functional impairments. My work connected experimental neuroscience with computational analysis, including RNA-sequencing analyses, Gene Ontology analysis, and RNA-sequencing workflows in R. Through this role, I gained experience applying programming, data analysis, and biological research methods to understand how changes at the molecular level can affect behavior.",
    contributions: [
      "Performed RNA analysis and Gene Ontology analysis to connect molecular changes with broader biological functions and neurological outcomes.",
      "Conducted experimental neuroscience work including brain dissections, immunofluorescence microscopy, geotaxis assays, and qPCR analyses.",
    ],
    skills: ["R", "GO Analysis", "Data Visualization", "Research Presentation"],
    highlight: {
      photo: "/images/morton-lab.jpg",
      caption: "Presented my research at a final symposium at USC!",
    },
  },
  behavioral: {
    index: "03",
    company: "FitnessGram",
    roleName: "Data Product Analyst",
    roleTag: "Consultant",
    grade: "5.10a",
    date: "March 2025 – Present",
    location: "Berkeley, CA",
    employmentType: "Contract",
    about:
      "Designed and ran behavioral studies, then analyzed the results to understand how people actually make decisions. I owned pieces of study design end-to-end, from framing the question through collecting data and running the statistics behind the findings.",
    contributions: [
      "Designed and ran behavioral studies",
      "Analyzed results to surface decision patterns",
      "Owned study design from question to analysis",
    ],
    skills: ["R", "Study Design", "Statistics", "Analysis"],
    highlight: {
      photo: null,
      caption: "Running behavioral studies in the Cognitive Science lab.",
    },
  },
  "pm-intern": {
    index: "04",
    company: "Dabble Health",
    roleName: "Product Manager",
    roleTag: "Intern",
    grade: "5.10c",
    date: "May 2026 – Present",
    location: "Healthcare Tech",
    employmentType: "Internship",
    about:
      "Partnered with cross-functional teams to identify user needs, define product requirements, and ship features that improve engagement and outcomes. I learned firsthand how data influences product decisions, working across design, engineering, and stakeholders to move ideas from research to launch.",
    contributions: [
      "Defined product requirements from user research",
      "Shipped features that improved engagement",
      "Drove decisions with product analytics",
    ],
    skills: ["User Research", "Product Strategy", "Roadmapping", "SQL", "Analytics"],
    highlight: {
      photo: null,
      caption: "Shipping product features with a cross-functional team.",
    },
  },
  future: {
    index: "05",
    company: "Next Summit",
    roleName: "Future Goals",
    roleTag: "Onward",
    grade: "5.12",
    date: "2025 →",
    location: "Data + Product",
    employmentType: null,
    about:
      "Data + product roles where I can build things people genuinely love. The route keeps going up, and that's the fun part — I'm excited for the next crux and everything I'll learn climbing toward it.",
    contributions: [
      "Build data + product experiences people love",
      "Keep learning across data science and ML",
      "Ship work that genuinely helps people",
    ],
    skills: ["Data Science", "AI / ML", "Product", "Storytelling"],
    highlight: {
      photo: null,
      caption: "Chasing the next summit in data and product.",
    },
  },
};
