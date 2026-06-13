import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sagar-koirala-portfolio",
  description:
    "Portfolio of Sagar koirala, a professional Hardware & Embedded Systems Engineer. Specializing in high-speed PCB design, firmware development, RTOS, IoT architectures, and end-end embedded solutions.",
  keywords: [
    "Hardware Engineer",
    "Embedded Systems",
    "PCB Design",
    "Firmware Developer",
    "RTOS",
    "Microcontrollers",
    "IoT Architecture",
  ],
  authors: [{ name: "Sagar Koirala" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white">
        <div className="relative flex flex-col flex-grow">
          <Navbar />
          {children}
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
