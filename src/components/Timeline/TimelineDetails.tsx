"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { ParsedExperience } from "./TimelineRail";

interface TimelineDetailsProps {
  experiences: ParsedExperience[];
  activeId: string | null;
  onSelectId: (id: string) => void;
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

/* Kept for potential reuse elsewhere; unused in the new collapsed-tab flow */
const logoContainerVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.08, rotate: -3, transition: { type: "spring" as const, stiffness: 110, damping: 20 } }
};

const logoImageVariants = {
  rest: { x: 0, y: 0, scale: 1 },
  hover: { x: 2, y: -2, scale: 1.05, transition: { type: "spring" as const, stiffness: 110, damping: 20 } }
};



export default function TimelineDetails({
  experiences,
  activeId,
  onSelectId,
}: TimelineDetailsProps) {
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
        const totalInactiveWidth = inactiveCount * 48 + inactiveCount * 12;
        setActiveWidth(width - totalInactiveWidth);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [experiences.length]);

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
                width: isActive ? activeWidth : 48,
                opacity: isActive ? 1 : 0.6,
                y: 0,
              }}
              animate={{
                width: isActive ? activeWidth : 48,
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
              {/* Synchronized Animated Logo (locks to parent dimensions) */}
              <motion.div
                initial={false}
                animate={{
                  left: isActive ? activeWidth - 72 : 8,
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

              {/* Synchronized Animated Vertical Label */}
              <motion.div
                initial={false}
                animate={{
                  left: isActive ? activeWidth - 76 : 0,
                  opacity: isActive ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 75, damping: 19, restDelta: 0.01 }}
                className="absolute bottom-6 w-12 flex flex-col items-center pointer-events-none z-10"
              >
                <span className="rotate-180 [writing-mode:vertical-lr] font-black text-[9px] tracking-widest whitespace-nowrap text-neutral-550 dark:text-neutral-400 uppercase font-mono">
                  {exp.shortCompany || exp.company.split(" ")[0]}
                </span>
              </motion.div>

              {isActive ? (
                /* ── Rigid-Block Inner Layout ──
                 * Fixed-width container that never reflows during the
                 * parent's width animation. The parent clips (overflow-hidden)
                 * and acts as a sliding mask to reveal this static block. */
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
                      {/* Left-side text content — static, no motion wrappers */}
                      <div className="flex-1 pr-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-550 dark:text-neutral-400">
                          {exp.type} Experience
                        </span>
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100 mt-1.5 font-sans leading-tight">
                          {exp.role}
                        </h3>
                        <p className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mt-1 leading-none">
                          {exp.company}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-neutral-550 dark:text-neutral-400 uppercase tracking-widest mt-3.5 border-y border-neutral-200 dark:border-neutral-800/60 py-2">
                          <span>DATE: {exp.dateRange}</span>
                          <span>•</span>
                          <span>LOCATION: {exp.location}</span>
                        </div>

                        <div className="mt-4 max-h-[170px] overflow-y-auto pr-2 space-y-2.5 custom-scrollbar">
                          {exp.bullets.map((bullet, idx) => {
                            const parsed = parseBullet(bullet);
                            return (
                              <div key={idx} className="flex gap-2 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                                <span className="text-neutral-550 dark:text-neutral-500 mt-1.5 shrink-0 text-[8px]">▪</span>
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

                      {/* Spacer to preserve layout of active logo */}
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
                /* Simple empty layout spacer when collapsed */
                <div className="h-full w-12 shrink-0" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* --- BOTTOM LAYER: Vertical Accordion System (Mobile / Tablet) --- */}
      <div className="flex flex-col border-t border-neutral-200 dark:border-neutral-800 w-full md:hidden mt-4">
        {experiences.map((exp) => {
          const isActive = activeId === exp.id;
          return (
            <div
              key={`mob-${exp.id}`}
              onMouseEnter={() => onSelectId(exp.id)}
              onClick={() => onSelectId(exp.id)}
              className="border-b border-neutral-200 dark:border-neutral-800 py-6 transition-opacity duration-300 cursor-pointer"
              style={{ opacity: isActive ? 1 : 0.6 }}
            >
              <div className="flex items-center justify-between select-none py-2">
                <div className="flex items-center gap-3">
                  {exp.logo && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200 dark:border-neutral-700">
                      <Image
                        src={exp.logo}
                        alt={`${exp.company} Logo`}
                        width={20}
                        height={20}
                        className="w-full h-full object-contain p-0.5 rounded-full"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                    {exp.company}
                  </h3>
                </div>
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  {isActive ? "[-]" : "[+]"}
                </span>
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: isActive ? "auto" : 0,
                  opacity: isActive ? 1 : 0,
                  marginTop: isActive ? 20 : 0
                }}
                transition={{ type: "spring", stiffness: 75, damping: 19, restDelta: 0.01 }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, x: slideDirection * 10 }}
                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : slideDirection * 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-4 pr-2"
                >
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                      {exp.type} Experience
                    </span>
                    <h4 className="text-base font-bold uppercase tracking-tight text-neutral-900 dark:text-neutral-100 mt-1 font-sans">
                      {exp.role}
                    </h4>
                  </div>

                  <div className="flex flex-col gap-1.5 text-[9px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest border-y border-neutral-200 dark:border-neutral-800/60 py-2.5">
                    <span>DATE: {exp.dateRange}</span>
                    <span>LOCATION: {exp.location}</span>
                  </div>

                  <div className="space-y-2.5">
                    {exp.bullets.map((bullet, idx) => {
                      const parsed = parseBullet(bullet);
                      return (
                        <div key={idx} className="flex gap-3 items-start">
                          {/* CSS-rendered square bullet to match Technical Inventory */}
                          <span className="h-1.5 w-1.5 bg-neutral-400 dark:bg-neutral-600 flex-shrink-0 mt-1.5" />
                          <p className="font-sans text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed tracking-tight">
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

                  {exp.website && (
                    <div className="pt-2">
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white border-b border-neutral-300 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-400 pb-0.5 transition-all select-none"
                      >
                        Visit Workspace ↗
                      </a>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </>
  );
}
