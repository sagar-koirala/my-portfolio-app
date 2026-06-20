"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectMetadata } from "@/data/projects";

interface ProjectCardProps {
  project: ProjectMetadata;
  onClick: () => void;
  /** When true, renders compact mobile layout inside the grid */
  gridVariant?: boolean;
}

export default function ProjectCard({ project, onClick, gridVariant = false }: ProjectCardProps) {
  const isFlagship = project.priority === "flagship";
  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [mounted, setMounted] = useState(false);
  const [clientMousePos, setClientMousePos] = useState({ x: 0, y: 0 });
  const [showCue, setShowCue] = useState(false);
  const cueTimerRef = useRef<NodeJS.Timeout | null>(null);

  const videoSrc = project.videos && project.videos[0] ? project.videos[0] : null;

  // Mount tracking to prevent SSR issues with Portals
  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => {
      if (cueTimerRef.current) {
        clearTimeout(cueTimerRef.current);
      }
    };
  }, []);

  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Slideshow interval for card when hovered
  useEffect(() => {
    if (hovered) {
      if (project.images && project.images.length > 1) {
        // Wait 500ms after mouse enters before initiating change
        enterTimeoutRef.current = setTimeout(() => {
          setImageIndex((prev) => (prev + 1) % project.images.length);

          intervalRef.current = setInterval(() => {
            setImageIndex((prev) => (prev + 1) % project.images.length);
          }, 2500);
        }, 500);
      }
    } else {
      // Clear timers immediately when mouse leaves (do NOT reset imageIndex)
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
        enterTimeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hovered, project.images]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setClientMousePos({
      x: e.clientX,
      y: e.clientY,
    });

    setShowCue(false);
    if (cueTimerRef.current) {
      clearTimeout(cueTimerRef.current);
    }

    cueTimerRef.current = setTimeout(() => {
      setShowCue(true);
    }, 1000); // 1 second static hover
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setShowCue(false);
    if (cueTimerRef.current) {
      clearTimeout(cueTimerRef.current);
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const renderTooltipPortal = () => {
    if (!mounted || !showCue) return null;
    return createPortal(
      <AnimatePresence>
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            left: clientMousePos.x + 14,
            top: clientMousePos.y + 14,
            pointerEvents: "none",
            zIndex: 9999,
          }}
          className="bg-black/60 backdrop-blur-md border border-white/10 ring-1 ring-white/20 text-white font-mono text-[9px] uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl whitespace-nowrap"
        >
          Click to view Details
        </motion.span>
      </AnimatePresence>,
      document.body
    );
  };

  if (isFlagship) {
    return (
      <motion.div
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        whileHover={{ 
          y: -2
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400/20 dark:hover:border-white/15 bg-neutral-50/30 dark:bg-neutral-900/30 hover:bg-neutral-100/65 dark:hover:bg-neutral-900/65 backdrop-blur-md p-5 sm:p-8 flex flex-col lg:flex-row gap-6 sm:gap-8 relative group overflow-hidden cursor-pointer shadow-lg select-none w-full transition-colors duration-200"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-200/10 dark:from-neutral-900/10 via-transparent to-black/[0.005] dark:to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Thumbnail Image / Video / Slideshow */}
        <div className="w-full lg:w-1/2 relative aspect-video overflow-hidden border border-neutral-200 dark:border-neutral-800/80 rounded-lg bg-neutral-100 dark:bg-neutral-900/40">
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              poster={project.thumbnail.src}
              className="object-cover w-full h-full group-hover:scale-[1.01] transition-transform duration-500"
            />
          ) : project.images && project.images.length > 1 ? (
            <div className="w-full h-full relative overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.div
                  key={imageIndex}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 24,
                    mass: 0.8
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={project.images[imageIndex]}
                    alt={`${project.title} slide ${imageIndex + 1}`}
                    fill
                    sizes="(max-w-1024px) 100vw, 50vw"
                    className="object-cover w-full h-full"
                    placeholder="blur"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(max-w-1024px) 100vw, 50vw"
              className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
              placeholder="blur"
            />
          )}
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between py-1 min-w-0">
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase shrink-0">
                FLAGSHIP BUILD
              </span>
              <span className="h-[1px] flex-grow bg-neutral-200 dark:bg-neutral-800/30 font-mono min-w-0" />
            </div>
            
            <h3 className="text-xl sm:text-4xl font-black font-sans uppercase tracking-tighter text-neutral-900 dark:text-white leading-none group-hover:text-black dark:group-hover:text-neutral-100 transition-colors">
              {project.title}
            </h3>
            
            <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              {project.tagline}
            </p>
          </div>

          <div className="space-y-4 mt-6 min-w-0">
            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 text-[9px] font-mono tracking-wider uppercase bg-neutral-100/50 dark:bg-neutral-800/30 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800/50 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* View prompt */}
            <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-300 transition-colors duration-300 tracking-widest uppercase pt-3 border-t border-neutral-200 dark:border-neutral-900/40 w-full min-w-0">
              <span className="truncate max-w-[70%] min-w-0">EXPLORE SCHEMATICS & FIRMWARE</span>
              <span className="group-hover:translate-x-1 transition-transform shrink-0 ml-2">VIEW DETAILS ↗</span>
            </div>
          </div>
        </div>

        {renderTooltipPortal()}
      </motion.div>
    );
  }

  // ── Shared thumbnail block ──────────────────────────────────────────────
  const thumbnailBlock = (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/40">
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          poster={project.thumbnail.src}
          className="object-cover w-full h-full group-hover:scale-[1.01] transition-transform duration-500"
        />
      ) : project.images && project.images.length > 1 ? (
        <div className="w-full h-full relative overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={imageIndex}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 24,
                mass: 0.8,
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={project.images[imageIndex]}
                alt={`${project.title} slide ${imageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover w-full h-full"
                placeholder="blur"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
          placeholder="blur"
        />
      )}
    </div>
  );

  // ── Mobile compact card (used inside grid on small screens) ─────────────
  if (gridVariant) {
    return (
      <motion.div
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="w-full h-full rounded-xl bg-neutral-50/30 dark:bg-neutral-900/30 hover:bg-neutral-100/65 dark:hover:bg-neutral-900/65 border border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-md overflow-hidden cursor-pointer shadow-lg select-none transition-colors duration-200 group flex flex-col"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-200/10 dark:from-neutral-900/10 via-transparent to-black/[0.005] dark:to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900/40">
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              poster={project.thumbnail.src}
              className="object-cover w-full h-full group-hover:scale-[1.01] transition-transform duration-500"
            />
          ) : project.images && project.images.length > 1 ? (
            <div className="w-full h-full relative overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.div
                  key={imageIndex}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.8 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={project.images[imageIndex]}
                    alt={`${project.title} slide ${imageIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover w-full h-full"
                    placeholder="blur"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
              placeholder="blur"
            />
          )}
        </div>

        {/* Content — compact on mobile, fuller on desktop */}
        <div className="p-4 md:p-5 flex flex-col gap-2 md:gap-3 flex-grow">
          <h3 className="text-sm md:text-base font-black font-sans uppercase tracking-tight text-neutral-900 dark:text-white group-hover:text-black dark:group-hover:text-neutral-100 transition-colors leading-tight line-clamp-2">
            {project.title}
          </h3>

          {/* Short tagline — mobile only shows a clipped version */}
          <p className="text-[11px] md:text-xs text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-2 font-sans">
            {project.tagline}
          </p>

          {/* 3 tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[8px] font-mono tracking-wider uppercase bg-neutral-100/50 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800/50 rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[8px] font-mono text-neutral-400 self-center pl-0.5">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        </div>

        {renderTooltipPortal()}
      </motion.div>
    );
  }

  // ── Standard Card (carousel / non-grid legacy) ──────────────────────────
  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="shrink-0 w-[270px] md:w-[420px] h-full rounded-xl bg-neutral-50/30 dark:bg-neutral-900/30 hover:bg-neutral-100/65 dark:hover:bg-neutral-900/65 border border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-md p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 relative group overflow-hidden cursor-pointer shadow-lg select-none transition-colors duration-200"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-neutral-200/10 dark:from-neutral-900/10 via-transparent to-black/[0.005] dark:to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {thumbnailBlock}

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow gap-4 sm:gap-5">
        <div className="space-y-1.5">
          <h3 className="text-sm sm:text-xl font-black font-sans uppercase tracking-tight text-neutral-900 dark:text-white group-hover:text-black dark:group-hover:text-neutral-100 transition-colors line-clamp-2 leading-tight">
            {project.title}
          </h3>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[8.5px] font-mono tracking-wider uppercase bg-neutral-100/50 dark:bg-neutral-800/30 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800/50 rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-[8px] sm:text-[8.5px] font-mono text-neutral-500 self-center pl-1">
              +{project.techStack.length - 3} MORE
            </span>
          )}
        </div>
      </div>

      {renderTooltipPortal()}
    </motion.div>
  );
}
