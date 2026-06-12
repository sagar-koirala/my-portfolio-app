"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import portfolio from '@/data/portfolio.json';

export default function SkillsBOM() {
  const { skillsInventory } = portfolio;
  
  // Dynamically load categories directly from the JSON keys in portfolio.json
  const categories = Object.keys(skillsInventory);
  
  // Strict state tracking for row expansion (defaults to first row expanded)
  const [activeTab, setActiveTab] = useState<number | null>(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1, // Wait for structural spring height to begin
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 18,
      }
    }
  } as const;

  const isAnyActive = activeTab !== null;

  return (
    <section id="skills" className="py-24 md:py-36 scroll-mt-20 select-none">
      <div className="mb-16 mx-auto max-w-7xl px-4 sm:px-8">
        <h2 className="text-4xl md:text-6xl font-bold font-sans uppercase tracking-tighter text-neutral-900 dark:text-white">
          Technical Inventory
        </h2>
      </div>

      {/* Stack of full-width horizontal rows separated by deep, minimalist cuts */}
      <div className="flex flex-col border-t border-neutral-200 dark:border-neutral-800 mx-auto max-w-7xl px-4 sm:px-8">
        {categories.map((category, index) => {
          const isActive = activeTab === index;
          const skills = skillsInventory[category as keyof typeof skillsInventory] || [];
          const rowOpacity = isActive ? 1 : (isAnyActive ? 0.35 : 1);

          return (
            <div
              key={index}
              onMouseEnter={() => setActiveTab(index)}
              onClick={() => setActiveTab(isActive ? null : index)}
              style={{ opacity: rowOpacity }}
              className="border-b border-neutral-200 dark:border-neutral-800 py-12 transition-opacity duration-300 cursor-pointer"
            >
              {/* Row Header */}
              <div className="flex items-center justify-between select-none">
                <h3 className="text-xl md:text-3xl font-medium text-neutral-900 dark:text-white uppercase tracking-tight">
                  {category}
                </h3>
                <span className="text-sm font-mono text-neutral-400 dark:text-neutral-500 transition-transform duration-300">
                  {isActive ? "[-]" : "[+]"}
                </span>
              </div>

              {/* Animated Skill Details */}
              <motion.div
                initial={index === 0 ? "visible" : "hidden"}
                animate={isActive ? "visible" : "hidden"}
                variants={{
                  hidden: { height: 0, opacity: 0, marginTop: 0 },
                  visible: { 
                    height: "auto", 
                    opacity: 1, 
                    marginTop: 32 
                  }
                }}
                transition={{
                  type: "spring",
                  stiffness: 75,
                  damping: 19,
                  restDelta: 0.01
                }}
                className="overflow-hidden"
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={isActive ? "visible" : "hidden"}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 pb-4"
                >
                  {skills.map((skill) => (
                    <motion.div
                      key={skill}
                      variants={itemVariants}
                      className="flex items-center gap-3 py-1.5"
                    >
                      {/* CSS-rendered square bullet for reliable rendering across all platforms and fonts */}
                      <span className="h-1.5 w-1.5 bg-neutral-400 dark:bg-neutral-600 flex-shrink-0" />
                      <span className="font-sans text-sm md:text-base font-normal text-neutral-700 dark:text-neutral-300 tracking-tight">
                        {skill}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}