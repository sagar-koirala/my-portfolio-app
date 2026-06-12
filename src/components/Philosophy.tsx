"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import portfolio from "@/data/portfolio.json";

export default function Philosophy() {
  const { philosophy } = portfolio;
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up scroll tracking across the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Testimonials-matched scroll-linked springs for parallax layering
  const yRaw1 = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const ySpring1 = useSpring(yRaw1, { stiffness: 45, damping: 22 });

  const yRaw2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const ySpring2 = useSpring(yRaw2, { stiffness: 45, damping: 22 });

  const yRaw3 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const ySpring3 = useSpring(yRaw3, { stiffness: 45, damping: 22 });

  const ySprings = [ySpring1, ySpring2, ySpring3];

  // Mobile viewport detection to bypass translations below md breakpoint (768px)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getRowStyles = (index: number) => {
    switch (index) {
      case 0:
        return "max-w-3xl mr-auto";
      case 1:
        return "max-w-3xl ml-auto text-left lg:pl-16";
      case 2:
        return "max-w-3xl mr-auto";
      default:
        return "max-w-3xl mr-auto";
    }
  };

  return (
    <section
      id="philosophy"
      ref={containerRef}
      className="w-full relative py-12 overflow-hidden"
    >
      {/* Huge Consistent Typographic Header */}
      <h2 className="text-4xl md:text-6xl font-bold font-sans uppercase tracking-tighter text-neutral-900 dark:text-white mb-16">
        ENGINEERING BELIEFS
      </h2>

      {/* Asymmetric Stark Stacking Layout with Testimonials-matched Gaps */}
      <div className="w-full flex flex-col space-y-16 md:space-y-24 overflow-hidden py-12">
        {philosophy.map((item, index) => {
          const indexMarker = `0${index + 1} / ${item.category}`;
          const yTranslation = ySprings[index] || 0;

          return (
            <motion.div
              key={index}
              style={{ y: isMobile ? 0 : yTranslation }}
              className={`w-full flex flex-col space-y-4 md:space-y-6 ${getRowStyles(
                index
              )}`}
            >
              {/* Index Callout */}
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2 block">
                {indexMarker}
              </span>

              {/* Element Sub-title */}
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight uppercase text-neutral-800 dark:text-neutral-200 mt-2 mb-4">
                {item.title}
              </h3>

              {/* Description Paragraph */}
              <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed mt-4 max-w-xl">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
