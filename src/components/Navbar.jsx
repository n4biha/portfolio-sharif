"use client";

import { useState } from "react";
import Link from "next/link";
import SketchCircle from "./SketchCircle";

// Experience is its own page (/experience); the rest point back to home
// sections. `id` is used to mark the active item (gets the sketch circle).
const links = [
  { id: "about", label: "About", href: "/#about" },
  { id: "experience", label: "Experience", href: "/experience" },
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "skills", label: "Skills", href: "/#skills" },
  { id: "fun", label: "Fun Stuff", href: "/#fun" },
];

// A neutral serif close to the mockup (kept separate from the display fonts)
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

/*
  Shared top navigation. `theme` flips the colours for the light cream home vs
  the dark climbing-wall page; `active` (a link id) rings that item with the
  hand-drawn blue circle.
*/
export default function Navbar({ theme = "light", active = null, onNav }) {
  const [open, setOpen] = useState(false);
  const dark = theme === "dark";
  const textColor = dark ? "text-[var(--wall-ink)]" : "text-ink";
  const barColor = dark ? "bg-[var(--wall-ink)]" : "bg-ink";

  const label = (link) => (
    <span className="relative inline-block">
      {link.label}
      {active === link.id && <SketchCircle />}
    </span>
  );

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
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        {/* Wordmark / home link */}
        <Link
          href="/"
          onClick={(e) => handleClick("home", e)}
          className={`font-anton text-2xl uppercase tracking-wide ${textColor} transition-opacity hover:opacity-70`}
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
                className={`text-lg uppercase tracking-wide ${textColor} transition-opacity hover:opacity-60`}
              >
                {label(link)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-0.5 w-6 ${barColor}`} />
          <span className={`h-0.5 w-6 ${barColor}`} />
          <span className={`h-0.5 w-6 ${barColor}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="flex flex-col items-end gap-2 px-6 pb-4 md:hidden">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                onClick={(e) => handleClick(link.id, e)}
                style={serif}
                className={`text-lg uppercase tracking-wide ${textColor}`}
              >
                {label(link)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
