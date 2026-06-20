import React from "react";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import TimelineRail from "@/components/Timeline/TimelineRail";
import ProjectDeck from "@/components/Projects/ProjectDeck";
import SkillsBOM from "@/components/SkillsBOM";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 md:pt-6 pb-12 min-w-0">
      <div className="space-y-24 w-full">
        <Hero />
        <ProjectDeck />
        <SkillsBOM />
        <TimelineRail />
        <Philosophy />
        <Testimonials />
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </main>
  );
}


