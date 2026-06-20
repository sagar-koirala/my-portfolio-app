"use client";

import React, { useEffect, useState, useRef, ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectMetadata } from "@/data/projects";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  loading: () => <div className="animate-pulse py-4 font-mono text-xs text-neutral-400">Loading description...</div>
});

const Github = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FolderCode = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    <path d="m10 10-2 2 2 2" />
    <path d="m14 14 2-2-2-2" />
  </svg>
);

const LinkIcon = ({ size = 13, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);



const ChevronRight = ({ size = 16 }: { size?: number }) => (
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }, // EaseOutQuart
  },
};

const panelVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 300,
      mass: 0.8
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 35,
    transition: {
      duration: 0.22,
      ease: [0.36, 0.07, 0.19, 0.97] as const // Custom fast ease-in-out curve
    }
  }
};

interface ModalCarouselCardProps {
  project: ProjectMetadata;
  onClick: () => void;
}

function ModalCarouselCard({ project, onClick }: ModalCarouselCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const preloadImages = project.images && project.images.length > 1 ? (
    <div className="absolute w-0 h-0 opacity-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {project.images.map((img, idx) => (
        <Image
          key={idx}
          src={img}
          alt="Preload"
          fill
          sizes="(max-w-640px) 256px, 320px"
          loading="eager"
        />
      ))}
    </div>
  ) : null;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-shrink-0 w-56 sm:w-80 text-left bg-neutral-50 dark:bg-neutral-950/20 hover:bg-neutral-100 dark:hover:bg-neutral-950/40 border border-neutral-200/60 dark:border-transparent p-4 rounded-xl group transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800/40">
        {project.images && project.images.length > 1 ? (
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
                  sizes="(max-w-640px) 256px, 320px"
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
            sizes="(max-w-640px) 256px, 320px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            placeholder="blur"
          />
        )}
      </div>
      <h5 className="mt-3 font-mono text-[10px] sm:text-[11px] font-bold text-neutral-800 dark:text-neutral-300 uppercase tracking-tight truncate group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
        {project.title}
      </h5>
      <p className="mt-1 text-[10px] sm:text-[11px] text-neutral-600 dark:text-neutral-500 line-clamp-2 leading-relaxed font-sans">
        {project.tagline}
      </p>
      {preloadImages}
    </button>
  );
}

const markdownComponents = {
  // Override headers
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => (
    <h3 className="text-lg sm:text-xl font-bold font-mono tracking-tight uppercase text-neutral-900 dark:text-white mt-7 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
      {children}
    </h3>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
    <h4 className="text-base sm:text-lg font-bold font-mono tracking-tight uppercase text-neutral-800 dark:text-neutral-200 mt-5 mb-2.5 border-b border-neutral-200 dark:border-neutral-800 pb-1">
      {children}
    </h4>
  ),
  // Override lists
  ul: ({ children }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="list-disc list-outside mb-4 pl-5 text-sm text-neutral-600 dark:text-neutral-400 space-y-1.5 font-sans">
      {children}
    </ul>
  ),
  ol: ({ children }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="list-decimal list-outside mb-4 pl-5 text-sm text-neutral-600 dark:text-neutral-400 space-y-1.5 font-sans">
      {children}
    </ol>
  ),
  li: ({ children }: ComponentPropsWithoutRef<"li">) => (
    <li className="text-sm leading-relaxed pl-0.5">
      {children}
    </li>
  ),
  // Override paragraphs
  p: ({ children }: ComponentPropsWithoutRef<"p">) => (
    <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans mb-4">
      {children}
    </p>
  ),
  // Override bold
  strong: ({ children }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-bold text-neutral-800 dark:text-neutral-200">
      {children}
    </strong>
  ),
  // Override pre and code blocks
  pre: ({ children }: ComponentPropsWithoutRef<"pre">) => (
    <pre className="my-4 p-4 rounded-lg bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 overflow-x-auto text-neutral-300">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const isBlock = className || (typeof children === 'string' && children.includes('\n'));
    return isBlock ? (
      <code className="font-mono text-xs text-neutral-300" {...props}>
        {children}
      </code>
    ) : (
      <code className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-300 px-1.5 py-0.5 rounded" {...props}>
        {children}
      </code>
    );
  },
  // Override media (Images / Videos)
  img: ({ src, alt }: ComponentPropsWithoutRef<"img">) => {
    if (!src || typeof src !== "string") return null;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    const isVideo = videoExtensions.some(ext => src.toLowerCase().endsWith(ext));

    if (isVideo) {
      return (
        <span className="block my-6 w-full">
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="w-full h-auto rounded-lg border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-[#121212]/50 object-contain shadow-sm"
          />
          {alt && (
            <span className="block mt-2 text-center text-xs font-mono text-neutral-400 dark:text-neutral-500">
              {alt}
            </span>
          )}
        </span>
      );
    }

    return (
      <span className="block my-6 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-lg border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-[#121212]/50 object-contain shadow-sm"
          loading="lazy"
        />
      </span>
    );
  },
  // Override Tables
  table: ({ children }: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-neutral-50 dark:bg-neutral-900/50">
      {children}
    </thead>
  ),
  tbody: ({ children }: ComponentPropsWithoutRef<"tbody">) => (
    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-[#121212]">
      {children}
    </tbody>
  ),
  tr: ({ children }: ComponentPropsWithoutRef<"tr">) => (
    <tr className="divide-x divide-neutral-200 dark:divide-neutral-800">
      {children}
    </tr>
  ),
  th: ({ children }: ComponentPropsWithoutRef<"th">) => (
    <th className="px-4 py-3 font-mono text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
      {children}
    </th>
  ),
  td: ({ children }: ComponentPropsWithoutRef<"td">) => (
    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 font-sans">
      {children}
    </td>
  ),
};

interface ProjectDetailModalProps {
  isOpen: boolean;
  project: ProjectMetadata | null;
  allProjects: ProjectMetadata[];
  onClose: () => void;
  onSelectProject: (project: ProjectMetadata) => void;
}

export default function ProjectDetailModal({
  isOpen,
  project,
  allProjects,
  onClose,
  onSelectProject,
}: ProjectDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);
  const prevSlugRef = useRef<string | undefined>(undefined);

  if (project?.slug !== prevSlugRef.current) {
    setShowHeader(true);
    prevSlugRef.current = project?.slug;
  }

  const otherProjects = project ? allProjects.filter((p) => p.slug !== project.slug) : [];

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
      const reachedEnd = scrollLeft + clientWidth >= scrollWidth - 2;
      setCanScrollRight(!reachedEnd);
    }
  };

  // Scroll back to top whenever the selected project changes
  useEffect(() => {
    if (leftSidebarRef.current) {
      leftSidebarRef.current.scrollTop = 0;
    }
    if (rightContentRef.current) {
      rightContentRef.current.scrollTop = 0;
    }
    if (carouselRef.current) {
      carouselRef.current.scrollTop = 0;
    }
    lastScrollTopRef.current = 0;
  }, [project?.slug]);

  // Prevent body scroll when modal is open and bind Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Watch bottom carousel scroll position to fade out right navigation arrow
  useEffect(() => {
    const el = carouselRef.current;
    if (el && isOpen) {
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
  }, [isOpen, project?.slug, otherProjects.length]);

  if (!project) return null;

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/#projects?project=${project.slug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const lastScrollTop = lastScrollTopRef.current;

    if (scrollTop <= 10) {
      // Always show header at the very top of the content
      setShowHeader(true);
    } else if (scrollTop > lastScrollTop) {
      // Scrolling down (reading forward) -> Hide header
      setShowHeader(false);
    } else if (scrollTop < lastScrollTop) {
      // Scrolling up (reading backward) -> Show header
      setShowHeader(true);
    }
    lastScrollTopRef.current = scrollTop;
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 340; // Approx card width + gap
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 500);
    }
  };

  const renderSidebarMetadata = (isMobileView: boolean) => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`flex flex-col gap-6 ${isMobileView ? "pb-6" : ""}`}
      >
        {/* My Role Block */}
        <motion.div variants={itemVariants}>
          <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block">
            My Role
          </span>
          <span className="font-sans text-xs text-neutral-800 dark:text-neutral-200 font-semibold mt-1 block">
            {project.role}
          </span>
        </motion.div>

        {/* Published Date Block */}
        <motion.div variants={itemVariants}>
          <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block">
            Published Date
          </span>
          <span className="font-sans text-xs text-neutral-800 dark:text-neutral-200 font-semibold mt-1 block">
            {project.publishedDate}
          </span>
        </motion.div>

        {/* System Metrics Blocks */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block">
            System Metrics
          </span>
          <div className="flex flex-col gap-3">
            {project.specs.map((spec) => (
              <div key={spec.label} className="pb-1">
                <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block">
                  {spec.label}
                </span>
                <span className="font-sans text-xs text-neutral-800 dark:text-neutral-200 font-semibold mt-1 block">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills Pills */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2.5">
          <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block">
            Stack / Tools
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-neutral-100/50 dark:bg-neutral-800/30 border border-neutral-200/60 dark:border-neutral-800/50 text-neutral-600 dark:text-neutral-400 text-[10px] px-3 py-1 rounded-full font-mono uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Mobile-only Inline CTA links */}
        {isMobileView && (
          <motion.div variants={itemVariants} className="flex flex-col gap-2.5 mt-2">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono text-xs uppercase tracking-wider py-2.5 transition-colors duration-300 flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-800/80 rounded-lg bg-neutral-100 dark:bg-neutral-900/40 select-none cursor-pointer"
              >
                <Github size={14} className="text-neutral-400" />
                <span>VIEW REPOSITORY</span>
              </a>
            )}
            {project.links.workspace && project.links.workspace !== project.links.github && (
              <a
                href={project.links.workspace}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono text-xs uppercase tracking-wider py-2.5 transition-colors duration-300 flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-800/80 rounded-lg bg-neutral-100 dark:bg-neutral-900/40 select-none cursor-pointer"
              >
                <FolderCode size={14} className="text-neutral-400" />
                <span>EXPLORE WORKSPACE</span>
              </a>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 overflow-hidden">
          {/* Backdrop Click Area & Lighter Frosted Glass Overlay with 22% Whiteness */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm cursor-pointer z-0"
          />

          {/* The Floating Card Shell (Bleeds to full screen on mobile, fits console box on desktop) */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full h-full max-w-full md:max-w-[85%] md:h-[95vh] bg-white dark:bg-[#121212] rounded-none md:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.08)] dark:shadow-[0_0_50px_rgba(255,255,255,0.035)] border-0 md:border border-neutral-200 dark:border-neutral-800/80 flex flex-col z-10 overflow-hidden cursor-default"
          >
            {/* Circular Close Button (✕) - High hover highlights and scale transition */}
            <button
              onClick={onClose}
              className="absolute top-5 right-4 md:right-8 w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 ring-1 ring-black/5 dark:ring-black/30 shadow-lg flex items-center justify-center text-black dark:text-white hover:bg-black/25 dark:hover:bg-white/45 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-30"
              aria-label="Close modal"
            >
              <span className="text-lg font-sans leading-none drop-shadow-none dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">✕</span>
            </button>

            {/* Sticky Header Bar Component (Animate slide-up on scroll with transparent glassmorphism - rounded-t-none on mobile) */}
            <div
              style={{
                transform: showHeader ? "translateY(0)" : "translateY(-5rem)",
              }}
              className="absolute top-0 left-0 w-full h-20 bg-white/70 dark:bg-[#121212]/70 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800/80 z-20 flex items-center justify-between pl-4 pr-20 md:pl-8 md:pr-28 shrink-0 rounded-t-none md:rounded-t-3xl transition-transform duration-300 ease-in-out"
            >
              {/* Left Side: Title with Reveal Rise Animation */}
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                className="text-xl font-bold uppercase tracking-tight text-neutral-900 dark:text-neutral-100 truncate pr-4"
              >
                {project.title}
              </motion.h2>

              {/* Right Side: Copy Link */}
              <div className="flex items-center gap-6 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-300 cursor-pointer select-none"
                >
                  <LinkIcon size={14} className="text-neutral-400" />
                  <span>{copied ? "COPIED!" : "COPY LINK"}</span>
                </button>
              </div>
            </div>

            {/* The Body Split Wrapper (rounded-b-none on mobile - scrolls on mobile, contains desktop independent scrolling columns) */}
            <div 
              onScroll={handleScroll}
              className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden rounded-b-none md:rounded-b-3xl h-full bg-white dark:bg-[#121212] pt-24 md:pt-0"
            >
                         {/* Left Sidebar (30% Width - Unified Background, Absolute Floating Bottom Links) */}
              <div className="hidden md:flex w-full md:w-[30%] h-auto md:h-full flex flex-col bg-neutral-50 dark:bg-[#121212] shrink-0 relative overflow-visible md:overflow-hidden">
                {/* Scrollable details container (translates up/down on scroll) */}
                <div
                  ref={leftSidebarRef}
                  className={`flex-grow md:flex-1 overflow-visible md:overflow-y-auto p-8 pt-28 pb-6 md:pb-32 flex flex-col gap-6 scrollbar-none transition-transform duration-300 ease-in-out ${
                    showHeader ? "translate-y-0" : "md:-translate-y-20"
                  }`}
                >
                  {renderSidebarMetadata(false)}

                  {/* 2px Gradient Divider with Blurred Ends (at the end of skills) */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-25% via-neutral-200 dark:via-neutral-800/60 via-75% to-transparent mt-6 shrink-0" />
                </div>
 
                {/* Floating bottom CTA links (Always fixed absolutely at the bottom on desktop, does NOT translate, borderless top) */}
                <div className="absolute bottom-0 left-0 w-full p-8 pb-10 pt-6 bg-neutral-50/95 dark:bg-[#121212]/95 backdrop-blur-md shrink-0 hidden md:flex flex-col gap-2.5 z-10">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono text-xs uppercase tracking-wider py-2 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer select-none"
                    >
                      <Github size={14} className="text-neutral-400" />
                      <span>VIEW REPOSITORY</span>
                    </a>
                  )}
                  {project.links.workspace && project.links.workspace !== project.links.github && (
                    <a
                      href={project.links.workspace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono text-xs uppercase tracking-wider py-2 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer select-none"
                    >
                      <FolderCode size={14} className="text-neutral-400" />
                      <span>EXPLORE WORKSPACE</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Content Pane (70% Width - Unified Background) */}
              <div
                ref={rightContentRef}
                onScroll={handleScroll}
                className="w-full md:w-[70%] flex-1 h-auto md:h-full overflow-visible md:overflow-y-auto p-8 pt-0 md:pt-28 custom-scrollbar bg-white dark:bg-[#121212] flex flex-col gap-8"
              >
                {/* Description Body with Reveal Rise Animation */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                  className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed text-sm sm:text-base"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {project.description}
                  </ReactMarkdown>
                </motion.div>

                {/* System Visuals List with Reveal Rise Animation */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col gap-6"
                >
                  <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block select-none">
                    System Visuals / Diagrams
                  </span>
                  <div className="flex flex-col gap-6">
                    {/* Project Videos */}
                    {project.videos?.map((vid, i) => (
                      <div key={`vid-${i}`} className="w-full">
                        <video
                          src={vid}
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls
                          className="w-full h-auto rounded-lg border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-[#121212]/50 object-contain"
                        />
                      </div>
                    ))}

                    {/* Project Images */}
                    {project.images?.map((img, i) => (
                      <div key={`img-${i}`} className="w-full">
                        <Image
                          src={img}
                          alt={`${project.title} detailed asset ${i + 1}`}
                          className="object-contain w-full h-auto rounded-lg border border-neutral-200 dark:border-neutral-800/80"
                          placeholder="blur"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Mobile-Only Metadata Sidebar (placed under visual diagrams, before more projects carousel) */}
                <div className="flex md:hidden flex-col gap-6 mt-4">
                  {renderSidebarMetadata(true)}
                </div>

                {/* 2px Gradient Divider with Blurred Ends (same style as left sidebar) */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-25% via-neutral-200 dark:via-neutral-800/60 via-75% to-transparent mt-6 mb-4 shrink-0" />

                {/* Bottom Carousel ("More by Sagar K.") */}
                <div className="mt-0 flex flex-col gap-4">
                  <div className="flex justify-between items-center select-none">
                    <h4 className="font-mono text-xs sm:text-sm tracking-[0.2em] text-neutral-900 dark:text-white font-bold uppercase">
                      More by Sagar K.
                    </h4>
                  </div>

                  <div className="relative group/carousel w-full">
                    {/* Right Scroll Button (centered on image with pulsing wave animation, fades out at scroll end) */}
                    <button
                      onClick={() => scrollCarousel("right")}
                      className={`absolute right-2 top-[97px] -translate-y-1/2 w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 ring-1 ring-black/5 dark:ring-black/30 shadow-lg hidden md:flex items-center justify-center text-black dark:text-white hover:bg-black/25 dark:hover:bg-white/45 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-10 select-none ${
                        canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                      }`}
                      aria-label="Scroll carousel right"
                    >
                      {/* Wave ripple effect */}
                      <span className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/20 animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
                      <ChevronRight />
                    </button>

                    <div
                      ref={carouselRef}
                      className="flex gap-4 overflow-x-auto pb-4 scrollbar-none md:scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent scroll-smooth"
                    >
                    {otherProjects.map((p) => (
                      <ModalCarouselCard
                        key={p.slug}
                        project={p}
                        onClick={() => onSelectProject(p)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
