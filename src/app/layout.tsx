import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "City Heart Tours | Authentic Cape Breton Experiences",
  description: "Experience the real Cape Breton with Jaswinder Singh. Offering private and small-group tours of the Cabot Trail, Louisbourg, and more.",
};

import NavBar from "@/components/NavBar";
import WhatsAppButton from '@/components/WhatsAppButton';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <NavBar />
        {/* Global coordinate side stamps */}
        <div className="left-margin-stamp">SYDNEY // 46.13° N</div>
        <div className="right-margin-stamp">CABOT TRAIL // 60.40° W</div>
        <main>{children}</main>
        <WhatsAppButton variant="floating" />
      </body>
    </html>
  );
}
