import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "ABTalks AI Interview Agent | System Showcase",
  description: "Production-ready AI System Architecture for the 31-Day Enterprise AI Engineering Cohort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-midnight text-cream-paper antialiased selection:bg-cyan-accent selection:text-slate-midnight">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
