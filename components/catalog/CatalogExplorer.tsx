'use client';

import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import { Filter, Package2, Search } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

type FacetOption = {
  value: string;
  label: string;
  count: number;
};

type PartRecord = {
  id: string;
  sku: string;
  name: string;
  searchIndex: string;
  supplier: string | null;
  stock: number;
  price: number;
  brand: string;
  model: string;
  bucket: string;
  primaryDeviceLabel: string;
  quality: {
    id: string;
    code: string;
    name: string;
  };
  partType: {
    id: string;
    code: string;
    name: string;
    bucket: {
      id: number;
      name: string;
    };
  };
  compatibilities: Array<{
    id: string;
    phone: {
      id: string;
      label: string;
    };
  }>;
};

type PartsResponse = {
  success: boolean;
  total: number;
  parts: PartRecord[];
  filters: {
    brands: FacetOption[];
    buckets: FacetOption[];
    qualities: FacetOption[];
    models: FacetOption[];
  };
  error?: string;
};

const emptyFilters = {
  brands: [] as FacetOption[],
  buckets: [] as FacetOption[],
  qualities: [] as FacetOption[],
  models: [] as FacetOption[],
};

function qualityVariant(name: string) {
  if (name === 'Original') {
    return 'accent' as const;
  }

  if (name === 'Refurbished') {
    return 'outline' as const;
  }

  if (name === 'OEM') {
    return 'default' as const;
  }

  return 'default' as const;
}

export function CatalogExplorer() {
  const [parts, setParts] = useState<PartRecord[]>([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [bucket, setBucket] = useState('');
  const [quality, setQuality] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCartPartId, setActiveCartPartId] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();

    if (deferredSearch.trim()) {
      params.set('search', deferredSearch.trim());
    }

    if (brand) {
      params.set('brand', brand);
    }

    if (bucket) {
      params.set('bucket', bucket);
    }

    if (quality) {
      params.set('quality', quality);
    }

    async function loadParts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/parts?${params.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
        });

        const data = (await response.json()) as PartsResponse;

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load catalog');
        }

        startTransition(() => {
          setParts(data.parts);
          setFilters(data.filters);
        });
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Failed to load catalog');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadParts();

    return () => controller.abort();
  }, [brand, bucket, deferredSearch, quality]);

  const activeFilterCount = [brand, bucket, quality].filter(Boolean).length + (search.trim() ? 1 : 0);

  function clearFilters() {
    setSearch('');
    setBrand('');
    setBucket('');
    setQuality('');
  }

  function handleAddToCart(partId: string) {
    setActiveCartPartId(partId);

    window.setTimeout(() => {
      setActiveCartPartId((current) => (current === partId ? null : current));
    }, 1400);
  }

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="grid gap-6 rounded-[1.25rem] border border-ct-text-secondary/10 bg-[linear-gradient(180deg,rgba(17,23,37,0.94),rgba(7,10,18,0.98))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="text-micro text-ct-accent">CellTech Catalog Engine</div>
          <div className="space-y-3">
            <h1 className="heading-display text-3xl text-ct-text sm:text-4xl lg:text-5xl">
              Parts Explorer
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-ct-text-secondary sm:text-base">
              Query live wholesale inventory by Golden SKU, device family, taxonomy bucket, and quality tier.
              This surface is optimized for dense operational browsing rather than consumer merchandising.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-ct-text-secondary/10 bg-ct-bg/70 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-micro text-ct-text-secondary">Result Window</div>
              <div className="mt-2 text-3xl font-semibold text-ct-text">{parts.length}</div>
            </div>
            <Badge variant="accent" className="rounded-md px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
              Live From Neon
            </Badge>
          </div>
          <div className="mt-4 border-t border-ct-text-secondary/10 pt-4 text-sm text-ct-text-secondary">
            <div className="flex items-center justify-between">
              <span>Active filters</span>
              <span className="font-mono text-ct-text">{activeFilterCount}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Display mode</span>
              <span className="font-mono text-ct-text">dense-grid</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[1rem] border border-ct-text-secondary/10 bg-ct-bg-secondary/40 p-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3 border-b border-ct-text-secondary/10 pb-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ct-text">
              <Filter className="h-4 w-4 text-ct-accent" />
              Taxonomy Filters
            </div>
            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs uppercase tracking-[0.16em] text-ct-text-secondary transition hover:text-ct-accent"
              >
                Reset
              </button>
            ) : null}
          </div>

          <div className="mt-5 space-y-6">
            <FilterSection
              title="Brand"
              options={filters.brands}
              selected={brand}
              onSelect={setBrand}
            />
            <FilterSection
              title="Bucket"
              options={filters.buckets}
              selected={bucket}
              onSelect={setBucket}
            />
            <FilterSection
              title="Quality"
              options={filters.qualities}
              selected={quality}
              onSelect={setQuality}
            />
          </div>
        </aside>

        <div className="space-y-4">
          <div className="rounded-[1rem] border border-ct-text-secondary/10 bg-ct-bg-secondary/35 p-4 sm:p-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-end">
              <div className="space-y-2">
                <div className="text-micro text-ct-text-secondary">Command Search</div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ct-text-secondary/60" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search SKU, model, bucket, or quality"
                    className="h-14 rounded-xl border-ct-text-secondary/10 bg-ct-bg/70 pl-11 pr-14 text-sm sm:text-base"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-ct-text-secondary/10 bg-ct-bg-secondary/70 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ct-text-secondary">
                    cmd
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-ct-text-secondary/10 bg-ct-bg/50 p-3 text-sm">
                <div>
                  <div className="text-micro text-ct-text-secondary">Models</div>
                  <div className="mt-1 text-lg font-semibold text-ct-text">{filters.models.length}</div>
                </div>
                <div>
                  <div className="text-micro text-ct-text-secondary">Buckets</div>
                  <div className="mt-1 text-lg font-semibold text-ct-text">{filters.buckets.length}</div>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-[1rem] border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[1rem] border border-ct-text-secondary/10 bg-ct-bg-secondary/30">
            <div className="flex items-center justify-between border-b border-ct-text-secondary/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-ct-text-secondary">
                <Package2 className="h-4 w-4 text-ct-accent" />
                <span>
                  <span className="font-semibold text-ct-text">{parts.length}</span> matching parts
                </span>
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ct-text-secondary">
                stock-first ordering
              </div>
            </div>

            <div className="hidden border-b border-ct-text-secondary/10 bg-ct-bg/60 px-4 py-3 lg:grid lg:grid-cols-[170px_minmax(0,2.3fr)_130px_120px_120px_170px] lg:gap-4">
              <HeaderCell label="Golden SKU" />
              <HeaderCell label="Part" />
              <HeaderCell label="Quality" />
              <HeaderCell label="Price" />
              <HeaderCell label="Stock" />
              <HeaderCell label="Action" />
            </div>

            {loading ? (
              <div className="space-y-3 p-4">
                {[0, 1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-28 rounded-xl border border-ct-text-secondary/10 bg-ct-bg/50 animate-pulse"
                  />
                ))}
              </div>
            ) : parts.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <Package2 className="h-10 w-10 text-ct-text-secondary/35" />
                <div className="text-lg font-semibold text-ct-text">No catalog rows matched</div>
                <p className="max-w-md text-sm text-ct-text-secondary">
                  Clear one or more filters and broaden the search terms to inspect the seeded inventory.
                </p>
                <Button variant="outline" className="rounded-md" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-ct-text-secondary/10">
                {parts.map((part) => {
                  const compatibilityPreview = part.compatibilities.slice(0, 3);
                  const remainingCompatibilities = part.compatibilities.length - compatibilityPreview.length;
                  const inCart = activeCartPartId === part.id;

                  return (
                    <article key={part.id} className="px-4 py-4 transition-colors hover:bg-ct-bg/35">
                      <div className="hidden items-center gap-4 lg:grid lg:grid-cols-[170px_minmax(0,2.3fr)_130px_120px_120px_170px]">
                        <div>
                          <div className="text-micro text-ct-text-secondary">Golden SKU</div>
                          <div className="mt-2 font-mono text-sm text-ct-text">{part.sku}</div>
                          <div className="mt-2 text-xs text-ct-text-secondary">{part.brand}</div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="truncate text-sm font-semibold uppercase tracking-[0.06em] text-ct-text">
                                {part.name}
                              </h2>
                              <p className="mt-2 text-sm text-ct-text-secondary">
                                {part.partType.bucket.name} · {part.primaryDeviceLabel}
                                {part.supplier ? ` · ${part.supplier}` : ''}
                              </p>
                            </div>
                            <div className="hidden text-right xl:block">
                              <div className="text-micro text-ct-text-secondary">Fitments</div>
                              <div className="mt-2 font-mono text-sm text-ct-text">{part.compatibilities.length}</div>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {compatibilityPreview.map((compatibility) => (
                              <span
                                key={compatibility.id}
                                className="rounded-md border border-ct-text-secondary/10 bg-ct-bg/60 px-2 py-1 text-xs text-ct-text-secondary"
                              >
                                {compatibility.phone.label}
                              </span>
                            ))}
                            {remainingCompatibilities > 0 ? (
                              <span className="rounded-md border border-ct-text-secondary/10 bg-ct-bg/60 px-2 py-1 text-xs text-ct-accent">
                                +{remainingCompatibilities} more
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div>
                          <Badge variant={qualityVariant(part.quality.name)} className="rounded-md px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                            {part.quality.name}
                          </Badge>
                        </div>

                        <div>
                          <div className="text-micro text-ct-text-secondary">Unit</div>
                          <div className="mt-2 text-lg font-semibold text-ct-text">{formatCurrency(part.price)}</div>
                        </div>

                        <div>
                          <div className="text-micro text-ct-text-secondary">Available</div>
                          <div className="mt-2 font-mono text-lg text-ct-text">{part.stock}</div>
                          <div className={`mt-1 text-xs ${part.stock > 0 ? 'text-ct-accent' : 'text-red-400'}`}>
                            {part.stock > 0 ? 'ready to allocate' : 'out of stock'}
                          </div>
                        </div>

                        <div>
                          <Button
                            type="button"
                            variant={part.stock > 0 ? 'primary' : 'secondary'}
                            className="w-full rounded-md uppercase tracking-[0.14em]"
                            disabled={part.stock === 0}
                            onClick={() => handleAddToCart(part.id)}
                          >
                            {inCart ? 'Queued' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4 lg:hidden">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-micro text-ct-text-secondary">Golden SKU</div>
                            <div className="mt-2 font-mono text-sm text-ct-text">{part.sku}</div>
                          </div>
                          <Badge variant={qualityVariant(part.quality.name)} className="rounded-md px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                            {part.quality.name}
                          </Badge>
                        </div>

                        <div>
                          <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-ct-text">{part.name}</h2>
                          <p className="mt-2 text-sm text-ct-text-secondary">
                            {part.partType.bucket.name} · {part.primaryDeviceLabel}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <MetricCard label="Price" value={formatCurrency(part.price)} />
                          <MetricCard label="Stock" value={String(part.stock)} accent={part.stock > 0} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {compatibilityPreview.map((compatibility) => (
                            <span
                              key={compatibility.id}
                              className="rounded-md border border-ct-text-secondary/10 bg-ct-bg/60 px-2 py-1 text-xs text-ct-text-secondary"
                            >
                              {compatibility.phone.label}
                            </span>
                          ))}
                          {remainingCompatibilities > 0 ? (
                            <span className="rounded-md border border-ct-text-secondary/10 bg-ct-bg/60 px-2 py-1 text-xs text-ct-accent">
                              +{remainingCompatibilities} more
                            </span>
                          ) : null}
                        </div>

                        <Button
                          type="button"
                          variant={part.stock > 0 ? 'primary' : 'secondary'}
                          className="w-full rounded-md uppercase tracking-[0.14em]"
                          disabled={part.stock === 0}
                          onClick={() => handleAddToCart(part.id)}
                        >
                          {inCart ? 'Queued' : 'Add to Cart'}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: FacetOption[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 text-micro text-ct-text-secondary">{title}</div>
      <div className="space-y-2">
        {options.map((option) => {
          const active = option.value === selected;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(active ? '' : option.value)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                active
                  ? 'border-ct-accent bg-ct-accent/10 text-ct-text shadow-glow'
                  : 'border-ct-text-secondary/10 bg-ct-bg/45 text-ct-text-secondary hover:border-ct-text-secondary/30 hover:text-ct-text'
              }`}
            >
              <span>{option.label}</span>
              <span className="font-mono text-xs">{option.count}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function HeaderCell({ label }: { label: string }) {
  return <div className="text-micro text-ct-text-secondary">{label}</div>;
}

function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-ct-text-secondary/10 bg-ct-bg/55 px-3 py-3">
      <div className="text-micro text-ct-text-secondary">{label}</div>
      <div className={`mt-2 text-base font-semibold ${accent ? 'text-ct-accent' : 'text-ct-text'}`}>{value}</div>
    </div>
  );
}
