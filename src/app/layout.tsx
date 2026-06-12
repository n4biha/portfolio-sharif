import type { Metadata } from "next";
import { Nunito, Anton, Courier_Prime, Caveat, Bungee } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Nabiha — Portfolio",
  description:
    "The retro cut-out collage portfolio of Nabiha — about, experience, and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${anton.variable} ${courier.variable} ${caveat.variable} ${bungee.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
