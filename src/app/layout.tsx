import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import Chatbot from "@/components/Chatbot";
import dynamic from "next/dynamic";
import { SimulationProvider } from "@/context/SimulationContext";

import EarthBackground from "@/components/EarthBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UrbanCarbon Twin",
  description: "AI-powered climate intelligence dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050a06] text-white min-h-screen`}
      >

        <SimulationProvider>
          {/* 3D Earth Background */}
          <EarthBackground />

          {/* UI Content */}
          <div className="relative z-10">
            {children}
          </div>
        </SimulationProvider>

      </body>
    </html>
  );
}