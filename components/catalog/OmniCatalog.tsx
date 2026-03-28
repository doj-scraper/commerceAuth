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
      <div className="min-h-screen bg-[#0A0A0A] text-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5C0] mb-4"></div>
          <p className="text-gray-400">Loading catalog&hellip;</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Error State
  // =========================================================================
  if (state.error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-gray-100 p-8 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-red-400 text-lg font-bold mb-2">
            ⚠️ Error Loading Catalog
          </div>
          <p className="text-gray-400 mb-6 text-sm">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00E5C0] text-black px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-sm"
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
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 p-8 font-sans selection:bg-[#00E5C0] selection:text-black">
      {/* Brand Toggle */}
      <div className="flex justify-center mb-12">
        <div
          className="flex p-1 bg-gray-900 border border-gray-800 rounded-sm"
          role="group"
          aria-label="Filter by brand"
        >
          {(['Apple', 'Samsung'] as const).map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              aria-pressed={activeBrand === brand}
              className={`px-8 py-2 text-sm uppercase tracking-widest font-bold transition-colors rounded-sm ${
                activeBrand === brand
                  ? 'bg-[#00E5C0] text-black'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-12">
        <input
          type="text"
          autoFocus
          placeholder="Search generation, part, or SKU (e.g. '15 Pro Battery')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search parts catalog"
          className="w-full bg-gray-900 border border-gray-700 text-white px-6 py-5 text-lg focus:outline-none focus:border-[#00E5C0] focus:ring-1 focus:ring-[#00E5C0] rounded-sm transition-all placeholder:text-gray-600"
        />
        <div className="mt-2 text-xs text-gray-500 font-mono tracking-wider uppercase">
          {filteredParts.length} Results Found
        </div>
      </div>

      {/* Empty State */}
      {filteredParts.length === 0 && !state.loading && (
        <div className="max-w-7xl mx-auto text-center py-16">
          <div className="text-gray-500 text-lg">
            {searchQuery.trim()
              ? `No ${activeBrand} parts match "${searchQuery}"`
              : `No ${activeBrand} parts available`}
          </div>
          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-[#00E5C0] hover:underline text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredParts.map((part) => (
          <div
            key={part.id}
            className="bg-gray-900 border border-gray-800 p-6 flex flex-col justify-between rounded-sm hover:border-gray-600 transition-colors group"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4 gap-2">
                <span className="font-mono text-xs text-[#00E5C0] bg-[#00E5C0]/10 px-2 py-1 uppercase tracking-widest flex-shrink-0">
                  {part.sku}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-1 flex-shrink-0 ${
                    part.stock > 0
                      ? 'text-green-400 border border-green-400/30'
                      : 'text-red-400 border border-red-400/30'
                  }`}
                >
                  {part.stock > 0 ? `${part.stock} IN STOCK` : 'OUT OF STOCK'}
                </span>
              </div>

              {/* Part Name */}
              <h3 className="text-lg font-bold text-white mb-1">
                {part.quality.name} {part.partType.name}
              </h3>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end pt-4 border-t border-gray-800">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Wholesale
                </span>
                <span className="font-mono text-xl font-bold text-white">
                  ${(part.price / 100).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(part)}
                disabled={part.stock === 0}
                aria-label={`Add ${part.quality.name} ${part.partType.name} (SKU: ${part.sku}) to cart`}
                className="bg-[#00E5C0] text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
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
