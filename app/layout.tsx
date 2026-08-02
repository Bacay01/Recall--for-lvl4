import React from "react";
import { Fredoka, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500"],
});

export const metadata = {
  title: "Recall",
  description: "Turn your notes into flashcards, instantly.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans bg-bg text-dark">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;