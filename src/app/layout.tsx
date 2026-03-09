"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // On définit les pages où la Navbar NE doit PAS apparaître
  let isNavbarAllowed = true;
  switch (pathname) {
    case "/":
    case "/register":
    case "/login":
      isNavbarAllowed = false;
      break;
    default:
      isNavbarAllowed = true;
      break;
  }

  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white`}
      >
        {/* On affiche la Navbar UNIQUEMENT si on n'est pas sur l'accueil */}
        {isNavbarAllowed && <Navbar />}

        <main>{children}</main>
      </body>
    </html>
  );
}
