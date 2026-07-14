import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProjectsScene from "@/components/ProjectsScene";
import CursorTrail from "@/components/CursorTrail";

export const metadata: Metadata = {
  title: "Projects — Projects on Repeat",
  description:
    "A record room of things Nabiha has built — pull an album off the shelf to play each project's story.",
};

// The Projects page: the record room on one screen. The home page also shows
// this as the third paged screen; this route is the standalone version for
// direct links and the other pages' nav. The footer
// band sits below the screen — scroll down to reveal it.
export default function ProjectsPage() {
  return (
    <>
      <CursorTrail variant="motes" />
      <Navbar theme="dark" active="projects" />
      <main className="projects-section">
        <ProjectsScene />
      </main>
    </>
  );
}
