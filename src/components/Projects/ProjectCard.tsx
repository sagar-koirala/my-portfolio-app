import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
}

export default function ProjectCard({ title, description, tags }: ProjectCardProps) {
  return (
    <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-300">
      <h3 className="text-xl font-semibold text-neutral-100">{title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded bg-neutral-800 text-xs font-mono text-neutral-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
