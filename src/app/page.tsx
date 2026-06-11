import React from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-neutral-950 text-neutral-100">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-sm">
          HW
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Project Initialized</h1>
          <p className="text-sm text-neutral-400">
            Hardware &amp; Embedded Systems Engineer Portfolio environment has been successfully configured.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 text-left font-mono text-xs text-neutral-400 space-y-1">
          <div>Next.js 15+ App Router</div>
          <div>Tailwind CSS Enabled</div>
          <div>TypeScript Configured</div>
          <div>Framer Motion Installed</div>
        </div>
      </div>
    </main>
  );
}

