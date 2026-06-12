"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import portfolio from "@/data/portfolio.json";
import profilePic from "@/assets/profile.png";

export default function Hero() {
  const { name, title, overview } = portfolio.profile;

  // Ref and motion values for 3D card tilt
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse parallax offset (tracks the entire page pointer position relative to chip center)
  const parallaxX = useSpring(useTransform(mouseX, [-1000, 1000], [-24, 24]), {
    stiffness: 150,
    damping: 22,
  });
  const parallaxY = useSpring(useTransform(mouseY, [-600, 600], [-24, 24]), {
    stiffness: 150,
    damping: 22,
  });

  // Scale the parallax transforms based on depth (Top layer gets full, Middle gets 50%)
  const midParallaxX = useTransform(parallaxX, (v) => v * 0.5);
  const midParallaxY = useTransform(parallaxY, (v) => v * 0.5);

  // Listen to mousemove events on the window to track pointer position across the entire page
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Calculate cursor coordinates relative to the QFP chip center
      const xVal = e.clientX - (rect.left + width / 2);
      const yVal = e.clientY - (rect.top + height / 2);

      mouseX.set(xVal);
      mouseY.set(yVal);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, [mouseX, mouseY]);

  // 8 pins per side for the QFP Package
  const pinCount = 8;
  const pinsArray = Array.from({ length: pinCount });

  return (
    <section
      id="hero"
      className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center pt-2 pb-24 md:pt-4 md:pb-36"
    >
      {/* Column A: Typography & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.15,
        }}
        className="lg:col-span-7 space-y-8 z-10"
      >
        <div className="flex flex-col space-y-3">
          {/* Aligned, Prominent Intro Header */}
          <p className="text-xl md:text-2xl font-bold uppercase tracking-tighter text-neutral-500 dark:text-neutral-400 font-sans leading-none">
            Hi, I'm
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

        {/* Description Body */}
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl font-sans">
          {overview}
        </p>

        {/* Action Layout Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <a
            href="#projects"
            className="px-6 py-3 rounded-none bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono text-xs uppercase tracking-wider font-semibold border border-neutral-900 dark:border-white hover:bg-transparent hover:text-neutral-900 dark:hover:bg-transparent dark:hover:text-white transition-colors duration-200 shadow-sm"
          >
            View System Builds
          </a>
          <a
            href="#footer"
            className="px-6 py-3 rounded-none border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white text-neutral-800 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors duration-200"
          >
            Download CV
          </a>
        </div>
      </motion.div>

      {/* Column B: Static QFP Package with 3D Exploded Image Stack */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.3,
        }}
        className="lg:col-span-5 flex justify-center items-center py-8"
      >
        <div
          ref={containerRef}
          className="relative w-80 h-80 md:w-[420px] md:h-[420px] flex items-center justify-center select-none"
        >
          {/* ========================================================
              STATIC PCB FOOTPRINT BACKGROUND ELEMENTS (z-0)
             ======================================================== */}

          {/* Silkscreen outline frame */}
          <div className="absolute w-[298px] h-[298px] md:w-[376px] md:h-[376px] border border-neutral-300/10 dark:border-neutral-800/30 rounded-sm pointer-events-none z-0" />

          {/* Pin-1 orientation notch marker circle right above the footprint frame corner */}
          <div className="absolute top-[8px] left-[8px] md:top-[14px] md:left-[14px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-neutral-400 flex items-center justify-center font-mono text-[8px] md:text-[10px] text-neutral-950 font-bold z-0 pointer-events-none shadow-sm">
            1
          </div>

          {/* TOP FOOTPRINT (SMT PADS & TRACES) */}
          <div className="absolute top-0 left-[28px] right-[28px] md:left-[45px] md:right-[45px] flex justify-between px-2 z-0 pointer-events-none">
            {pinsArray.map((_, i) => (
              <div key={`top-fp-${i}`} className="flex flex-col items-center relative">
                <div className="w-[1px] h-4 md:h-6 bg-neutral-300/20 dark:bg-neutral-800/40" />
                <div className="w-1.5 h-3 md:w-2 md:h-5 bg-neutral-300 dark:bg-neutral-700 shadow-sm" />
              </div>
            ))}
          </div>

          {/* BOTTOM FOOTPRINT (SMT PADS & TRACES) */}
          <div className="absolute bottom-0 left-[28px] right-[28px] md:left-[45px] md:right-[45px] flex justify-between px-2 z-0 pointer-events-none">
            {pinsArray.map((_, i) => (
              <div key={`bottom-fp-${i}`} className="flex flex-col items-center justify-end relative">
                <div className="w-1.5 h-3 md:w-2 md:h-5 bg-neutral-300 dark:bg-neutral-700 shadow-sm" />
                <div className="w-[1px] h-4 md:h-6 bg-neutral-300/20 dark:bg-neutral-800/40" />
              </div>
            ))}
          </div>

          {/* LEFT FOOTPRINT (SMT PADS & TRACES) */}
          <div className="absolute left-0 top-[28px] bottom-[28px] md:top-[45px] md:bottom-[45px] flex flex-col justify-between py-2 z-0 pointer-events-none">
            {pinsArray.map((_, i) => (
              <div key={`left-fp-${i}`} className="flex items-center relative">
                <div className="h-[1px] w-4 md:w-6 bg-neutral-300/20 dark:bg-neutral-800/40" />
                <div className="h-1.5 w-3 md:h-2 md:w-5 bg-neutral-300 dark:bg-neutral-700 shadow-sm" />
              </div>
            ))}
          </div>

          {/* RIGHT FOOTPRINT (SMT PADS & TRACES) */}
          <div className="absolute right-0 top-[28px] bottom-[28px] md:top-[45px] md:bottom-[45px] flex flex-col justify-between py-2 z-0 pointer-events-none">
            {pinsArray.map((_, i) => (
              <div key={`right-fp-${i}`} className="flex items-center justify-end relative">
                <div className="h-1.5 w-3 md:h-2 md:w-5 bg-neutral-300 dark:bg-neutral-700 shadow-sm" />
                <div className="h-[1px] w-4 md:w-6 bg-neutral-300/20 dark:bg-neutral-800/40" />
              </div>
            ))}
          </div>

          {/* ========================================================
              STATIC PROCESSOR CHIP BODY (z-10)
             ======================================================== */}
          <div className="w-72 h-72 md:w-[360px] md:h-[360px] bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-sm shadow-2xl relative flex items-center justify-center p-6 z-10">
            {/* TOP PINS */}
            <div className="absolute top-[-14px] md:top-[-28px] left-[12px] right-[12px] md:left-[16px] md:right-[16px] flex justify-between px-2 z-20 pointer-events-none">
              {pinsArray.map((_, i) => (
                <div
                  key={`top-${i}`}
                  className="w-1.5 h-4 md:w-2 md:h-8 bg-gradient-to-b from-neutral-500 via-neutral-365 to-neutral-400 rounded-sm shadow-md shadow-black/50"
                />
              ))}
            </div>

            {/* BOTTOM PINS */}
            <div className="absolute bottom-[-14px] md:bottom-[-28px] left-[12px] right-[12px] md:left-[16px] md:right-[16px] flex justify-between px-2 z-20 pointer-events-none">
              {pinsArray.map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className="w-1.5 h-4 md:w-2 md:h-8 bg-gradient-to-t from-neutral-500 via-neutral-365 to-neutral-400 rounded-sm shadow-md shadow-black/50"
                />
              ))}
            </div>

            {/* LEFT PINS */}
            <div className="absolute left-[-14px] md:left-[-28px] top-[12px] bottom-[12px] md:top-[16px] md:bottom-[16px] flex flex-col justify-between py-2 z-20 pointer-events-none">
              {pinsArray.map((_, i) => (
                <div
                  key={`left-${i}`}
                  className="h-1.5 w-4 md:h-2 md:w-8 bg-gradient-to-r from-neutral-500 via-neutral-365 to-neutral-400 rounded-sm shadow-md shadow-black/50"
                />
              ))}
            </div>

            {/* RIGHT PINS */}
            <div className="absolute right-[-14px] md:right-[-28px] top-[12px] bottom-[12px] md:top-[16px] md:bottom-[16px] flex flex-col justify-between py-2 z-20 pointer-events-none">
              {pinsArray.map((_, i) => (
                <div
                  key={`right-${i}`}
                  className="h-1.5 w-4 md:h-2 md:w-8 bg-gradient-to-l from-neutral-500 via-neutral-365 to-neutral-400 rounded-sm shadow-md shadow-black/50"
                />
              ))}
            </div>

            {/* Silicon Die Bevel edge */}
            <div className="absolute inset-2 border border-neutral-800 rounded-sm pointer-events-none opacity-90" />

            {/* Simulated chip marker engraving */}
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-neutral-600 tracking-wider">
              AM-QFP144-STM32
            </div>

            {/* 3D Floating Image Stack */}
            <div
              className="relative w-full h-full rounded overflow-visible pointer-events-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Layer 1: Base Image (No Parallax) */}
              <div
                className="absolute inset-0 rounded overflow-hidden bg-neutral-950 shadow-lg"
                style={{ scale: 1.15 }}
              >
                <Image
                  src={profilePic}
                  alt="Base PCB Blueprint Layer"
                  fill
                  className="object-cover opacity-70"
                  priority
                />
              </div>

              {/* Layer 2: Middle Image (Parallax on nested motion.div) */}
              <div
                className="absolute inset-0 rounded overflow-hidden shadow-xl shadow-black/40"
                style={{ scale: 1.12 }}
              >
                <motion.div
                  style={{
                    x: midParallaxX,
                    y: midParallaxY,
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <Image
                    src={profilePic}
                    alt="Middle Solder Layer"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </div>

              {/* Layer 3: Top Image (Parallax on nested motion.div) */}
              <div
                className="absolute inset-0 rounded overflow-hidden shadow-2xl shadow-black/95"
                style={{ scale: 1.07 }}
              >
                <motion.div
                  style={{
                    x: parallaxX,
                    y: parallaxY,
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <Image
                    src={profilePic}
                    alt="Top Finished Assembly Layer"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Subtle digital lens scanning overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-[pulse_3s_infinite] pointer-events-none" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
