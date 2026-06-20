import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export interface TimelineNodeProps {
  id: string;
  company: string;
  logo?: string;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  style?: React.CSSProperties;
}

export default function TimelineNode({
  company,
  logo,
  isActive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}: TimelineNodeProps) {
  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      initial={{
        scale: 1.0,
        borderColor: "var(--timeline-node-inactive-border)",
        backgroundColor: "var(--timeline-node-bg)",
        boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
      }}
      animate={{
        scale: isActive ? 1.15 : 1.0,
        borderColor: isActive ? "var(--timeline-node-active-border)" : "var(--timeline-node-inactive-border)",
        backgroundColor: "var(--timeline-node-bg)",
        boxShadow: isActive 
          ? "0 0 15px var(--timeline-node-shadow)" 
          : "0 0 0px rgba(0, 0, 0, 0)",
      }}
      whileHover={{
        scale: isActive ? 1.15 : 1.05,
        borderColor: "var(--timeline-node-active-border)",
        backgroundColor: "var(--timeline-node-bg)",
      }}
      transition={{ type: "spring", stiffness: 110, damping: 20 }}
      className="group select-none border-2 w-12 h-12 flex items-center justify-center cursor-pointer rounded-full relative z-10 focus:outline-none overflow-hidden"
    >
      {logo ? (
        <div className="w-full h-full bg-white flex items-center justify-center p-1.5">
          <Image
            src={logo}
            alt={`${company} Logo`}
            width={36}
            height={36}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <Briefcase className="w-4 h-4" style={{ color: "var(--timeline-node-icon)" }} />
      )}
      
      {/* Tooltip for company name on hover */}
      <div className="absolute top-[-32px] left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-800 text-[9px] font-mono uppercase tracking-widest text-neutral-300 px-2 py-0.5 rounded-none opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
        {company}
      </div>
    </motion.div>
  );
}

