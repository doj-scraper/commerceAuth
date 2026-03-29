import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export function Header() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-ct-text-secondary/10 bg-ct-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-ct-accent flex items-center justify-center font-bold text-ct-bg italic">CT</div>
          <span className="heading-display text-xl tracking-tighter">CELL<span className="text-ct-accent">TECH</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ct-text-secondary">
          <Link href="/catalog" className="hover:text-ct-accent transition-colors">Catalog</Link>
          <Link href="#" className="hover:text-ct-accent transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-ct-accent transition-colors">Support</Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">Log In</Button>
          <Link href="/catalog">
            <Button size="sm">B2B Portal</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
