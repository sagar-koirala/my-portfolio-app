import React from "react";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import TimelineRail from "@/components/Timeline/TimelineRail";
import SkillsBOM from "@/components/SkillsBOM";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="px-4 sm:px-8 max-w-7xl mx-auto py-12">
      <div className="space-y-24">
        <Hero />
        <Philosophy />
        <TimelineRail />
        <SkillsBOM />
        <Testimonials />
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </main>
  );
}


