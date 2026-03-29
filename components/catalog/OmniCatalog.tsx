'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PartQuality {
  id: string;
  name: 'OEM' | 'Aftermarket' | 'Refurbished';
}

interface PartType {
  id: string;
  name: string;
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
// COMPONENT
// ============================================================================

export default function OmniCatalog() {
  const [state, setState] = useState<ComponentState>({
    parts: [],
    loading: true,
    error: null,
  });

  const [activeBrand, setActiveBrand] = useState<'Apple' | 'Samsung'>('Apple');
  const [searchQuery, setSearchQuery] = useState('');

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

  // 2. Real-Time Filter with Memoization
  const filteredParts = useMemo(() => {
    return state.parts.filter((part) => {
      if (part.brand !== activeBrand) return false;

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

  // 3. Cart Handler (Placeholder for Integration)
  const handleAddToCart = useCallback((part: PartMaster) => {
    console.log('[OmniCatalog] Add to cart:', part.sku);
    alert(`Added ${part.sku} to cart (implement cart handler)`);
  }, []);

  // =========================================================================
  // RENDER: Loading State
  // =========================================================================
  if (state.loading) {
    return (
      <div className="pt-20 pb-12 px-6 lg:px-12 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ct-accent mb-4"></div>
          <p className="text-ct-text-secondary">Loading catalog&hellip;</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Error State
  // =========================================================================
  if (state.error) {
    return (
      <div className="pt-20 pb-12 px-6 lg:px-12 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md text-center p-8 rounded-2xl bg-ct-bg-secondary/50 border border-red-500/20">
          <div className="text-red-400 text-lg font-bold mb-2">
            ⚠️ Error Loading Catalog
          </div>
          <p className="text-ct-text-secondary mb-6 text-sm">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-ct-accent text-ct-bg px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-ct-text transition-colors rounded-sm"
          >
            Retry
          </button>
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
          className="flex p-1 bg-ct-bg-secondary border border-ct-text-secondary/10 rounded-lg shadow-dashboard"
          role="group"
          aria-label="Filter by brand"
        >
          {(['Apple', 'Samsung'] as const).map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              aria-pressed={activeBrand === brand}
              className={`px-8 py-2.5 text-sm uppercase tracking-widest font-bold transition-all rounded-md ${
                activeBrand === brand
                  ? 'bg-ct-accent text-ct-bg shadow-glow'
                  : 'text-ct-text-secondary hover:text-ct-text hover:bg-ct-text-secondary/5'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative group">
          <input
            type="text"
            autoFocus
            placeholder="Search generation, part, or SKU (e.g. '15 Pro Battery')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search parts catalog"
            className="w-full bg-ct-bg-secondary/80 border border-ct-text-secondary/20 text-ct-text px-6 py-5 text-lg focus:outline-none focus:border-ct-accent focus:ring-1 focus:ring-ct-accent rounded-xl transition-all placeholder:text-ct-text-secondary/40 shadow-dashboard"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-ct-bg px-2 py-1 rounded text-xs text-ct-text-secondary font-mono border border-ct-text-secondary/20">
            /
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-ct-text-secondary font-mono tracking-wider uppercase">
          {filteredParts.length} Results Found
        </div>
      </div>

      {/* Empty State */}
      {filteredParts.length === 0 && !state.loading && (
        <div className="max-w-3xl mx-auto text-center py-16 px-6 border border-dashed border-ct-text-secondary/20 rounded-2xl bg-ct-bg-secondary/30">
          <div className="text-ct-text-secondary text-lg mb-4">
            {searchQuery.trim()
              ? `No ${activeBrand} parts match "${searchQuery}"`
              : `No ${activeBrand} parts available`}
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
          <div
            key={part.id}
            className="product-card p-6 flex flex-col justify-between group"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4 gap-2">
                <span className="font-mono text-xs text-ct-accent bg-ct-accent/10 border border-ct-accent/20 px-2 py-1 uppercase tracking-widest flex-shrink-0 rounded-sm">
                  {part.sku}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-1 flex-shrink-0 rounded-sm ${
                    part.stock > 0
                      ? 'text-ct-accent border border-ct-accent/30 bg-ct-accent/5'
                      : 'text-red-400 border border-red-400/30 bg-red-400/5'
                  }`}
                >
                  {part.stock > 0 ? `${part.stock} IN STOCK` : 'OUT OF STOCK'}
                </span>
              </div>

              {/* Part Name */}
              <h3 className="text-lg font-bold text-ct-text mb-1 line-clamp-2">
                {part.quality.name} {part.partType.name}
              </h3>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end pt-4 border-t border-ct-text-secondary/10 mt-auto">
              <div>
                <span className="block text-[10px] text-ct-text-secondary uppercase tracking-widest mb-1">
                  Wholesale
                </span>
                <span className="font-mono text-xl font-bold text-ct-text group-hover:text-ct-accent transition-colors">
                  ${(part.price / 100).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(part)}
                disabled={part.stock === 0}
                aria-label={`Add ${part.quality.name} ${part.partType.name} (SKU: ${part.sku}) to cart`}
                className="bg-ct-accent text-ct-bg px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-md disabled:hover:shadow-none"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
