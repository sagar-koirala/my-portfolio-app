import React from 'react';

export default function Footer() {
  return (
    <footer className="py-10 border-t border-neutral-900 text-center text-xs text-neutral-500 font-mono">
      <p>&copy; {new Date().getFullYear()} Hardware &amp; Embedded Systems Engineer. All rights reserved.</p>
    </footer>
  );
}
