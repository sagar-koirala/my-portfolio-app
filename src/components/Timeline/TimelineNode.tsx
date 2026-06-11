import React from 'react';

interface TimelineNodeProps {
  title: string;
  role: string;
  period: string;
  description: string;
}

export default function TimelineNode({ title, role, period, description }: TimelineNodeProps) {
  return (
    <div className="relative group">
      {/* Node indicator */}
      <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-neutral-800 bg-neutral-950 group-hover:border-neutral-400 transition-colors duration-300" />
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
        <div>
          <h3 className="text-xl font-semibold text-neutral-200">{title}</h3>
          <p className="text-sm text-neutral-400">{role}</p>
        </div>
        <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">{period}</span>
      </div>
      <p className="mt-2 text-neutral-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
