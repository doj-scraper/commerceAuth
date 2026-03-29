import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto py-12 px-6 lg:px-12 border-t border-ct-text-secondary/10 text-ct-text-secondary">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 grayscale opacity-50">
          <div className="w-6 h-6 rounded bg-ct-text-secondary flex items-center justify-center font-bold text-ct-bg italic text-[10px]">CT</div>
          <span className="heading-display text-sm tracking-tighter">CELLTECH</span>
        </div>
        <p className="text-xs tracking-widest uppercase">© 2026 CellTech B2B Solutions. All rights reserved.</p>
        <div className="flex gap-6 text-xs uppercase tracking-widest font-mono">
          <Link href="#" className="hover:text-ct-accent transition-all">Privacy</Link>
          <Link href="#" className="hover:text-ct-accent transition-all">Terms</Link>
          <Link href="#" className="hover:text-ct-accent transition-all">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
