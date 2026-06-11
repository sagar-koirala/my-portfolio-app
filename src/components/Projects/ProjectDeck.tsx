import React from 'react';
import ProjectCard from './ProjectCard';

export default function ProjectDeck() {
  return (
    <section id="projects" className="py-20 max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold tracking-tight text-neutral-100 mb-8">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectCard
          title="Hardware Project 1"
          description="High-speed digital layout and embedded firmware integration."
          tags={["Altium", "STM32", "RTOS"]}
        />
        <ProjectCard
          title="Hardware Project 2"
          description="Power electronics and wireless sensor interface design."
          tags={["KiCad", "ESP32", "BLE"]}
        />
      </div>
    </section>
  );
}
