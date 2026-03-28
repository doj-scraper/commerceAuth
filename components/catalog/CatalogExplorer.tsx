// components/catalog/CatalogExplorer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Package, ChevronRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PartCard } from '../product/PartCard';

interface Part {
  id: string;
  sku: string;
  searchIndex: string;
  price: number | null;
  stock: number;
  quality: { name: string };
  partType: { name: string; bucket: { name: string } };
  primaryPhone: {
    generation: string;
    variantName: string | null;
    model: { name: string; brand: { name: string } };
  };
}

export function CatalogExplorer() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    bucket: '',
    quality: '',
  });

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.quality) params.append('quality', filters.quality);
    
    try {
      const res = await fetch(`/api/parts?${params.toString()}`);
      const data = await res.json();
      setParts(data);
    } catch (error) {
      console.error('Failed to fetch parts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filters]);

  const brands = ['Apple', 'Samsung'];
  const qualities = ['Original', 'Refurbished', 'OEM'];
  const buckets = ['Visual Interface', 'Chassis & Enclosure', 'Functional Modules', 'Interconnects'];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-ct-text font-semibold uppercase tracking-wider text-xs">
          <Filter size={14} className="text-ct-accent" />
          Taxonomy Filters
        </div>

        <div className="flex flex-col gap-4">
          <section>
            <label className="text-micro text-ct-text-secondary mb-2 block">Brand</label>
            <div className="flex flex-wrap gap-2">
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => setFilters(f => ({ ...f, brand: f.brand === b ? '' : b }))}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    filters.brand === b 
                      ? 'bg-ct-accent/10 border-ct-accent text-ct-accent shadow-glow' 
                      : 'bg-ct-bg-secondary border-ct-text-secondary/10 text-ct-text-secondary hover:border-ct-text-secondary/30'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="text-micro text-ct-text-secondary mb-2 block">Quality</label>
            <div className="flex flex-wrap gap-2">
              {qualities.map(q => (
                <button
                  key={q}
                  onClick={() => setFilters(f => ({ ...f, quality: f.quality === q ? '' : q }))}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    filters.quality === q 
                      ? 'bg-ct-accent/10 border-ct-accent text-ct-accent shadow-glow' 
                      : 'bg-ct-bg-secondary border-ct-text-secondary/10 text-ct-text-secondary hover:border-ct-text-secondary/30'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="text-micro text-ct-text-secondary mb-2 block">Bucket</label>
            <div className="flex flex-col gap-1">
              {buckets.map(b => (
                <button
                  key={b}
                  onClick={() => setFilters(f => ({ ...f, bucket: f.bucket === b ? '' : b }))}
                  className={`flex items-center justify-between px-3 py-2 text-xs rounded-md transition-all ${
                    filters.bucket === b 
                      ? 'bg-ct-accent text-ct-bg' 
                      : 'text-ct-text-secondary hover:bg-ct-bg-secondary'
                  }`}
                >
                  {b}
                  <ChevronRight size={12} opacity={filters.bucket === b ? 1 : 0.3} />
                </button>
              ))}
            </div>
          </section>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-4 justify-start px-0 text-ct-accent"
          onClick={() => {
            setFilters({ brand: '', bucket: '', quality: '' });
            setSearch('');
          }}
        >
          Reset all filters
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ct-text-secondary/50" size={18} />
          <Input 
            placeholder="Command Search (SKU, Model, Part Type...)" 
            className="pl-10 h-12 bg-ct-bg-secondary/50 border-ct-text-secondary/10 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ct-text-secondary text-sm">
            <Package size={16} />
            <span>Found <span className="text-ct-text font-semibold">{parts.length}</span> parts</span>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-ct-text-secondary" />
            <span className="text-xs text-ct-text-secondary uppercase tracking-widest">Dense View</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 rounded-xl bg-ct-bg-secondary/20 animate-pulse border border-ct-text-secondary/5" />
            ))}
          </div>
        ) : parts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {parts.map(part => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-ct-text-secondary/10 rounded-2xl bg-ct-bg-secondary/5">
            <Package size={48} className="text-ct-text-secondary/20 mb-4" />
            <p className="text-ct-text-secondary font-medium text-lg">No parts matching your criteria</p>
            <p className="text-ct-text-secondary/50 text-sm">Try adjusting your filters or search term</p>
          </div>
        )}
      </main>
    </div>
  );
}
