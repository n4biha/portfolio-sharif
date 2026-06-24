"use client";

import { useState } from "react";
import Link from "next/link";
import SketchCircle from "./SketchCircle";
import DoodleUnderline from "./DoodleUnderline";

// Experience is its own page (/experience); the rest point back to home
// sections. `id` is used to mark the active item (gets the sketch circle).
const links = [
  { id: "about", label: "About", href: "/#about" },
  { id: "experience", label: "Experience", href: "/experience" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "fun", label: "Fun Stuff", href: "/#fun" },
];

// A neutral serif close to the mockup (kept separate from the display fonts)
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

/**
 * Shared top navigation. `theme` flips the colours for the light cream home vs
 * the dark climbing-wall page; `active` (a link id) rings that item with the
 * hand-drawn blue circle.
 *
 * @param {{ theme?: "light" | "dark", active?: string | null, onNav?: (id: string) => void, fixed?: boolean }} props
 */
export default function Navbar({ theme = "light", active = null, onNav, fixed = false, arrived = true }) {
  const [open, setOpen] = useState(false);
  const dark = theme === "dark";
  const textColor = dark ? "text-[var(--wall-ink)]" : "text-ink";
  const barColor = dark ? "bg-[var(--wall-ink)]" : "bg-ink";

  // Active-tab marker: Experience keeps the hand-drawn circle; Projects gets the
  // doodle underline (with a subtle lift). It only renders while Projects is the
  // active tab — i.e. once you've reached the projects screen/page.
  const label = (link) => {
    const isActive = active === link.id;
    const underlined = isActive && link.id === "projects";
    return (
      <span className={`relative inline-block${underlined ? " nav-underlined" : ""}`}>
        {link.label}
        {/* `arrived` holds the ring back until the glide to the wall has fully
            landed, so its stroke never starts drawing (and never shows its
            round-cap dot) mid-scroll. */}
        {isActive && link.id === "experience" && arrived && <SketchCircle />}
        {underlined && <DoodleUnderline />}
      </span>
    );
  };

  // On the one-page homepage, nav items + the wordmark smooth-scroll within the
  // page (handled by the parent via `onNav`) instead of routing to a hash that
  // doesn't exist. Without `onNav` (e.g. the /experience route) links route normally.
  const handleClick = (id, e) => {
    setOpen(false);
    if (onNav) {
      e.preventDefault();
      onNav(id);
    }
  };

  return (
    <header className={`${fixed ? "fixed" : "absolute"} inset-x-0 top-0 z-50`}>
      {/* paddingTop clears the browser's tab/URL bar (or a device notch) in
          full-screen/standalone modes by honouring the safe-area inset, while
          never dropping below the 1.5rem baseline. */}
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-6"
        style={{ paddingTop: "max(1.5rem, calc(env(safe-area-inset-top, 0px) + 0.75rem))" }}
      >
        {/* Wordmark / home link */}
        <Link
          href="/"
          onClick={(e) => handleClick("home", e)}
          className={`font-anton text-2xl uppercase tracking-wide ${textColor} transition-[color,opacity] duration-300 hover:opacity-70`}
        >
          Nabiha
        </Link>

        {/* Desktop links */}
        <ul className="hidden gap-8 md:flex">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                onClick={(e) => handleClick(link.id, e)}
                style={serif}
                className={`text-lg uppercase tracking-wide ${textColor} transition-[color,opacity] duration-300 hover:opacity-60`}
              >
                {label(link)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle — circular outline button (mobile only) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border ${
            dark ? "border-[var(--wall-ink)]/45" : "border-ink/35"
          } md:hidden`}
        >
          <span className={`h-[2px] w-5 origin-center rounded ${barColor} transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-[2px] w-5 rounded ${barColor} transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`h-[2px] w-5 origin-center rounded ${barColor} transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu — clean slide-down panel, themed to the page (mobile only) */}
      {open && (
        <nav
          className={`m-menu md:hidden ${dark ? "m-menu--dark" : "m-menu--light"}`}
          aria-label="Mobile"
        >
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  onClick={(e) => handleClick(link.id, e)}
                  style={serif}
                  className={`m-menu-link ${textColor}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
