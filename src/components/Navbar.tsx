"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import profilePic from "@/assets/profile.png";

const navLinks = [
  { id: "hero", label: "About" },
  { id: "projects", label: "Builds" },
  { id: "skills", label: "Expertise" },
  { id: "timeline", label: "Timeline" },
  { id: "philosophy", label: "Approach" },
  { id: "testimonials", label: "Reviews" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Check window size to handle smooth static width transitions
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Monitor scroll height to trigger the floating ribbon state & track active sections
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);

      const scrollPosition = window.scrollY + 160;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Read theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    requestAnimationFrame(() => {
      setTheme(isDark ? "dark" : "light");
    });
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    // Enable uniform transition on ALL elements during theme switch
    document.documentElement.classList.add("theme-transitioning");

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }

    // Remove the transition class after the animation completes
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 450);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex justify-end md:justify-center pt-3 pb-2 px-4 pointer-events-none select-none">
      {/* Wrapper to position navbar pill and theme toggle in same row */}
      <div className="relative w-full flex justify-end md:justify-center items-start">
      <motion.div
        initial={{
          width: "100%",
          maxWidth: "1280px",
          borderRadius: "20px",
          y: 4,
          paddingLeft: "16px",
          paddingRight: "16px",
          backgroundColor: "var(--nav-bg)",
          borderColor: "var(--nav-border)",
        }}
        animate={{
          width: isScrolled ? (isMobile ? "48px" : "540px") : "100%",
          maxWidth: isScrolled ? (isMobile ? "48px" : "540px") : "1280px",
          borderRadius: isScrolled ? "28px" : "20px",
          y: isScrolled ? 8 : 4,
          paddingLeft: isScrolled ? (isMobile ? "0px" : "12px") : "16px",
          paddingRight: isScrolled ? (isMobile ? "0px" : "12px") : "16px",
          backgroundColor: isScrolled
            ? "var(--nav-bg-scrolled)"
            : "var(--nav-bg)",
          borderColor: isScrolled
            ? "var(--nav-border-scrolled)"
            : "var(--nav-border)",
        }}
        transition={{
          type: "tween",
          ease: [0.25, 1, 0.5, 1],
          duration: 0.55,
        }}
        className="pointer-events-auto flex items-center justify-between h-12 md:h-14 border backdrop-blur-xl shadow-lg"
      >
        {/* Left Side: Profile Icon & Name / Status */}
        <motion.div
          initial={{
            width: 180,
            opacity: 1,
            scale: 1,
            marginRight: 16,
          }}
          animate={{
            width: isScrolled ? 0 : 180,
            opacity: isScrolled ? 0 : 1,
            scale: isScrolled ? 0.8 : 1,
            marginRight: isScrolled ? 0 : 16,
          }}
          transition={{
            type: "tween",
            ease: [0.25, 1, 0.5, 1],
            duration: 0.55,
          }}
          className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
            <Image
              src={profilePic}
              alt="Sagar Koirala Profile Icon"
              fill
              sizes="32px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="font-bold text-base md:text-[17px] tracking-tight text-neutral-900 dark:text-white font-sans">
              sagar-koirala
            </span>
          </div>
        </motion.div>

        {/* Center/Right Side: Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative px-3 py-1.5 font-mono text-[11px] md:text-xs uppercase tracking-wider transition-colors duration-200 ${
                  isActive
                    ? "text-neutral-900 dark:text-white font-bold"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {/* Underline highlight animation */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavHighlight"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 dark:bg-white rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Button (Centered inside the circle when scrolled) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex md:hidden items-center justify-center p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors border border-transparent ${
            isScrolled ? "w-12 h-12 hover:bg-black/5 dark:hover:bg-white/5" : "border-neutral-900/50"
          }`}
          aria-label="Toggle Navigation Menu"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </motion.div>

      {/* Floating Theme Switcher Button (Desktop only) — positioned absolute to the wrapper so it's vertically centered with the pill */}
      <button
        onClick={toggleTheme}
        className="pointer-events-auto hidden md:flex absolute right-0 top-1/2 -translate-y-5.5 w-13 h-13 rounded-full bg-white/50 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 ring-1 ring-neutral-950/5 dark:ring-white/10 shadow-lg items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/30 dark:hover:bg-neutral-800/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-30"
        aria-label="Toggle Theme"
      >
        {theme === "dark" ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      </div>

      {/* Mobile Menu Drawer (Fitted dynamically) — outside wrapper so it positions relative to full-width header */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-16 left-4 right-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-neutral-950/80 backdrop-blur-xl px-4 py-4 space-y-2 md:hidden pointer-events-auto shadow-2xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`w-full text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg border transition-all duration-200 block ${
                  activeSection === link.id
                    ? "bg-neutral-100 dark:bg-white/10 border-neutral-300 dark:border-white/15 text-neutral-900 dark:text-white font-bold"
                    : "border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Mobile Drawer Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="w-full text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg border border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center justify-between transition-all duration-200 cursor-pointer"
            >
              <span>THEME: {theme === "dark" ? "DARK" : "LIGHT"}</span>
              {theme === "dark" ? (
                <span className="text-amber-500 font-bold">☀️ LIGHT MODE</span>
              ) : (
                <span className="text-indigo-400 font-bold">🌙 DARK MODE</span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
