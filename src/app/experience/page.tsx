import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ExperienceScene from "@/components/ExperienceScene";

export const metadata: Metadata = {
  title: "Experience — Climb My Journey",
  description:
    "Climb my journey — Nabiha's experiences as an interactive scrapbook climbing wall.",
};

// The Experience page: a whole new dark theme (the climbing-wall pegboard). For
// now this is just the themed canvas + the nav with "Experience" ringed in blue;
// the climbing route, holds, and scrapbook cards get built on top from here.
export default function ExperiencePage() {
  return (
    <>
      <Navbar theme="dark" active="experience" />
      <main className="climb-wall relative min-h-screen w-full overflow-hidden">
        <ExperienceScene />
      </main>
    </>
  );
}
