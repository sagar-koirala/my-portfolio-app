"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "./ProjectDetailModal";
import { projects, ProjectMetadata } from "@/data/projects";

// ---------------------------------------------------------------------------
// Filter categories
// ---------------------------------------------------------------------------

const PREFERRED_ORDER = ["Embedded", "PCB", "Firmware", "CAD", "Robotics", "Software"];

/** Labels for the filter UI extracted dynamically from project metadata */
const CATEGORY_LABELS = Array.from(
  new Set(projects.flatMap((p) => p.categories || []))
).sort((a, b) => {
  const idxA = PREFERRED_ORDER.indexOf(a);
  const idxB = PREFERRED_ORDER.indexOf(b);
  if (idxA === -1 && idxB === -1) return a.localeCompare(b);
  if (idxA === -1) return 1;
  if (idxB === -1) return -1;
  return idxA - idxB;
});

/** Returns true when a project belongs to the selected category */
function projectMatchesCategory(p: ProjectMetadata, category: string): boolean {
  return p.categories ? p.categories.includes(category) : false;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const ChevronDown = ({ size = 16 }: { size?: number }) => (
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
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

interface FilterChipsProps {
  tags: string[];
  active: string;
  onChange: (tag: string) => void;
}

/** Desktop inline filter chips */
function FilterChips({ tags, active, onChange }: FilterChipsProps) {
  return (
    <div className="hidden md:flex flex-wrap gap-2 items-center">
      {["All", ...tags].map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className={`
            px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase
            border transition-all duration-200 cursor-pointer whitespace-nowrap
            ${
              active === tag
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm"
                : "bg-transparent text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-200"
            }
          `}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

/** Mobile collapsed filter dropdown */
function MobileFilterDropdown({
  tags,
  active,
  onChange,
}: FilterChipsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative md:hidden" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 cursor-pointer"
      >
        <span>Filter: {active}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          <ChevronDown size={12} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-xl overflow-hidden"
          >
            {["All", ...tags].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onChange(tag);
                  setOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase
                  transition-colors duration-150 cursor-pointer
                  ${
                    active === tag
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }
                `}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const GRID_VISIBLE_LIMIT = 6; // cards shown before "See More"

export default function ProjectDeck() {
  const [selectedProject, setSelectedProject] = useState<ProjectMetadata | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Flagship project (hero) — always pinned, not affected by filter
  const heroProject = useMemo(
    () => projects.find((p) => p.priority === "flagship") ?? projects[0],
    []
  );

  // All standard (non-flagship) projects
  const standardProjects = useMemo(
    () => projects.filter((p) => p.priority !== "flagship"),
    []
  );

  // Apply active category filter to standard projects
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return standardProjects;
    return standardProjects.filter((p) => projectMatchesCategory(p, activeFilter));
  }, [standardProjects, activeFilter]);

  // Slice for see-more
  const visibleProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, GRID_VISIBLE_LIMIT);

  const hasMore = filteredProjects.length > GRID_VISIBLE_LIMIT && !showAll;



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

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setShowAll(false);
  };

  const handleOpenModal = (project: ProjectMetadata) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    window.history.pushState(null, "", `#projects?project=${project.slug}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.history.pushState(null, "", "#projects");
  };

  const handleSelectProject = (project: ProjectMetadata) => {
    setSelectedProject(project);
    window.history.pushState(null, "", `#projects?project=${project.slug}`);
  };

  return (
    <section
      ref={containerRef}
      id="projects"
      className="py-24 scroll-mt-20 w-full overflow-visible select-none"
    >
      {/* Section header */}
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-bold font-sans uppercase tracking-tighter text-neutral-900 dark:text-white">
          Featured Builds
        </h2>
      </div>

      {/* Hero Project (flagship) */}
      {heroProject && (
        <div className="mb-10">
          <ProjectCard
            project={heroProject}
            onClick={() => handleOpenModal(heroProject)}
          />
        </div>
      )}

      {/* Filter Row */}
      <div className="mb-8 flex items-center gap-3">
        <FilterChips
          tags={CATEGORY_LABELS}
          active={activeFilter}
          onChange={handleFilterChange}
        />
        <MobileFilterDropdown
          tags={CATEGORY_LABELS}
          active={activeFilter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Project Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="font-mono text-[11px] tracking-widest uppercase text-neutral-400 dark:text-neutral-600">
                No projects found for &ldquo;{activeFilter}&rdquo;
              </p>
            </div>
          ) : (
            <>
              {/* Desktop: 3-col grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map((project, i) => (
                  <motion.div
                    key={`desktop-${project.slug}`}
                    className="h-full"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.06,
                      ease: "easeOut",
                    }}
                  >
                    <ProjectCard
                      project={project}
                      onClick={() => handleOpenModal(project)}
                      gridVariant
                    />
                  </motion.div>
                ))}
              </div>

              {/* Mobile: Horizontal scrollable carousel */}
              <div className="flex md:hidden overflow-x-auto gap-4 snap-x snap-mandatory pb-6 pt-1 px-4 -mx-4 scrollbar-none scroll-smooth">
                {filteredProjects.map((project, i) => (
                  <motion.div
                    key={`mobile-${project.slug}`}
                    className="snap-start shrink-0 h-full"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <ProjectCard
                      project={project}
                      onClick={() => handleOpenModal(project)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* See More (Desktop only) */}
              {hasMore && (
                <div className="hidden md:flex justify-center mt-8">
                  <button
                    onClick={() => setShowAll(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full font-mono text-[10px] tracking-widest uppercase border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-500 dark:hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-200 cursor-pointer group"
                  >
                    <span>See {filteredProjects.length - GRID_VISIBLE_LIMIT} More</span>
                    <motion.span
                      animate={{ y: [0, 3, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                      className="flex items-center"
                    >
                      <ChevronDown size={12} />
                    </motion.span>
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Detail Modal (unchanged) */}
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
