"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import portfolio from "@/data/portfolio.json";
import profilePic from "@/assets/profile.png";

export default function Hero() {
  const { name, title, overview } = portfolio.profile;
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Grounded, factual professional metrics
  const metrics = [
    {
      value: "3.83 / 4.0",
      label: "B.Eng GPA",
      subtitle: "1st Class Honours",
    },
    {
      value: "4+",
      label: "Engineering Roles",
      subtitle: "Space & Embedded",
    },
    {
      value: "5.0 ⭐",
      label: "Upwork Client Rating",
      subtitle: "100% Job Success",
    },
  ];

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative grid grid-cols-1 gap-12 lg:grid-cols-12 items-center pt-2 pb-16 md:pt-4 md:pb-24 overflow-hidden min-h-[75vh]"
    >
      {/* ========================================================
          GLOBAL AMBIENT GRID BACKGROUND (z-0)
         ======================================================== */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden opacity-40 dark:opacity-60"
        style={{
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)",
        }}
      >
        {/* Dynamic interactive ambient hover glow */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.12), transparent 80%)`,
            }}
          />
        )}
        
        {/* Base static dot grid */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#262626_1.5px,transparent_1.5px)] [background-size:24px_24px]" 
        />

        {/* Dynamic interactive highlighted grid dots forming a "hill" around the cursor */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(#10b981_1.8px,transparent_1.8px)] [background-size:24px_24px] transition-opacity duration-300 ease-out" 
          style={{
            maskImage: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
            opacity: isHovered ? 0.75 : 0,
          }}
        />
      </div>

      {/* CSS Animation Keyframes Injector */}
      <style jsx global>{`
        @keyframes pcb-pulse-route {
          0% {
            stroke-dashoffset: 600;
          }
          100% {
            stroke-dashoffset: -600;
          }
        }
      `}</style>

      {/* ========================================================
          COLUMN A: TYPOGRAPHY, ACTIONS, & METRICS
         ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.15,
        }}
        className="lg:col-span-7 space-y-8 z-10 flex flex-col items-center lg:items-start"
      >
        <div className="flex flex-col space-y-3 items-center lg:items-start text-center lg:text-left">
          {/* Aligned, Prominent Intro Header */}
          <p className="text-xl md:text-2xl font-bold uppercase tracking-tighter text-neutral-500 dark:text-neutral-400 font-sans leading-none">
            Hi, I&apos;m
          </p>
          {/* Main name display header (massive, uppercase, tracking-tight) */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-sans uppercase tracking-tighter text-neutral-900 dark:text-white leading-none">
            {name}
          </h1>

          {/* Corrected Engineering Role Subtitle */}
          <p className="text-lg md:text-2xl font-bold uppercase tracking-tighter text-neutral-800 dark:text-neutral-200 font-sans leading-none">
            {title}
          </p>
        </div>

        {/* Clean Description Body */}
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl font-sans text-center lg:text-left">
          {overview}
        </p>

        {/* Action Layout Buttons */}
        <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono text-xs uppercase tracking-wider font-semibold border border-neutral-900 dark:border-white hover:bg-transparent hover:text-neutral-900 dark:hover:bg-transparent dark:hover:text-white transition-colors duration-200 shadow-sm"
          >
            View System Builds
          </a>
          <a
            href="/Sagar_Resume.pdf"
            download="Sagar_Resume.pdf"
            className="px-6 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-neutral-800 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200"
          >
            Download CV
          </a>
        </div>

        {/* Factual Metrics Grid with Entrance Delay */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.35,
          }}
          className="grid grid-cols-3 gap-4 sm:gap-10 pt-8 border-t border-neutral-200 dark:border-neutral-800/80 w-full max-w-2xl text-center lg:text-left bg-transparent"
        >
          {metrics.map((metric, i) => (
            <div key={i} className="space-y-3">
              <p className="text-2xl sm:text-4xl font-black font-sans tracking-tighter text-neutral-900 dark:text-white leading-none">
                {metric.value}
              </p>
              <div className="space-y-1.5">
                <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold leading-tight">
                  {metric.label}
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono text-neutral-400 dark:text-neutral-500 leading-none">
                  {metric.subtitle}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ========================================================
          COLUMN B: PORTRAIT FRAME & INTEGRATED TRACK SYSTEM
         ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.3,
        }}
        className="lg:col-span-5 flex justify-center items-center py-8 z-10"
      >
        {/* Relative layout boundaries lock SVG coordinates to card dimensions */}
        <div className="relative py-8 flex justify-center items-center">
          
          {/* Absolute PCB Canvas (Always centered perfectly behind the card) */}
          <div className="absolute inset-0 w-[500px] h-[700px] left-1/2 -translate-x-1/2 -top-12 pointer-events-none -z-10 select-none overflow-visible">
            <svg 
              className="w-full h-full stroke-neutral-200 dark:stroke-neutral-800/60 fill-none stroke-[2.5]"
              viewBox="0 0 500 700"
            >
              {/* Top Vias (6 Pads for the 6 Navbar Menu Options) */}
              <circle cx="75" cy="16" r="4.5" className="stroke-emerald-500/80 dark:stroke-emerald-500/60 fill-white dark:fill-[#0a0a0a]" />
              <circle cx="145" cy="16" r="4.5" className="stroke-emerald-500/80 dark:stroke-emerald-500/60 fill-white dark:fill-[#0a0a0a]" />
              <circle cx="215" cy="16" r="4.5" className="stroke-emerald-500/80 dark:stroke-emerald-500/60 fill-white dark:fill-[#0a0a0a]" />
              <circle cx="285" cy="16" r="4.5" className="stroke-emerald-500/80 dark:stroke-emerald-500/60 fill-white dark:fill-[#0a0a0a]" />
              <circle cx="355" cy="16" r="4.5" className="stroke-emerald-500/80 dark:stroke-emerald-500/60 fill-white dark:fill-[#0a0a0a]" />
              <circle cx="425" cy="16" r="4.5" className="stroke-emerald-500/80 dark:stroke-emerald-500/60 fill-white dark:fill-[#0a0a0a]" />

              {/* Bottom Vias (Start/End points for downward traces) */}
              <circle cx="110" cy="684" r="4.5" className="stroke-emerald-500/80 dark:stroke-emerald-500/60 fill-white dark:fill-[#0a0a0a]" />
              <circle cx="250" cy="684" r="4.5" className="stroke-emerald-500/80 dark:stroke-emerald-500/60 fill-white dark:fill-[#0a0a0a]" />
              <circle cx="390" cy="684" r="4.5" className="stroke-emerald-500/80 dark:stroke-emerald-500/60 fill-white dark:fill-[#0a0a0a]" />

              {/* Upward Traces (Emerging from top of the card to the 6 via locations) */}
              <path d="M 190,280 L 190,135 L 75,20" />
              <path d="M 214,280 L 214,89 L 145,20" />
              <path d="M 238,280 L 238,43 L 215,20" />
              <path d="M 262,280 L 262,43 L 285,20" />
              <path d="M 286,280 L 286,89 L 355,20" />
              <path d="M 310,280 L 310,135 L 425,20" />

              {/* Downward Traces (Emerging from bottom of the card) */}
              <path d="M 160,420 L 160,460 L 110,510 L 110,680" />
              <path d="M 250,420 L 250,680" />
              <path d="M 340,420 L 340,460 L 390,510 L 390,680" />

              {/* Upward Data Pulse Overlays */}
              <path
                d="M 190,280 L 190,135 L 75,20"
                className="stroke-emerald-500/40 dark:stroke-emerald-500/30"
                strokeWidth="2.5"
                strokeDasharray="40 240"
                style={{ animation: "pcb-pulse-route 14s linear infinite" }}
              />
              <path
                d="M 214,280 L 214,89 L 145,20"
                className="stroke-emerald-500/40 dark:stroke-emerald-500/30"
                strokeWidth="2.5"
                strokeDasharray="30 200"
                style={{ animation: "pcb-pulse-route 11s linear infinite reverse" }}
              />
              <path
                d="M 238,280 L 238,43 L 215,20"
                className="stroke-emerald-500/40 dark:stroke-emerald-500/30"
                strokeWidth="2.5"
                strokeDasharray="45 220"
                style={{ animation: "pcb-pulse-route 16s linear infinite" }}
              />
              <path
                d="M 262,280 L 262,43 L 285,20"
                className="stroke-emerald-500/40 dark:stroke-emerald-500/30"
                strokeWidth="2.5"
                strokeDasharray="45 220"
                style={{ animation: "pcb-pulse-route 16s linear infinite reverse" }}
              />
              <path
                d="M 286,280 L 286,89 L 355,20"
                className="stroke-emerald-500/40 dark:stroke-emerald-500/30"
                strokeWidth="2.5"
                strokeDasharray="30 200"
                style={{ animation: "pcb-pulse-route 11s linear infinite" }}
              />
              <path
                d="M 310,280 L 310,135 L 425,20"
                className="stroke-emerald-500/40 dark:stroke-emerald-500/30"
                strokeWidth="2.5"
                strokeDasharray="40 240"
                style={{ animation: "pcb-pulse-route 14s linear infinite reverse" }}
              />

              {/* Downward Data Pulse Overlays */}
              <path
                d="M 160,420 L 160,460 L 110,510 L 110,680"
                className="stroke-emerald-500/40 dark:stroke-emerald-500/30"
                strokeWidth="2.5"
                strokeDasharray="40 240"
                style={{ animation: "pcb-pulse-route 14s linear infinite" }}
              />
              <path
                d="M 250,420 L 250,680"
                className="stroke-emerald-500/40 dark:stroke-emerald-500/30"
                strokeWidth="2.5"
                strokeDasharray="30 200"
                style={{ animation: "pcb-pulse-route 11s linear infinite reverse" }}
              />
              <path
                d="M 340,420 L 340,460 L 390,510 L 390,680"
                className="stroke-emerald-500/40 dark:stroke-emerald-500/30"
                strokeWidth="2.5"
                strokeDasharray="40 240"
                style={{ animation: "pcb-pulse-route 16s linear infinite" }}
              />
            </svg>
          </div>

          {/* Profile Card Container */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-72 sm:w-80 md:w-[320px] p-4 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl shadow-lg dark:shadow-2xl backdrop-blur-md transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-neutral-950/50 relative z-10"
          >
            {/* Portrait Image Frame */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={profilePic}
                  alt="Sagar Koirala Portrait"
                  fill
                  sizes="(max-width: 768px) 240px, 300px"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </div>

            {/* Caption at the bottom */}
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-baseline justify-between">
              <span className="font-mono text-[10px] sm:text-xs text-neutral-800 dark:text-neutral-200 tracking-wider font-bold uppercase">
                Systems &amp; Firmware
              </span>
              <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                {portfolio.profile.location}
              </span>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}