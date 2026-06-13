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
      animate={{
        scale: isActive ? 1.15 : 1.0,
        borderColor: isActive ? "rgba(255, 255, 255, 1)" : "rgba(163, 163, 163, 1)",
        boxShadow: isActive 
          ? "0 0 15px rgba(255, 255, 255, 0.4)" 
          : "0 0 0px rgba(0, 0, 0, 0)",
      }}
      whileHover={{
        scale: isActive ? 1.15 : 1.05,
        borderColor: "rgba(255, 255, 255, 1)",
      }}
      transition={{ type: "spring", stiffness: 110, damping: 20 }}
      className="group select-none border-2 w-12 h-12 bg-white flex items-center justify-center cursor-pointer rounded-full relative z-10 focus:outline-none overflow-hidden"
    >
      {logo ? (
        <Image
          src={logo}
          alt={`${company} Logo`}
          width={48}
          height={48}
          className="w-full h-full object-contain p-1.5 rounded-full"
        />
      ) : (
        <Briefcase className="w-4 h-4 text-neutral-800" />
      )}
      
      {/* Tooltip for company name on hover */}
      <div className="absolute top-[-32px] left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-800 text-[9px] font-mono uppercase tracking-widest text-neutral-300 px-2 py-0.5 rounded-none opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
        {company}
      </div>
    </motion.div>
  );
}

