"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import profilePic from "@/assets/profile.png";

const navLinks = [
  { id: "hero", label: "About" },
  { id: "philosophy", label: "Approach" },
  { id: "projects", label: "Builds" },
  { id: "skills", label: "Expertise" },
  { id: "testimonials", label: "Reviews" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex justify-end md:justify-center py-2 px-4 md:px-0 pointer-events-none select-none">
      <motion.div
        initial={false}
        animate={{
          width: isScrolled ? (isMobile ? "48px" : "420px") : "100%",
          maxWidth: isScrolled ? (isMobile ? "48px" : "420px") : "1280px",
          borderRadius: isScrolled ? "9999px" : "0px",
          y: isScrolled ? 8 : 0,
          paddingLeft: isScrolled ? (isMobile ? "0px" : "12px") : "16px",
          paddingRight: isScrolled ? (isMobile ? "0px" : "12px") : "16px",
          backgroundColor: isScrolled
            ? "rgba(10, 10, 10, 0.75)"
            : "rgba(10, 10, 10, 0.3)",
          borderColor: isScrolled
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(255, 255, 255, 0.05)",
        }}
        transition={{
          type: "tween",
          ease: [0.25, 1, 0.5, 1],
          duration: 0.55,
        }}
        className="pointer-events-auto flex items-center justify-between h-12 md:h-14 border backdrop-blur-lg shadow-2xl"
      >
        {/* Left Side: Profile Icon & Name / Status */}
        <motion.div
          initial={false}
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
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="font-bold text-sm md:text-base tracking-tight text-white font-sans">
              sagar-koirala
            </span>
            <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-mono uppercase tracking-wider text-emerald-400 mt-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Open to work
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
                className={`relative px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200 ${
                  isActive
                    ? "text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {/* Underline highlight animation */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavHighlight"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"
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
          className={`flex md:hidden items-center justify-center p-2 rounded-full text-neutral-400 hover:text-white transition-colors border border-transparent ${
            isScrolled ? "w-12 h-12 hover:bg-white/5" : "border-neutral-900/50"
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

      {/* Mobile Menu Drawer (Fitted dynamically) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-16 left-4 right-4 rounded-xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl px-4 py-4 space-y-2 md:hidden pointer-events-auto shadow-2xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`w-full text-left px-4 py-3 font-mono text-[10px] uppercase tracking-wider rounded-lg border transition-all duration-200 block ${
                  activeSection === link.id
                    ? "bg-white/10 border-white/15 text-white font-bold"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
