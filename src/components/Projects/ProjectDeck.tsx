"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "./ProjectDetailModal";
import { projects, ProjectMetadata } from "@/data/projects";

const ChevronLeft = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="drop-shadow-none dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="drop-shadow-none dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default function ProjectDeck() {
  const [selectedProject, setSelectedProject] = useState<ProjectMetadata | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
      const reachedEnd = scrollLeft + clientWidth >= scrollWidth - 2;
      setCanScrollRight(!reachedEnd);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 444; // Card width (420px) + Gap (24px)
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 500); // Check after smooth scroll completes
    }
  };

  // Set up scroll tracking across the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Balanced, smooth parallax offsets where rows glide past each other on scroll
  const yRaw1 = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const ySpring1 = useSpring(yRaw1, { stiffness: 45, damping: 22 });

  const yRaw2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const ySpring2 = useSpring(yRaw2, { stiffness: 45, damping: 22 });

  // Mobile viewport detection to bypass parallax translations
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync state with URL hash parameters on load and when the hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes("project=")) {
        const match = hash.match(/project=([^&]+)/);
        if (match && match[1]) {
          const slug = match[1];
          const found = projects.find((p) => p.slug === slug);
          if (found) {
            setSelectedProject(found);
            setIsModalOpen(true);
            return;
          }
        }
      }
    };

    // Run initial parse on mount
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleOpenModal = (project: ProjectMetadata) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    // Push the state to history so the link is shareable
    window.history.pushState(null, "", `#projects?project=${project.slug}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Clean up url hash when modal closes
    window.history.pushState(null, "", "#projects");
  };

  const handleSelectProject = (project: ProjectMetadata) => {
    setSelectedProject(project);
    // Sync address bar hash on carousel switch
    window.history.pushState(null, "", `#projects?project=${project.slug}`);
  };

  const flagshipProjects = projects.filter((p) => p.priority === "flagship");
  const standardProjects = projects.filter((p) => p.priority === "standard");

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
      window.addEventListener("resize", checkScrollPosition);
      
      const timer = setTimeout(checkScrollPosition, 100);
      return () => {
        el.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
        clearTimeout(timer);
      };
    }
  }, [standardProjects.length]);

  return (
    <section ref={containerRef} id="projects" className="py-24 scroll-mt-20 w-full overflow-hidden select-none">
      {/* Title Header */}
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-bold font-sans uppercase tracking-tighter text-neutral-900 dark:text-white">
          Featured Builds
        </h2>
      </div>

      <div className="space-y-12 md:space-y-16 w-full overflow-hidden">
        {/* Row 1: Flagships */}
        <motion.div
          style={{ y: isMobile ? 0 : ySpring1 }}
          className="w-full overflow-hidden will-change-transform"
        >
          {flagshipProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onClick={() => handleOpenModal(project)}
            />
          ))}
        </motion.div>

        {/* Row 2: Standard Projects (Horizontally Scrollable Deck) */}
        <motion.div
          style={{ y: isMobile ? 0 : ySpring2 }}
          className="w-full relative overflow-hidden will-change-transform group/deck"
        >
          {/* Subtle gradients indicating scrollability on both sides */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />

          {/* Right scroll button (centered on image with pulsing wave animation, fades out at scroll end) */}
          <button
            onClick={() => scrollCarousel("right")}
            className={`absolute right-6 top-[137px] -translate-y-1/2 w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 ring-1 ring-black/5 dark:ring-black/30 shadow-lg hidden md:flex items-center justify-center text-black dark:text-white hover:bg-black/25 dark:hover:bg-white/45 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-20 select-none ${
              canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll deck right"
          >
            {/* Wave ripple effect */}
            <span className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/20 animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
            <ChevronRight />
          </button>

          <div
            ref={carouselRef}
            className={`flex gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none w-full scroll-smooth ${
              standardProjects.length === 1
                ? "justify-center"
                : standardProjects.length === 2
                ? "justify-start md:justify-center"
                : "justify-start"
            }`}
          >
            {standardProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                onClick={() => handleOpenModal(project)}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detail Slide-Over Center Modal */}
      <ProjectDetailModal
        isOpen={isModalOpen}
        project={selectedProject}
        allProjects={projects}
        onClose={handleCloseModal}
        onSelectProject={handleSelectProject}
      />
    </section>
  );
}
