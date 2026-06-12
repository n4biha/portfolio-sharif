import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProjectsScene from "@/components/ProjectsScene";

export const metadata: Metadata = {
  title: "Projects — A Wall of Snapshots",
  description:
    "A few things Nabiha has built — a polaroid gallery wall; click a snapshot to read each project's story.",
};

// The Projects page: just the polaroid gallery on one screen (no cover / scroll
// reveal). The home page also shows this as the third paged screen; this route is
// the standalone version for direct links and the other pages' nav.
export default function ProjectsPage() {
  return (
    <>
      <Navbar theme="dark" active="projects" />
      <main className="projects-section">
        <ProjectsScene />
      </main>
    </>
  );
}
