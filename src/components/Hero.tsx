"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import portfolio from '@/data/portfolio.json';
import profilePic from '@/assets/profile.png';

export default function Hero() {
  const { name, title, location, coordinates, skillsOverview } = portfolio.profile;

  // Hover state to trigger immediate, robust exploded-view separation
  const [isHovered, setIsHovered] = useState(false);

  // Ref and motion values for 3D card tilt
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt (very subtle tilt)
  const tiltX = useSpring(useTransform(mouseY, [-200, 200], [3, -3]), { stiffness: 150, damping: 22 });
  const tiltY = useSpring(useTransform(mouseX, [-200, 200], [-3, 3]), { stiffness: 150, damping: 22 });

  // Minor mouse parallax offset (only applied to middle and top layers, scaled by depth)
  const parallaxX = useSpring(useTransform(mouseX, [-200, 200], [-8, 8]), { stiffness: 150, damping: 22 });
  const parallaxY = useSpring(useTransform(mouseY, [-200, 200], [-8, 8]), { stiffness: 150, damping: 22 });

  // Scale the parallax transforms based on depth (Top layer gets full, Middle gets 50%)
  const midParallaxX = useTransform(parallaxX, (v) => v * 0.5);
  const midParallaxY = useTransform(parallaxY, (v) => v * 0.5);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate mouse position relative to container center
    const xVal = e.clientX - rect.left - width / 2;
    const yVal = e.clientY - rect.top - height / 2;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // 8 pins per side for the QFP Package
  const pinCount = 8;
  const pinsArray = Array.from({ length: pinCount });

  return (
    <section id="hero" className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center py-12 md:py-20">
      {/* Column A: Typography & Actions */}
      <div className="lg:col-span-7 space-y-6 z-10">
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
            // {title}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            {name}
          </h1>
        </div>
        
        <p className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-xl">
          Designing robust, low-latency, and high-integrity hardware architectures and embedded software solutions from concept to production.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href="#cv"
            className="px-6 py-3 rounded border border-neutral-800 hover:border-neutral-400 text-sm font-mono text-neutral-300 hover:text-white transition-all duration-300"
          >
            [ Download Engineering CV ]
          </a>
          <a
            href="#projects"
            className="px-6 py-3 rounded border border-neutral-800 hover:border-neutral-400 text-sm font-mono text-neutral-300 hover:text-white transition-all duration-300"
          >
            [ View System Builds ]
          </a>
        </div>
      </div>

      {/* Column B: 3D QFP Package with Exploded Image Stack */}
      <div className="lg:col-span-5 flex justify-center items-center py-8">
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-80 h-80 flex items-center justify-center cursor-pointer group select-none"
          style={{ perspective: 1000 }}
        >
          {/* QFP Package Gull-wing Leads (Outer frame pins) */}
          
          {/* TOP PINS */}
          <div className="absolute top-[-0px] left-[40px] right-[40px] flex justify-between px-2 z-0">
            {pinsArray.map((_, i) => (
              <div 
                key={`top-${i}`} 
                className="w-1.5 h-4 bg-gradient-to-b from-neutral-500 via-neutral-365 to-neutral-400 rounded-sm shadow-md shadow-black/50"
              />
            ))}
          </div>

          {/* BOTTOM PINS */}
          <div className="absolute bottom-[-0px] left-[40px] right-[40px] flex justify-between px-2 z-0">
            {pinsArray.map((_, i) => (
              <div 
                key={`bottom-${i}`} 
                className="w-1.5 h-4 bg-gradient-to-t from-neutral-500 via-neutral-365 to-neutral-400 rounded-sm shadow-md shadow-black/50"
              />
            ))}
          </div>

          {/* LEFT PINS */}
          <div className="absolute left-[-0px] top-[40px] bottom-[40px] flex flex-col justify-between py-2 z-0">
            {pinsArray.map((_, i) => (
              <div 
                key={`left-${i}`} 
                className="h-1.5 w-4 bg-gradient-to-r from-neutral-500 via-neutral-365 to-neutral-400 rounded-sm shadow-md shadow-black/50"
              />
            ))}
          </div>

          {/* RIGHT PINS */}
          <div className="absolute right-[-0px] top-[40px] bottom-[40px] flex flex-col justify-between py-2 z-0">
            {pinsArray.map((_, i) => (
              <div 
                key={`right-${i}`} 
                className="h-1.5 w-4 bg-gradient-to-l from-neutral-500 via-neutral-365 to-neutral-400 rounded-sm shadow-md shadow-black/50"
              />
            ))}
          </div>

          {/* Main QFP Silicon Die Body */}
          <motion.div
            style={{
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: 'preserve-3d',
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-72 h-72 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-sm shadow-2xl relative flex items-center justify-center p-6"
          >
            {/* Silicon Die Bevel edge */}
            <div className="absolute inset-2 border border-neutral-800 rounded-sm pointer-events-none opacity-90" />

            {/* Simulated chip marker engraving */}
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-neutral-600 tracking-wider">
              AM-QFP144-STM32
            </div>

            {/* 3D Floating Image Stack */}
            <div className="relative w-full h-full rounded overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
              
              {/* Layer 1: Base Image (PCB Board Vibe - Largest, static position, scale 1.25) */}
              <motion.div
                animate={{
                  opacity: 0.85,
                }}
                className="absolute inset-0 rounded overflow-hidden bg-neutral-950 pointer-events-none shadow-lg"
                style={{ scale: 1.15 }}
              >
                <Image
                  src={profilePic}
                  alt="Base PCB Blueprint Layer"
                  fill
                  className="object-cover opacity-70"
                  priority
                />
              </motion.div>

              {/* Layer 2: Middle Image (Silicon Solder Vibe - Medium, scale 1.0, slides slightly bottom-left) */}
              <motion.div
                animate={{
                  x: isHovered ? 1 : 0,
                  y: isHovered ? -1 : 0,
                  opacity: 0.9,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                className="absolute inset-0 rounded overflow-hidden pointer-events-none shadow-xl shadow-black/40"
                style={{ scale: 1.1 }}
              >
                {/* Nested inner container for decoupled mouse-parallax offset */}
                <motion.div
                  style={{
                    x: midParallaxX,
                    y: midParallaxY,
                    width: '100%',
                    height: '100%',
                    position: 'relative',
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
              </motion.div>

              {/* Layer 3: Top Image (Final Assembled Vibe - Smallest, scale 0.75, slides most top-right) */}
              <motion.div
                animate={{
                  x: isHovered ? 2 : 0,
                  y: isHovered ? -2 : 0,
                  opacity: 1.0,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                className="absolute inset-0 rounded overflow-hidden shadow-2xl shadow-black/95"
                style={{ scale: 1.05 }}
              >
                {/* Nested inner container for decoupled mouse-parallax offset */}
                <motion.div
                  style={{
                    x: parallaxX,
                    y: parallaxY,
                    width: '100%',
                    height: '100%',
                    position: 'relative',
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
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
