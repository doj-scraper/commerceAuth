'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Command, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PartQuality {
  id: string;
  name: 'OEM' | 'Aftermarket' | 'Refurbished' | 'Original';
}

interface PartType {
  id: string;
  name: string;
  bucket?: {
    name: string;
  };
}

interface PartMaster {
  id: string;
  sku: string;
  partType: PartType;
  quality: PartQuality;
  price: number; // in cents (e.g., 1999 = $19.99)
  stock: number;
  brand: 'Apple' | 'Samsung';
  searchIndex: string; // space-delimited lowercase
}

interface FetchPartsResponse {
  success: boolean;
  parts: PartMaster[];
  error?: string;
}

interface ComponentState {
  parts: PartMaster[];
  loading: boolean;
  error: string | null;
}

// ============================================================================
// MAIN COMPONENT WRAPPER
// ============================================================================

export default function OmniCatalogWrapper() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OmniCatalog />
    </Suspense>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

function OmniCatalog() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [state, setState] = useState<ComponentState>({
    parts: [],
    loading: true,
    error: null,
  });

  const [activeBrand, setActiveBrand] = useState<'Apple' | 'Samsung' | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 1. Fetch real data from backend on mount
  useEffect(() => {
    let isMounted = true;

    async function loadParts() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const res = await fetch('/api/parts');

        if (!res.ok) {
          throw new Error(
            `Failed to fetch parts: ${res.status} ${res.statusText}`
          );
        }

        const data: FetchPartsResponse = await res.json();

        if (!data.success) {
          throw new Error(data.error || 'Unknown error from API');
        }

        if (!Array.isArray(data.parts)) {
          throw new Error('API returned non-array parts');
        }

        const validParts = data.parts.filter(
          (part) =>
            part.id &&
            part.sku &&
            part.brand &&
            part.price >= 0 &&
            part.stock >= 0 &&
            typeof part.searchIndex === 'string'
        );

        if (isMounted) {
          setState({ parts: validParts, loading: false, error: null });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';

        if (isMounted) {
          setState({ parts: [], loading: false, error: errorMessage });
        }

        console.error('[OmniCatalog] Fetch error:', err);
      }
    }

    loadParts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          document.getElementById('catalog-search')?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 2. Real-Time Filter with Memoization
  const filteredParts = useMemo(() => {
    return state.parts.filter((part) => {
      if (activeBrand !== 'All' && part.brand !== activeBrand) return false;

      if (!searchQuery.trim()) return true;

      const searchTerms = searchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      return searchTerms.every((term) =>
        part.searchIndex.toLowerCase().includes(term)
      );
    });
  }, [state.parts, activeBrand, searchQuery]);

  // =========================================================================
  // RENDER: Loading State
  // =========================================================================
  if (state.loading) {
    return <LoadingState />;
  }

  // =========================================================================
  // RENDER: Error State
  // =========================================================================
  if (state.error) {
    return (
      <div className="pt-32 pb-12 px-6 lg:px-12 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md text-center p-8 rounded-2xl bg-ct-bg-secondary/50 border border-red-500/20">
          <div className="text-red-400 text-lg font-bold mb-2">
            Error Loading Catalog
          </div>
          <p className="text-ct-text-secondary mb-6 text-sm">{state.error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Main UI
  // =========================================================================
  return (
    <div className="pt-32 pb-12 px-6 lg:px-12 max-w-7xl mx-auto selection:bg-ct-accent selection:text-ct-bg">
      <header className="mb-10 text-center">
        <p className="text-micro text-ct-accent mb-3 tracking-widest">CellTech B2B Explorer</p>
        <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-ct-text mb-4">
          PARTS <span className="text-ct-accent">CATALOG</span>
        </h1>
        <p className="text-ct-text-secondary text-sm lg:text-base max-w-2xl mx-auto leading-relaxed">
          Access our complete inventory of original and high-quality replacement parts. 
          Use the command search to locate specific components.
        </p>
      </header>

      {/* Brand Toggle */}
      <div className="flex justify-center mb-12">
        <div
          className="flex p-1 bg-ct-bg-secondary border border-ct-text-secondary/10 rounded-lg"
          role="group"
          aria-label="Filter by brand"
        >
          {(['All', 'Apple', 'Samsung'] as const).map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              aria-pressed={activeBrand === brand}
              className={`px-6 sm:px-8 py-2.5 text-sm uppercase tracking-widest font-bold transition-all rounded-md ${
                activeBrand === brand
                  ? 'bg-ct-accent text-ct-bg shadow-[0_0_20px_rgba(0,229,192,0.3)]'
                  : 'text-ct-text-secondary hover:text-ct-text hover:bg-ct-text-secondary/5'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar - Command Style */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
          <div className={`absolute inset-0 bg-ct-accent/10 rounded-2xl blur-xl transition-opacity duration-300 ${isSearchFocused ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="relative flex items-center bg-ct-bg-secondary/80 border border-ct-text-secondary/20 rounded-2xl overflow-hidden focus-within:border-ct-accent/50 focus-within:shadow-[0_0_30px_rgba(0,229,192,0.15)] transition-all">
            <div className="pl-6 text-ct-text-secondary">
              <Search className="w-5 h-5" />
            </div>
            
            <input
              id="catalog-search"
              type="text"
              autoFocus={!urlSearch}
              placeholder="Search by SKU, model, or part (e.g. '15 Pro Battery')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              aria-label="Search parts catalog"
              className="flex-1 bg-transparent px-4 py-5 text-ct-text text-lg focus:outline-none placeholder:text-ct-text-secondary/40"
            />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-2 text-ct-text-secondary hover:text-ct-text transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <div className="pr-4 pl-2">
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-ct-bg rounded text-xs font-mono text-ct-text-secondary border border-ct-text-secondary/20">
                <Command className="w-3 h-3" /> /
              </kbd>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ct-text-secondary font-mono tracking-wider uppercase">
          <span>{filteredParts.length} Results</span>
          {activeBrand !== 'All' && (
            <>
              <span className="text-ct-text-secondary/30">|</span>
              <span>{activeBrand}</span>
            </>
          )}
          {searchQuery && (
            <>
              <span className="text-ct-text-secondary/30">|</span>
              <button
                onClick={() => { setSearchQuery(''); setActiveBrand('All'); }}
                className="text-ct-accent hover:text-ct-text transition-colors"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredParts.length === 0 && !state.loading && (
        <div className="max-w-3xl mx-auto text-center py-16 px-6 border border-dashed border-ct-text-secondary/20 rounded-2xl bg-ct-bg-secondary/30">
          <div className="text-ct-text-secondary text-lg mb-4">
            {searchQuery.trim()
              ? `No parts match "${searchQuery}"`
              : 'No parts available'}
          </div>
          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-ct-accent hover:text-ct-text transition-colors text-sm font-semibold tracking-wide uppercase"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredParts.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>
    </div>
  );
}

// Part Card Component
function PartCard({ part }: { part: PartMaster }) {
  const qualityColors: Record<string, string> = {
    'Original': 'bg-ct-accent/10 text-ct-accent border-ct-accent/20',
    'OEM': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Refurbished': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="group relative bg-ct-bg-secondary/50 border border-ct-text-secondary/10 rounded-2xl p-6 hover:border-ct-accent/30 hover:shadow-[0_0_30px_rgba(0,229,192,0.1)] transition-all duration-300">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-ct-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <Badge variant="outline" className="font-mono text-[10px] tracking-wider">
            {part.sku}
          </Badge>
          <Badge className={`text-[10px] ${part.stock > 0 ? qualityColors[part.quality.name] || qualityColors['OEM'] : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {part.stock > 0 ? `${part.stock} IN STOCK` : 'OUT OF STOCK'}
          </Badge>
        </div>

        {/* Part Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${qualityColors[part.quality.name] || qualityColors['OEM']}`}>
              {part.quality.name}
            </span>
          </div>
          <h3 className="text-lg font-bold text-ct-text leading-tight">
            {part.partType.name}
          </h3>
          {part.partType.bucket && (
            <p className="text-xs text-ct-text-secondary mt-1">{part.partType.bucket.name}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-ct-text-secondary/10">
          <div>
            <p className="text-[10px] text-ct-text-secondary uppercase tracking-widest mb-0.5">Wholesale</p>
            <p className="font-mono text-2xl font-bold text-ct-text group-hover:text-ct-accent transition-colors">
              ${(part.price / 100).toFixed(2)}
            </p>
          </div>
          
          <AddToCartButton partId={part.id} stock={part.stock} className="h-10 px-4" />
        </div>
      </div>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="pt-32 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <div className="h-4 w-32 bg-ct-bg-secondary rounded animate-pulse mx-auto mb-3" />
        <div className="h-12 w-64 bg-ct-bg-secondary rounded animate-pulse mx-auto mb-4" />
        <div className="h-6 w-96 bg-ct-bg-secondary rounded animate-pulse mx-auto" />
      </div>
      
      <div className="flex justify-center mb-12">
        <div className="h-12 w-64 bg-ct-bg-secondary rounded-lg animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-ct-bg-secondary/50 border border-ct-text-secondary/10 rounded-2xl p-6 h-64 animate-pulse">
            <div className="h-4 w-24 bg-ct-bg rounded mb-4" />
            <div className="h-6 w-full bg-ct-bg rounded mb-2" />
            <div className="h-4 w-3/4 bg-ct-bg rounded mb-8" />
            <div className="h-8 w-32 bg-ct-bg rounded mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
