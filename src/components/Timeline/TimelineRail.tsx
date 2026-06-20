"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import portfolio from "@/data/portfolio.json";
import TimelineCanvas from "./TimelineCanvas";
import TimelineDetails from "./TimelineDetails";
export interface TimelineItem {
  id: string;
  dateRange: string;
  yearStart: number;
  yearEnd: number;
  lane: number;
  role: string;
  company: string;
  shortCompany?: string;
  location: string;
  website?: string;
  referencePersonEmail?: string;
  bullets: string[];
  logo?: string;
  type: string;
}

export interface ParsedExperience extends TimelineItem {
  internalCategory: "full" | "part" | "edu";
  yOffset: number;
}

// Computes a target range for the viewport zoom/centering when focused on a timeline item.
const getDynamicTargetRange = (yearStart: number, yearEnd: number): [number, number] => {
  const duration = yearEnd - yearStart;
  // Let the focused element occupy about 50% of the visible viewport.
  // Viewport duration = duration * 2. Clamp between 1.2 and 5.5 years.
  const targetDuration = Math.max(1.2, Math.min(5.5, duration * 2.0));
  const center = yearStart + duration / 2;
  return [center - targetDuration / 2, center + targetDuration / 2];
};

const timelineData = portfolio.timeline as TimelineItem[];

const parsedExperiencesStatic: ParsedExperience[] = timelineData.map((item) => {
  const jsonType = item.type?.toLowerCase() || "";
  const internalCategory = 
    jsonType === "education" 
      ? ("edu" as const)
      : (jsonType === "part-time" || jsonType === "freelance" || jsonType === "internship")
      ? ("part" as const)
      : ("full" as const);

  const yOffset = 42 + item.lane * 40;

  return {
    ...item,
    internalCategory,
    yOffset,
  };
});

const getMinMaxYear = (exps: ParsedExperience[]) => {
  if (exps.length === 0) {
    return { minYear: 2021.0, maxYear: 2027.0 };
  }
  const starts = exps.map(e => e.yearStart);
  const ends = exps.map(e => e.yearEnd);
  const min = Math.min(...starts);
  const max = Math.max(...ends);
  return {
    minYear: Math.floor(min) - 0.5,
    maxYear: Math.ceil(max) + 0.5,
  };
};

const { minYear: staticMinYear, maxYear: staticMaxYear } = getMinMaxYear(parsedExperiencesStatic);

const clampCenterYearStatic = (center: number, duration: number, min: number, max: number) => {
  const half = duration / 2;
  const lowest = min + half;
  const highest = max - half;
  if (lowest > highest) return min + (max - min) / 2;
  return Math.max(lowest, Math.min(highest, center));
};

export default function TimelineRail() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the entire chronology section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Balanced, smooth parallax offsets where the canvas floats relative to details
  const yCanvas = useSpring(useTransform(scrollYProgress, [0, 1], [-40, 40]), { stiffness: 45, damping: 22 });
  const yDetails = useSpring(useTransform(scrollYProgress, [0, 1], [-15, 15]), { stiffness: 45, damping: 22 });

  const parsedExperiences = parsedExperiencesStatic;
  const minYear = staticMinYear;
  const maxYear = staticMaxYear;

  // --- State ---
  const firstExp = parsedExperiencesStatic[0];
  const initialTargetRange = firstExp ? getDynamicTargetRange(firstExp.yearStart, firstExp.yearEnd) : [2022.0, 2026.0];
  const initialDuration = initialTargetRange[1] - initialTargetRange[0];
  const initialCenter = (initialTargetRange[0] + initialTargetRange[1]) / 2;
  const initialClampedCenter = clampCenterYearStatic(initialCenter, initialDuration, staticMinYear, staticMaxYear);

  const [activeExperienceId, setActiveExperienceId] = useState<string | null>(firstExp?.id || null);
  const [viewportCenterYear, setViewportCenterYear] = useState<number>(initialClampedCenter);
  const [zoomDuration, setZoomDuration] = useState<number>(initialDuration);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  // Clamp function to keep viewport within timeline bounds
  const clampCenterYear = useCallback((center: number, duration: number) => {
    const half = duration / 2;
    const lowest = staticMinYear + half;
    const highest = staticMaxYear - half;
    if (lowest > highest) return staticMinYear + (staticMaxYear - staticMinYear) / 2;
    return Math.max(lowest, Math.min(highest, center));
  }, []);

  // Selection callback to snap viewport to the targeted experience
  const handleSelectId = useCallback((id: string | null) => {
    setShouldAnimate(true);
    setActiveExperienceId(id);
    if (id) {
      const exp = parsedExperiencesStatic.find(e => e.id === id);
      if (exp) {
        const [targetMin, targetMax] = getDynamicTargetRange(exp.yearStart, exp.yearEnd);
        const targetDuration = targetMax - targetMin;
        const targetCenter = (targetMin + targetMax) / 2;
        setViewportCenterYear(clampCenterYear(targetCenter, targetDuration));
        setZoomDuration(targetDuration);
      }
    }
  }, [clampCenterYear]);

  return (
    <section ref={containerRef} id="timeline" className="py-24 md:py-36 scroll-mt-20 overflow-hidden">
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-bold font-sans uppercase tracking-tighter text-neutral-900 dark:text-white">
          Professional Timeline
        </h2>
      </div>

      {/* --- Visual Timeline Graph Track (Desktop only) --- */}
      <motion.div
        style={{ y: yCanvas }}
        className="will-change-transform hidden md:block"
      >
        <TimelineCanvas
          experiences={parsedExperiences}
          activeId={activeExperienceId}
          setActiveId={handleSelectId}
          minYear={minYear}
          maxYear={maxYear}
          viewportCenterYear={viewportCenterYear}
          setViewportCenterYear={setViewportCenterYear}
          zoomDuration={zoomDuration}
          shouldAnimate={shouldAnimate}
          setShouldAnimate={setShouldAnimate}
        />
      </motion.div>

      {/* --- Bottom Accordion Details View --- */}
      <motion.div style={{ y: yDetails }} className="will-change-transform">
        <TimelineDetails
          experiences={parsedExperiences}
          activeId={activeExperienceId}
          onSelectId={handleSelectId}
        />
      </motion.div>
    </section>
  );
}
