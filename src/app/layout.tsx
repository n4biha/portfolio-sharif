import type { Metadata, Viewport } from "next";
import { Nunito, Anton, Courier_Prime, Caveat, Bungee, Bricolage_Grotesque, Oswald, Bebas_Neue, Inter, Fredoka } from "next/font/google";
import "./globals.css";

// Body text — clean and readable
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

// Display face for the cut-out letter fallback
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });

// Typewriter monospace for the intro text block
const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Handwriting for journal annotations + chalk notes on the climbing wall
const caveat = Caveat({ variable: "--font-hand", subsets: ["latin"] });

// Retro display face for the "Projects on Repeat" record room (title + labels)
const bungee = Bungee({ variable: "--font-retro", subsets: ["latin"], weight: "400" });

// Climbing-wall + route-popup face (scoped to .experience-section via --font-hand)
const bricolage = Bricolage_Grotesque({ variable: "--font-climb", subsets: ["latin"] });

// Tall condensed display face for the Experience-page "EXPERIENCE" wordmark
const oswald = Oswald({ variable: "--font-condensed", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

// Editorial typography for the experience route popup: Bebas Neue for the company
// title only, Inter for everything else (labels, body, metadata, pills).
const bebas = Bebas_Neue({ variable: "--font-display", subsets: ["latin"], weight: "400" });
const inter = Inter({ variable: "--font-body", subsets: ["latin"] });

// Soft rounded display face for the full-screen Smiski sign-off.
const fredoka = Fredoka({ variable: "--font-footer-display", subsets: ["latin"], weight: ["600", "700"] });

export const metadata: Metadata = {
  title: "Nabiha — Portfolio",
  description:
    "The retro cut-out collage portfolio of Nabiha — about, experience, and projects.",
};

// `viewport-fit=cover` populates env(safe-area-inset-*), letting the nav pad
// itself below the browser chrome / notch instead of being covered by it.
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${anton.variable} ${courier.variable} ${caveat.variable} ${bungee.variable} ${bricolage.variable} ${oswald.variable} ${bebas.variable} ${inter.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
