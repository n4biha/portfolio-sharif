/*
  Every experience on the wall, oldest → newest. Two tiers:

   • MAIN — the four most relevant roles. Each is a blue route hold in
     ClimbingWall.jsx (`id` matches ROUTE there, bottom "start" upward) and is
     numbered by `index` (the card's "Experience 0N" eyebrow).
   • SIDE — `side: true`. Off the route; listed in the "where it started" logbook
     clipped to the wall (WallLogbook.jsx). No `index`. To promote one to a rock,
     drop `side`, give it an `index`, and add it to ROUTE (and the reverse).

  Either way the entry drives the same editorial popup (RouteBetaBoard): an
  eyebrow, the company title, a split role (name + tag), a metadata row
  (date · location · type), an ABOUT paragraph (clamped to 3 lines with an inline
  "Show more"), KEY CONTRIBUTIONS bullets, a HIGHLIGHTS snapshot (photo +
  caption), and a skills row.

  `highlight.photo` is an image path (drop one into /public/images and point to
  it); until then the HIGHLIGHTS area shows a clean placeholder.

  `compact: true` entries get the small card instead: just the company, role,
  metadata row, and a one-sentence `brief` — no about / contributions /
  highlight / skills. To grow one into a full card later, drop `compact` and
  `brief` and fill in those fields.

  Optional short display names, for the tight spots on the wall (each falls back
  to the full field): `label` — the chalk name beside a rock / the logbook row
  title (else `company`); `logRole` — the logbook's role line (else `roleName`).
*/
export const EXPERIENCES = {
  "code-ninjas": {
    side: true,
    company: "Code Ninjas",
    roleName: "Code Sensei",
    roleTag: "Instructor",
    grade: "5.8",
    date: "2023 – 2026",
    location: "Los Angeles, CA",
    employmentType: "Part-time",
    about:
      "Code Ninjas is a global youth education organization that helps children discover technology through coding, game development, robotics, and creative projects. I joined as a Code Sensei when I was in 10th grade, and over time, the dojo became a place where I grew alongside the students I taught. I’ve guided students through JavaScript, Lua, and C# while developing curricula and leading camps in animation, robotics, and game development. Beyond teaching, I manage weekend operations for 30–40 students, maintain classroom technology, communicate student progress with parents, and design graphics that make the dojo a more engaging place to learn.",
    contributions: [
      "Mentored 300+ students through Code Ninjas’ coding curriculum and a diverse range of STEM camps.",
      "Developed specialized curricula tailored to students with disabilities and different learning needs.",
    ],
    skills: ["JavaScript", "Lua", "C#", "Teaching", "Game Logic", "Mentorship", "Design"],
    highlight: {
      photos: ["/images/code-ninjas-1.jpg"],
      // pan the crop down so the lower kid's face isn't clipped and the circuit
      // board they're holding stays the focus (tune the % if needed)
      focus: "center 70%",
      caption: "Teaching a junior circuitry camp for kids ages 4-7 yrs old!",
    },
  },
  datastory: {
    side: true,
    company: "Morton Lab @ USC",
    roleName: "Computational Neuroscience Researcher",
    logRole: "Neuroscience Researcher",
    roleTag: "Internship",
    grade: "5.9",
    date: "May 2024 – Aug 2024",
    location: "Los Angeles, CA",
    employmentType: "Part-time",
    about:
      "At the University of Southern California I conducted computational neuroscience research, using Drosophila as a model organism to study how neuronal dysfunction can contribute to movement and functional impairments. My work connected experimental neuroscience with computational analysis, including RNA-sequencing analyses and Gene Ontology workflows in R. Through this role, I gained experience applying programming, data analysis, and biological research methods to understand how changes at the molecular level can affect behavior.",
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
    side: true,
    company: "UC Berkeley - Data Science Education",
    label: "UC Berkeley · DS Ed Podcast",
    roleName: "Podcast Operations Manager",
    roleTag: "Work-Study",
    grade: "5.10a",
    date: "Feb 2026 – Present",
    location: "Berkeley, CA",
    employmentType: "Part-time",
    about:
      "The Data Science Education Podcast is a Berkeley Computing, Data Science, and Society project focused on making data science education more accessible to all. I manage episode production and operations by coordinating with guests, planning interviews, co-hosting conversations, editing episodes, and preparing launches across our media platforms. This role has strengthened my project management, organization, audience awareness, and content judgment. It has taught me how to shape interview flow and design clear, engaging episodes for viewers. On a personal level, it has also pushed me out of my comfort zone. As someone who used to feel nervous initiating conversations and speaking with new people, this role gave me a new lens on professional growth. I’ve had the chance to meet guests from different backgrounds, hear new perspectives, and build confidence in conversations that I’ll carry with me throughout my career.",
      contributions: [
      "Shipped 10 complete episodes to a 3.1K+ subscriber and follower audience, helping drive 80K+ cumulative views and plays across Substack and Spotify.",
      "Managed guest communication, interview planning, co-hosting, editing, and release execution while working with professors, students, program directors, researchers, and industry guests.",
    ],
    skills: ["Project Management", "Episode Production", "Content Strategy", "Audience Awareness", "Adobe Premiere Pro"],
    highlight: {
      photo: "/images/podcast-thumbnail.png",
      // square logo → show it whole (no crop) on a matching navy so the sides blend
      fit: "contain",
      bg: "#002676",
      caption: "Cover art for the Data Science Education Podcast.",
    },
  },
  "pm-intern": {
    index: "01",
    company: "Dabble Health",
    roleName: "Product Management & Data",
    roleTag: "Internship",
    grade: "5.10c",
    date: "May 2026 – August 2026",
    location: "",
    employmentType: "Part-time",
    about:
      "Dabble Health is an early-stage digital health startup building MindClear, a cognitive health app for women navigating menopause. I joined as a Product Management Intern during the product's first build round, before MindClear had ever launched. Our team put it in front of its first real users, recruiting 80+ women through Meta ads into a 4-week study and personally running 20+ onboarding interviews to understand their cognitive symptoms, routines, and unmet needs. Working alongside the CEO, engineering, and clinical teams, I helped turn that early feedback into product decisions that shaped features women use today. Working with Dabble Health was my first internship after coming into college, and it taught me how user research, design, and data come together to get a product into real people's hands for the first time.",
    contributions: [
      "As Product Lead, designed the coordinator dashboard clinical staff used to monitor 80+ study participants' engagement and cognitive-symptom trends, turning raw trial data into an at-a-glance view that informed weekly product and care decisions.",
      "Tracked onboarding-completion, retention, and feature-usage metrics across the 4-week trial to measure MVP performance and pinpoint where users dropped off, translating findings into concrete feature changes for the next build."
    ],
   skills: ["Product Strategy","User Research","Product Analytics","Dashboard Design","Feature Development","Cross-functional Collaboration","Data Analysis"],
    highlight: {
      photo: "/images/dabblehealth_logo.png",
      // wide logo on white → show it whole (no crop) on a matching white bg
      fit: "contain",
      bg: "#ffffff",
      caption: null,
    },
  },
  "frontier-pm": {
    index: "02",
    company: "Frontier Technology Institute",
    label: "Frontier Tech Institute",
    roleName: "Technical Project Manager",
    roleTag: "",
    grade: "5.11a",
    date: "July 2026 – Present",
    location: "",
    employmentType: "Part-time",
    about:
      "Frontier Technology Institute runs a Department of Defense funded data science research program that opens real research opportunities to students from under-resourced communities. As a Project Manager, I led the student research teams through the program, from their first day of training to a finished technical project. I drove each team to their deadlines and mentored students directly so they could build the skills to carry the research themselves.",
    contributions: [
      "Led the program's technical training, taking the full cohort from data analysis and machine learning pipelines to predictive modeling and GitHub, so every student could run and document their own research.",
      "Managed 20 concurrent research projects across health, economics, and sports, structuring the work into a defined 6-stage cycle to achieve 100% on-time project completion in 3 weeks.",
      "Designed and built an HTML/JavaScript dashboard tracking 20 students across 4 mentors, ingesting their daily Google Doc logs to auto-derive status and blockers into one prioritized view, and cutting weekly review by over 80%."
    ],
    skills: ["Project Management", "Curriculum Design", "Mentorship", "Process Design", "Python", "Machine Learning", "Data Analysis", "GitHub"],
    highlight: {
      photo: "/images/dsrp-class-pic.png",
      // landscape Zoom screenshot on a dark background — show it whole on a
      // matching dark bg so it doesn't get cropped
      fit: "contain",
      bg: "#121316",
      caption: "A few of my students from the research cohort!",
    },
  },
  "eko-health": {
    index: "03",
    compact: true,
    company: "Eko Health",
    roleName: "AI Product",
    roleTag: "Internship",
    grade: "5.11c",
    date: "Aug 2026 – Present",
    location: "Emeryville, CA",
    employmentType: "",
    brief:
      "Product strategy and development for Eko’s clinical AI — digital cardiac and pulmonary health technology.",
  },
  ibm: {
    index: "04",
    compact: true,
    company: "IBM",
    roleName: "Applied AI Engineer",
    roleTag: "Contract",
    grade: "5.12a",
    date: "Sep 2026 – Present",
    location: "",
    employmentType: "",
    brief:
      "Working on AI agent evals — testing and measuring how well AI agents actually perform.",
  },
};

// The two tiers as ordered lists (file order = oldest → newest), each entry
// carrying its `id`, so components never hard-code which role lives where.
const pick = (test) =>
  Object.entries(EXPERIENCES)
    .filter(([, exp]) => test(exp))
    .map(([id, exp]) => ({ id, ...exp }));

export const MAIN_EXPERIENCES = pick((exp) => !exp.side);
export const SIDE_EXPERIENCES = pick((exp) => exp.side);

// One wording for the side tier everywhere it's named: the logbook heading, the
// card eyebrow, and the mobile group label (each cases it in CSS).
export const SIDE_HEADING = "Where it started";
