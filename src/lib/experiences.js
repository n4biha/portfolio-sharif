/*
  The five route holds → experiences on the wall. `id` matches ROUTE in
  ClimbingWall.jsx (bottom "start" upward). Each entry drives the
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
    index: "02",
    company: "Morton Lab @ USC",
    roleName: "Computational Neuroscience Researcher",
    roleTag: "Research",
    grade: "5.9",
    date: "May 2024 – Aug 2024",
    location: "Los Angeles, CA",
    employmentType: "Internship",
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
    index: "03",
    company: "UC Berkeley - Data Science Education",
    roleName: "Podcast Operations Manager",
    roleTag: "Manager",
    grade: "5.10a",
    date: "Feb 2026 – Present",
    location: "Berkeley, CA",
    employmentType: "Work-Study",
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
    index: "04",
    company: "Dabble Health",
    roleName: "Product Management & Data",
    roleTag: "Intern",
    grade: "5.10c",
    date: "May 2026 – August 2026",
    location: "",
    employmentType: "Internship",
    about:
      "Dabble Health is an early-stage digital health startup building MindClear, a cognitive health app for women in menopause. As a Product Management Intern, I helped build the product from the ground up. Our team recruited 80+ women through Meta ads and onboarded them into a 4-week product study. I conducted 20+ onboarding interviews to understand users' cognitive symptoms, routines, frustrations, and unmet needs. This was my first internship after starting college, and it showed me how impactful product work can be when it moves beyond planning and into real users’ hands. I worked closely with the CEO, engineering, and clinical teams, and it was exciting to see my work directly shape parts of the app that women are using today. I grew my technical skills, but more importantly, I learned how user research, design, data, and product decisions come together to build something useful.",
    contributions: [
      "Personally conducted 20+ user onboarding interviews to uncover pain points, validate assumptions, and guide feature development",
      "Within my team, I served as Product Lead, where I helped design the coordinator dashboard and used user experiences, feedback, and data to guide the next round of features after the trial period."
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
    index: "05",
    company: "Frontier Technology Institute",
    roleName: "Project Manager",
    roleTag: "Part-time",
    grade: "5.11a",
    // TODO: fill in from Nabiha — about, contributions, skills, highlight
    date: "July 2026 – Present",
    location: "",
    employmentType: "Part-time",
    about: "",
    contributions: [],
    skills: [],
    highlight: {
      photo: null,
      caption: null,
    },
  },
};
