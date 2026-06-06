import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "AutoResearch AI - BRD Generator",
  description: "Enterprise multi-agent Business Requirement Document (BRD) generation tool powered by Gemini 2.5 Pro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark selection:bg-accent/30 selection:text-accent">
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} font-sans bg-background text-foreground min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
