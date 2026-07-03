import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "City Heart Tours | Authentic Cape Breton Experiences",
  description: "Experience the real Cape Breton with Jaswinder Singh. Offering private and small-group tours of the Cabot Trail, Louisbourg, and more.",
};

import WhatsAppButton from '@/components/WhatsAppButton';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <main>{children}</main>
        <WhatsAppButton variant="floating" />
      </body>
    </html>
  );
}
