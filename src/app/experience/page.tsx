import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ExperienceScene from "@/components/ExperienceScene";
import ExperienceMobile from "@/components/ExperienceMobile";
import CursorTrail from "@/components/CursorTrail";
import StandalonePage from "@/components/StandalonePage";

export const metadata: Metadata = {
  title: "Experience — Climb My Journey",
  description:
    "Climb my journey — Nabiha's experiences as an interactive scrapbook climbing wall.",
};

// The Experience page: the dark climbing-wall theme — the pegboard canvas, the nav
// with "Experience" ringed in blue, the route of rocks and the logbook. On phones,
// StandalonePage swaps all of this for the phone home page's paper shell around
// the phone Experience list.
export default function ExperiencePage() {
  return (
    <StandalonePage active="experience" mobile={<ExperienceMobile />}>
      <CursorTrail variant="chalk" />
      <Navbar theme="dark" active="experience" />
      <main className="climb-wall relative min-h-screen w-full overflow-hidden">
        <ExperienceScene />
      </main>
    </StandalonePage>
  );
}
