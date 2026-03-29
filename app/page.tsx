// app/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Search,
  Command,
  Cpu,
  Zap,
  Layers,
  ShieldCheck,
  Database,
  Truck
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 lg:px-12 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-ct-accent/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,192,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,192,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Floating circuit elements */}
        <FloatingElement className="top-20 left-[10%]" delay={0}>
          <Cpu className="w-6 h-6 text-ct-accent/30" />
        </FloatingElement>
        <FloatingElement className="top-28 right-[15%]" delay={0.5}>
          <Zap className="w-5 h-5 text-ct-accent/20" />
        </FloatingElement>
        <FloatingElement className="bottom-32 left-[20%]" delay={1}>
          <Layers className="w-8 h-8 text-ct-accent/25" />
        </FloatingElement>
        <FloatingElement className="bottom-28 right-[10%]" delay={1.5}>
          <div className="w-12 h-12 border border-ct-accent/10 rounded-lg rotate-12" />
        </FloatingElement>
        
        {/* Crosshair lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-ct-accent/10 to-transparent" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-ct-accent/10 to-transparent" />
      </div>

      {/* Central Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-12">
        <Badge variant="accent" className="mb-6 uppercase tracking-[0.2em] font-bold">
          B2B Wholesale Platform
        </Badge>
        
        <h1 className="heading-display text-4xl sm:text-5xl lg:text-7xl mb-4 leading-[0.9]">
          PRECISION <span className="text-ct-accent">COMPONENTS</span>
        </h1>
        
        <p className="text-ct-text-secondary text-base lg:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Enterprise-grade cell phone parts for high-volume service centers.
          Real-time inventory. Verified quality.
        </p>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto">
          <p className="text-ct-text text-base mb-3 font-medium">
            What are you looking for today?
          </p>
          
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-ct-accent/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            
            <div className="relative flex items-center bg-ct-bg-secondary/80 border border-ct-text-secondary/20 rounded-2xl overflow-hidden focus-within:border-ct-accent/50 focus-within:shadow-[0_0_30px_rgba(0,229,192,0.15)] transition-all">
              <div className="pl-5 text-ct-text-secondary">
                <Search className="w-5 h-5" />
              </div>
              
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by SKU, model, or part type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-3 py-4 text-ct-text placeholder:text-ct-text-secondary/40 focus:outline-none text-base"
              />
              
              <div className="pr-2">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-ct-bg rounded-lg text-xs font-mono text-ct-text-secondary border border-ct-text-secondary/10">
                  <Command className="w-3 h-3" /> /
                </kbd>
              </div>
              
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="mr-2 px-5 py-2.5 bg-ct-accent text-ct-bg font-semibold rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          <p className="mt-3 text-xs text-ct-text-secondary/60">
            Try: "iPhone 15 Pro Battery", "Galaxy S24 Screen", or SKU "AI-IP15PR-1A-OR"
          </p>
        </div>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
          <Link href="/catalog">
            <span className="text-ct-text-secondary hover:text-ct-accent transition-colors underline underline-offset-4">
              Browse Catalog
            </span>
          </Link>
          <span className="text-ct-text-secondary/30">|</span>
          <Link href="/features">
            <span className="text-ct-text-secondary hover:text-ct-accent transition-colors underline underline-offset-4">
              Why CellTech
            </span>
          </Link>
          <span className="text-ct-text-secondary/30">|</span>
          <Link href="/catalog?brand=Apple">
            <span className="text-ct-text-secondary hover:text-ct-accent transition-colors underline underline-offset-4">
              Apple
            </span>
          </Link>
          <span className="text-ct-text-secondary/30">|</span>
          <Link href="/catalog?brand=Samsung">
            <span className="text-ct-text-secondary hover:text-ct-accent transition-colors underline underline-offset-4">
              Samsung
            </span>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-ct-text-secondary/50">
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified OEM</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Database className="w-4 h-4" />
            <span>Real-time Stock</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Truck className="w-4 h-4" />
            <span>Next-day Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating animation component
function FloatingElement({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <div 
      className={`absolute ${className}`}
      style={{ 
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: string, className?: string }) {
  const variants: Record<string, string> = {
    accent: "bg-ct-accent/10 text-ct-accent border-ct-accent/20",
    default: "bg-ct-bg-secondary text-ct-text-secondary border-ct-text-secondary/20",
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
