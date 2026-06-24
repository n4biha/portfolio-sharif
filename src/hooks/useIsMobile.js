"use client";

import { useEffect, useState } from "react";

/*
  Phone detection for swapping in the dedicated mobile UI (≤768px).
  Returns { isMobile, mounted }:
   - `mounted` is false on the server and the first client render, so callers
     render the desktop tree first (matches SSR → no hydration mismatch) and only
     swap to mobile once we're sure of the viewport.
*/
export function useIsMobile(query = "(max-width: 768px)") {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsMobile(mq.matches);
    update();
    setMounted(true);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return { isMobile, mounted };
}
