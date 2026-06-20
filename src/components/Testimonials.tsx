"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import portfolio from "@/data/portfolio.json";

export default function Testimonials() {
  const testimonials = portfolio.testimonials;
  const trustMetrics = portfolio.trustMetrics;

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the testimonials section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // High-fidelity independent scroll-linked springs for parallax layering with distinct spatial delays
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [-80, 80]), { stiffness: 45, damping: 22 });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [60, -60]), { stiffness: 45, damping: 22 });
  const y3 = useSpring(useTransform(scrollYProgress, [0, 1], [-40, 40]), { stiffness: 45, damping: 22 });

  return (
    <section id="testimonials" className="py-24 md:py-36 scroll-mt-20">
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-bold font-sans uppercase tracking-tighter text-neutral-900 dark:text-white">
          Client Endorsements
        </h2>
      </div>

      {/* Parallax Container */}
      <div 
        ref={containerRef}
        className="flex flex-col space-y-16 md:space-y-24 overflow-hidden py-12"
      >
        {/* Quote 1: Massive raw typographic block */}
        {testimonials[0] && (
          <motion.div 
            style={{ y: y1 }}
            className="flex flex-col space-y-6 max-w-4xl"
          >
            <blockquote className="text-2xl md:text-4xl font-normal leading-tight tracking-tight text-neutral-900 dark:text-white font-sans">
              &ldquo;{testimonials[0].text}&rdquo;
            </blockquote>
            <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-500">
              — {testimonials[0].title} {" // "} {testimonials[0].platform}
            </div>
          </motion.div>
        )}

        {/* Huge Raw Trust Metrics Callouts */}
        {trustMetrics && (
          <motion.div 
            style={{ y: y2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl py-12 border-y border-neutral-200 dark:border-neutral-800"
          >
            {trustMetrics.map((metric, idx) => (
              <div key={idx} className="space-y-3">
                <div className="text-5xl md:text-7xl font-bold font-mono tracking-tighter text-neutral-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-500">
                  {metric.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Quote 2: Massive raw typographic block with right offset */}
        {testimonials[1] && (
          <motion.div 
            style={{ y: y3 }}
            className="flex flex-col space-y-6 max-w-4xl md:self-end md:mr-12"
          >
            <blockquote className="text-2xl md:text-4xl font-normal leading-tight tracking-tight text-neutral-900 dark:text-white font-sans">
              &ldquo;{testimonials[1].text}&rdquo;
            </blockquote>
            <div className="text-xs uppercase font-mono tracking-widest text-neutral-400 dark:text-neutral-500">
              — {testimonials[1].title} {" // "} {testimonials[1].platform}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
