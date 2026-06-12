import React from "react";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";

export default function Home() {
  return (
    <main className="px-4 sm:px-8 max-w-7xl mx-auto space-y-24 py-12">
      <Hero />
      <Philosophy />
    </main>
  );
}


