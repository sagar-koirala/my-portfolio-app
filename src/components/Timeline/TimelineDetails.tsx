"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { ParsedExperience } from "./TimelineRail";

interface TimelineDetailsProps {
  experiences: ParsedExperience[];
  activeId: string | null;
  onSelectId: (id: string | null) => void;
}

const parseBullet = (bullet: string) => {
  const match = bullet.match(/^\*\*(.*?)\*\*(:?)\s*(.*)/);
  if (match) {
    return {
      prefix: match[1],
      hasColon: match[2] === ":",
      text: match[3]
    };
  }
  return null;
};

const mobileContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    }
  }
} as const;

const mobileItemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 75,
      damping: 19,
    }
  }
};

export default function TimelineDetails({
  experiences,
  activeId,
  onSelectId,
}: TimelineDetailsProps) {
  const collapsedWidth = 60;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWidth, setActiveWidth] = useState<number>(600);

  const [prevActiveId, setPrevActiveId] = useState<string | null>(activeId);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  useEffect(() => {
    if (!activeId) return;
    const prevIdx = experiences.findIndex((e) => e.id === prevActiveId);
    const nextIdx = experiences.findIndex((e) => e.id === activeId);
    if (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx) {
      setSlideDirection(nextIdx > prevIdx ? 1 : -1);
    }
    setPrevActiveId(activeId);
  }, [activeId, experiences, prevActiveId]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const inactiveCount = experiences.length - 1;
        const totalInactiveWidth = inactiveCount * collapsedWidth + inactiveCount * 12;
        setActiveWidth(width - totalInactiveWidth - 16);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [experiences.length, collapsedWidth]);

  return (
    <>
      {/* --- BOTTOM LAYER: Horizontal Folder Accordion (Desktop) --- */}
      <div ref={containerRef} className="hidden md:flex md:flex-row gap-3 w-full h-[390px] items-stretch mt-3">
        {experiences.map((exp) => {
          const isActive = activeId === exp.id;
          return (
            <motion.div
              key={exp.id}
              initial={{
                width: isActive ? activeWidth : collapsedWidth,
                opacity: isActive ? 1 : 0.6,
                y: 0,
              }}
              animate={{
                width: isActive ? activeWidth : collapsedWidth,
                opacity: isActive ? 1 : 0.6,
                y: 0,
              }}
              whileHover={{ y: isActive ? 0 : -2, opacity: 1 }}
              transition={{ type: "spring", stiffness: 75, damping: 19, restDelta: 0.01 }}
              onMouseEnter={() => onSelectId(exp.id)}
              onClick={() => onSelectId(exp.id)}
              className={`relative h-full border transition-colors duration-300 overflow-hidden cursor-pointer select-none rounded-xl shrink-0 ${
                isActive 
                  ? "bg-neutral-100/60 dark:bg-neutral-900/60 border-neutral-300 dark:border-neutral-700" 
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/40 hover:bg-neutral-100/20 dark:hover:bg-neutral-900/20 hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  left: isActive ? activeWidth - 72 : (collapsedWidth - 32) / 2,
                  top: isActive ? 32 : 24,
                  width: isActive ? 40 : 32,
                  height: isActive ? 40 : 32,
                }}
                transition={{ type: "spring", stiffness: 75, damping: 19, restDelta: 0.01 }}
                className="absolute bg-white border border-neutral-200 dark:border-neutral-700 rounded-full flex items-center justify-center shrink-0 overflow-hidden z-20"
              >
                {exp.logo ? (
                  <Image
                    src={exp.logo}
                    alt={`${exp.company} Logo`}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain p-1 rounded-full"
                  />
                ) : (
                  <Briefcase size={isActive ? 14 : 12} className="text-neutral-800" />
                )}
              </motion.div>

              <motion.div
                initial={false}
                animate={{
                  left: isActive ? activeWidth - 76 : 0,
                  opacity: isActive ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 75, damping: 19, restDelta: 0.01 }}
                className="absolute bottom-6 w-[60px] flex flex-col items-center pointer-events-none z-10"
              >
                <span className="rotate-180 [writing-mode:vertical-lr] font-black text-[11px] tracking-widest whitespace-nowrap text-neutral-500 dark:text-neutral-400 uppercase font-mono">
                  {exp.shortCompany || exp.company.split(" ")[0]}
                </span>
              </motion.div>

              {isActive ? (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: slideDirection * 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  style={{ width: activeWidth }}
                  className="shrink-0 flex flex-col h-full justify-between p-8 relative"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                          {exp.type} Experience
                        </span>
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100 mt-1.5 font-sans leading-tight">
                          {exp.role}
                        </h3>
                        <p className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mt-1 leading-none">
                          {exp.company}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mt-3.5 border-y border-neutral-200 dark:border-neutral-800/60 py-2">
                          <span>DATE: {exp.dateRange}</span>
                          <span>•</span>
                          <span>LOCATION: {exp.location}</span>
                        </div>

                        <div className="mt-4 max-h-[170px] overflow-y-auto pr-2 space-y-2.5 custom-scrollbar">
                          {exp.bullets.map((bullet, idx) => {
                            const parsed = parseBullet(bullet);
                            return (
                              <div key={idx} className="flex gap-2 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                                <span className="text-neutral-500 dark:text-neutral-500 mt-1.5 shrink-0 text-[8px]">▪</span>
                                <p>
                                  {parsed ? (
                                    <>
                                      <strong className="font-bold text-neutral-900 dark:text-neutral-100">{parsed.prefix}</strong>
                                      {parsed.hasColon ? ": " : " "}
                                      {parsed.text}
                                    </>
                                  ) : (
                                    bullet
                                  )}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="w-10 h-10 shrink-0" />
                    </div>
                  </div>

                  {exp.website && (
                    <div className="pt-4 mt-auto">
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white border-b border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-400 pb-0.5 transition-all select-none"
                      >
                        Visit Workspace
                        <span>↗</span>
                      </a>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div style={{ width: collapsedWidth }} className="h-full shrink-0" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* --- BOTTOM LAYER: Minimalist Spaced Dividers (Mobile / Tablet) --- */}
      <motion.div 
        layout="position"
        className="flex flex-col w-full md:hidden border-t border-neutral-200 dark:border-neutral-800 mt-4"
      >
        {experiences.map((exp) => {
          const isActive = activeId === exp.id;
          const isAnyActive = activeId !== null;
          const mobileOpacity = isActive ? 1 : (isAnyActive ? 0.35 : 1);
          return (
            <motion.div
              layout="position"
              key={`mob-${exp.id}`}
              id={`mob-${exp.id}`}
              onClick={() => onSelectId(isActive ? null : exp.id)} // Clean Mobile Collapse
              className={`border-b transition-all duration-300 cursor-pointer select-none bg-transparent py-12 ${
                isActive 
                  ? "border-neutral-300 dark:border-neutral-700" 
                  : isAnyActive
                    ? "border-neutral-200/30 dark:border-neutral-800/30"
                    : "border-neutral-200 dark:border-neutral-800"
              }`}
              style={{ opacity: mobileOpacity }}
            >
              {/* Header Panel - Displays Role Title primarily */}
              <div className="flex items-center justify-between select-none">
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  {exp.logo && (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200 dark:border-neutral-700">
                      <Image
                        src={exp.logo}
                        alt={`${exp.company} Logo`}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain p-1 rounded-full"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-medium text-neutral-900 dark:text-white uppercase tracking-tight font-sans leading-snug">
                    {exp.role}
                  </h3>
                </div>
                
                {/* Fixed iOS WebKit bracket wrap bug */}
                <span className="text-sm font-mono text-neutral-400 dark:text-neutral-500 transition-transform duration-300 inline-block w-8 text-right shrink-0 whitespace-nowrap select-none">
                  {isActive ? "[-]" : "[+]"}
                </span>
              </div>

              {/* Collapsible Content Area */}
              <motion.div
                initial={false}
                animate={isActive ? "visible" : "hidden"}
                variants={{
                  hidden: { 
                    height: 0, 
                    opacity: 0,
                    transition: {
                      height: { type: "spring", stiffness: 75, damping: 19, restDelta: 0.01 },
                      opacity: { duration: 0.15 }
                    }
                  },
                  visible: {
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { type: "spring", stiffness: 75, damping: 19, restDelta: 0.01 },
                      opacity: { duration: 0.22 }
                    }
                  }
                }}
                className="overflow-hidden relative"
                style={{
                  transform: "translateZ(0)", // GPU clipping isolate
                  willChange: "transform, height, opacity"
                }}
              >
                <motion.div
                  variants={mobileContainerVariants}
                  initial="hidden"
                  animate={isActive ? "visible" : "hidden"}
                  className="space-y-4 pr-1 pt-5 pb-1 px-1"
                >
                  {/* Company Name Subtitle Context inside the folder details */}
                  <motion.div variants={mobileItemVariants}>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      {exp.type} Experience at
                    </span>
                    <h4 className="text-base font-extrabold uppercase tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5 font-sans leading-tight">
                      {exp.company}
                    </h4>
                  </motion.div>

                  <motion.div
                    variants={mobileItemVariants}
                    className="flex flex-col gap-1 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest border-y border-neutral-200 dark:border-neutral-800 py-2.5"
                  >
                    <span>DATE: {exp.dateRange}</span>
                    <span>LOCATION: {exp.location}</span>
                  </motion.div>

                  <div className="space-y-2.5">
                    {exp.bullets.map((bullet, idx) => {
                      const parsed = parseBullet(bullet);
                      return (
                        <motion.div
                          key={idx}
                          variants={mobileItemVariants}
                          className="flex gap-3 items-start"
                        >
                          {/* CSS Square bullet matching Technical Inventory spacing */}
                          <span className="h-1.5 w-1.5 bg-neutral-400 dark:bg-neutral-600 flex-shrink-0 mt-1.5 rounded-none" />
                          <p className="font-sans text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed tracking-tight">
                            {parsed ? (
                              <>
                                <strong className="font-bold text-neutral-950 dark:text-neutral-50">{parsed.prefix}</strong>
                                {parsed.hasColon ? ": " : " "}
                                {parsed.text}
                              </>
                            ) : (
                              bullet
                            )}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {exp.website && (
                    <motion.div variants={mobileItemVariants} className="pt-2">
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-neutral-700 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white border-b border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-400 pb-0.5 transition-all select-none"
                      >
                        Visit Workspace ↗
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}