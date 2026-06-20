import React from 'react';
import portfolio from '@/data/portfolio.json';

export default function Footer() {
  const { ctaText, email, phone, socials, logistics } = portfolio.footer;

  return (
    <footer className="pt-10 pb-12 border-t border-neutral-200 dark:border-neutral-800">
      {/* 1-column layout stack on mobile/tablet, strict 12-column grid split on desktop, bottom-aligned on lg */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-start lg:items-end">
        
        {/* Column A: Left Panel Container (7 columns) */}
        <div className="lg:col-span-7">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight uppercase w-full max-w-xl">
            {ctaText}
          </h2>
          
          {/* Contact Block */}
          <div className="space-y-2 mt-6 text-neutral-600 dark:text-neutral-400 font-sans">
            <a
              href={`mailto:${email}`}
              className="relative flex items-baseline w-fit hover:text-neutral-900 dark:hover:text-white transition-colors duration-300 cursor-pointer group"
            >
              <span className="relative pb-0.5">
                {email}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left" />
              </span>
              <span className="inline-block opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 delay-0 group-hover:delay-[150ms] ml-1">
                ↗
              </span>
            </a>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="relative w-fit block hover:text-neutral-900 dark:hover:text-white transition-colors duration-300 cursor-pointer pb-0.5 group"
            >
              <span>{phone}</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left" />
            </a>
          </div>

          {/* Connect Handles */}
          <div className="font-mono text-xs tracking-wider uppercase text-neutral-400 mt-8 flex flex-wrap gap-4 items-center">
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-baseline w-fit hover:text-neutral-900 dark:hover:text-white transition-colors duration-300 cursor-pointer group"
            >
              <span className="relative pb-0.5">
                GITHUB
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left" />
              </span>
              <span className="inline-block opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 delay-0 group-hover:delay-[150ms] ml-1">
                ↗
              </span>
            </a>
            <span>•</span>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-baseline w-fit hover:text-neutral-900 dark:hover:text-white transition-colors duration-300 cursor-pointer group"
            >
              <span className="relative pb-0.5">
                LINKEDIN
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left" />
              </span>
              <span className="inline-block opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 delay-0 group-hover:delay-[150ms] ml-1">
                ↗
              </span>
            </a>
            <span>•</span>
            <a
              href={socials.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-baseline w-fit hover:text-neutral-900 dark:hover:text-white transition-colors duration-300 cursor-pointer group"
            >
              <span className="relative pb-0.5">
                UPWORK
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left" />
              </span>
              <span className="inline-block opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 delay-0 group-hover:delay-[150ms] ml-1">
                ↗
              </span>
            </a>
          </div>
        </div>

        {/* Column B: Right Panel Container (5 columns) */}
        <div className="lg:col-span-5 w-full">
          <span className="font-mono text-xs tracking-wider text-neutral-400 mb-6 block">
            LOGISTICS
          </span>
          
          <div className="flex flex-col space-y-4 font-sans text-sm tracking-tight text-neutral-900 dark:text-neutral-200">
            <div>LOCATION: {logistics.location}</div>
            <div>NATIONALITY: {logistics.nationality}</div>
            <div>PREFERENCE: {logistics.preference}</div>
            <div>VISA STATUS: {logistics.visaStatus}</div>
          </div>
        </div>

      </div>

      {/* Baseline Guardrail Partition */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 mt-6 w-full flex flex-col sm:flex-row justify-between text-[11px] font-mono tracking-wide text-neutral-400 uppercase gap-4">
        <div>© 2026 {portfolio.profile.name.toUpperCase()}.</div>
        <div>Vibe coded with precision and intent alongside AI</div>
      </div>
    </footer>
  );
}
