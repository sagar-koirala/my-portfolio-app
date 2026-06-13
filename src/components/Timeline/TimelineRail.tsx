"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
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

export default function TimelineRail() {
  const timelineData = portfolio.timeline as TimelineItem[];
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the entire chronology section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Balanced, smooth parallax offsets where the canvas floats relative to details
  const yCanvas = useSpring(useTransform(scrollYProgress, [0, 1], [-40, 40]), { stiffness: 45, damping: 22 });
  const yDetails = useSpring(useTransform(scrollYProgress, [0, 1], [-15, 15]), { stiffness: 45, damping: 22 });

  const parsedExperiences = useMemo<ParsedExperience[]>(() => {
    return timelineData.map((item) => {
      // Map the JSON type string directly to internal category type
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
  }, [timelineData]);

  // Compute dynamic track range from parsed experiences
  const { minYear, maxYear } = useMemo(() => {
    if (parsedExperiences.length === 0) {
      return { minYear: 2021.0, maxYear: 2027.0 };
    }
    const starts = parsedExperiences.map(e => e.yearStart);
    const ends = parsedExperiences.map(e => e.yearEnd);
    const min = Math.min(...starts);
    const max = Math.max(...ends);
    // Add some padding to both ends of the track
    return {
      minYear: Math.floor(min) - 0.5,
      maxYear: Math.ceil(max) + 0.5,
    };
  }, [parsedExperiences]);

  // --- State ---
  const [activeExperienceId, setActiveExperienceId] = useState<string | null>(null);
  const [viewportCenterYear, setViewportCenterYear] = useState<number>(2024.0);
  const [zoomDuration, setZoomDuration] = useState<number>(4.0);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  // Clamp function to keep viewport within timeline bounds
  const clampCenterYear = useCallback((center: number, duration: number) => {
    const half = duration / 2;
    const lowest = minYear + half;
    const highest = maxYear - half;
    if (lowest > highest) return minYear + (maxYear - minYear) / 2;
    return Math.max(lowest, Math.min(highest, center));
  }, [minYear, maxYear]);

  // Initialize state once parsed experiences are ready
  useEffect(() => {
    if (parsedExperiences.length > 0 && !activeExperienceId) {
      const firstExp = parsedExperiences[0];
      setActiveExperienceId(firstExp.id);
      
      const [targetMin, targetMax] = getDynamicTargetRange(firstExp.yearStart, firstExp.yearEnd);
      const targetDuration = targetMax - targetMin;
      const targetCenter = (targetMin + targetMax) / 2;
      setViewportCenterYear(clampCenterYear(targetCenter, targetDuration));
      setZoomDuration(targetDuration);
    }
  }, [parsedExperiences, activeExperienceId, clampCenterYear]);

  // Selection callback to snap viewport to the targeted experience
  const handleSelectId = useCallback((id: string) => {
    setShouldAnimate(true);
    setActiveExperienceId(id);
    const exp = parsedExperiences.find(e => e.id === id);
    if (exp) {
      const [targetMin, targetMax] = getDynamicTargetRange(exp.yearStart, exp.yearEnd);
      const targetDuration = targetMax - targetMin;
      const targetCenter = (targetMin + targetMax) / 2;
      setViewportCenterYear(clampCenterYear(targetCenter, targetDuration));
      setZoomDuration(targetDuration);
    }
  }, [parsedExperiences, clampCenterYear]);

  return (
    <section ref={containerRef} id="timeline" className="py-24 md:py-36 scroll-mt-20 overflow-hidden">
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-bold font-sans uppercase tracking-tighter text-neutral-900 dark:text-white">
          Professional Timeline
        </h2>
      </div>

      {/* --- Visual Timeline Graph Track --- */}
      <motion.div style={{ y: yCanvas }} className="will-change-transform">
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
