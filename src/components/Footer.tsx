import React from 'react';

export default function Footer() {
  return (
    <footer className="pt-10 pb-12 max-w-7xl mx-auto px-4 sm:px-8 border-t border-neutral-200 dark:border-neutral-800">
      {/* 1-column layout stack on mobile/tablet, strict 12-column grid split on desktop, bottom-aligned on lg */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-start lg:items-end">
        
        {/* Column A: Left Panel Container (7 columns) */}
        <div className="lg:col-span-7">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight uppercase w-full max-w-xl">
            AVAILABLE FOR GLOBAL ENGINEERING ENGAGEMENTS.
          </h2>
          
          {/* Contact Block */}
          <div className="space-y-2 mt-6 text-neutral-600 dark:text-neutral-400 font-sans">
            <a
              href="mailto:koiralasamir633@gmail.com"
              className="block hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              koiralasamir633@gmail.com ↗
            </a>
            <a
              href="tel:+660962286084"
              className="block hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              (+66) 096 228 6084
            </a>
          </div>

          {/* Connect Handles */}
          <div className="font-mono text-xs tracking-wider uppercase text-neutral-400 mt-8 flex flex-wrap gap-4 items-center">
            <a
              href="https://github.com/sagar-koirala"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              GITHUB ↗
            </a>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/sgr633/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              LINKEDIN ↗
            </a>
            <span>•</span>
            <a
              href="https://www.upwork.com/freelancers/~0123a2955312258964?mp_source=share"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              UPWORK ↗
            </a>
          </div>
        </div>

        {/* Column B: Right Panel Container (5 columns) */}
        <div className="lg:col-span-5 w-full">
          <span className="font-mono text-xs tracking-wider text-neutral-400 mb-6 block">
            LOGISTICS //
          </span>
          
          <div className="flex flex-col space-y-4 font-sans text-sm tracking-tight text-neutral-900 dark:text-neutral-200">
            <div>LOCATION: Bangkok, Thailand</div>
            <div>NATIONALITY: Nepalese</div>
            <div>PREFERENCE: Local (Thailand) or Global Relocation</div>
            <div>VISA STATUS: ED Visa Holder; Clear for Work Permit Transition</div>
          </div>
        </div>

      </div>

      {/* Baseline Guardrail Partition */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 mt-6 w-full flex flex-col sm:flex-row justify-between text-[11px] font-mono tracking-wide text-neutral-400 uppercase gap-4">
        <div>© 2026 SAGAR KOIRALA.</div>
        <div>Vibe coded with precision and intent alongside AI</div>
      </div>
    </footer>
  );
}
