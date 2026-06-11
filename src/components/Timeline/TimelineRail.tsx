import React from 'react';

interface TimelineRailProps {
  children?: React.ReactNode;
}

export default function TimelineRail({ children }: TimelineRailProps) {
  return (
    <div className="relative border-l border-neutral-800 ml-4 pl-8 space-y-12">
      {children}
    </div>
  );
}
