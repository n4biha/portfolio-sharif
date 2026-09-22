"use client";

import { useRef } from "react";
import Navbar from "./Navbar";
import MobileFooter from "./MobileFooter";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/*
  Wrapper for the standalone /experience and /projects routes.

  Desktop: renders `children` — the page's own scene tree — untouched.
  Phones (≤768px, once mounted): swaps in the SAME paper shell the phone home
  page uses (HomeMobile) around this route's phone section (`mobile`): the .m-flow
  tokens + cream paper, a fixed light navbar, and the sign-off footer. Without
  this, the phone section rendered inside the desktop shell — cream cards with no
  background, ink text on the dark wall, the dark navbar over the heading.

  Same first-render-desktop rule as ScrollRevealExperience → HomeMobile: the
  server (and the first client render) show the desktop tree so hydration
  matches; the swap happens in an effect. No redirect to /#experience — the phone
  home page ignores the hash, so a deep link would just land at the top.
*/

// Its OWN component so it only ever mounts on phones: useScrollReveal reads
// ref.current once, in an effect keyed on the ref object — called from the
// switch below it would run while the desktop branch was showing, find nothing,
// and never arm the fade-up. (HomeMobile works for the same reason.)
function PhoneShell({ active, children }) {
  const ref = useRef(null);
  useScrollReveal(ref);
  return (
    <div className="m-flow m-flow--route" ref={ref}>
      {/* `fixed`: the route scrolls. No onNav → the links route normally. The
          <header> must stay a direct child of .m-flow for its paper fade. */}
      <Navbar fixed theme="light" active={active} />
      <main>{children}</main>
      <MobileFooter />
    </div>
  );
}

export default function StandalonePage({ active, mobile, children }) {
  const { isMobile, mounted } = useIsMobile();
  if (mounted && isMobile) return <PhoneShell active={active}>{mobile}</PhoneShell>;
  return children;
}
