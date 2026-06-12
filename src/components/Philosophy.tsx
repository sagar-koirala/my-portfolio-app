import React from 'react';
import portfolio from '@/data/portfolio.json';

export default function Philosophy() {
  const { philosophy } = portfolio;

  return (
    <section id="philosophy" className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-mono">
          // Design Philosophy
        </h2>
        <p className="text-sm text-neutral-400 max-w-lg">
          The guiding architectural principles behind every hardware layout and firmware pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {philosophy.map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-lg bg-neutral-900/20 border border-neutral-800 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                [ 0{index + 1} ]
              </span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-100 tracking-tight">
                  {item.title}
                </h3>
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-mono">
                  {item.subtitle}
                </h4>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed pt-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
