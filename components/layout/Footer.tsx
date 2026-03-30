'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-ct-text-secondary/10 bg-[linear-gradient(180deg,rgba(17,23,37,0.4),rgba(7,10,18,0.96))] px-6 py-10 text-ct-text-secondary lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-ct-accent/20 bg-ct-accent/10 text-sm font-bold italic text-ct-accent">
              CT
            </div>
            <div>
              <div className="heading-display text-lg tracking-[0.04em] text-ct-text">
                CELL<span className="text-ct-accent">TECH</span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-ct-text-secondary">
                Built for service-center throughput
              </div>
            </div>
          </div>

          <p className="max-w-xl text-sm leading-6 text-ct-text-secondary">
            Wholesale mobile-component sourcing with live inventory visibility, operational buying flows,
            and a UI built for fast decision-making.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:justify-self-end">
          <div className="space-y-3">
            <div className="text-micro text-ct-text-secondary">Navigation</div>
            <div className="flex flex-col gap-2 text-sm">
              <FooterLink href="/catalog">Catalog</FooterLink>
              <FooterLink href="/features">Capabilities</FooterLink>
              <FooterLink href="/orders">Orders</FooterLink>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-micro text-ct-text-secondary">System</div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="text-ct-text-secondary/70">Real-time stock sync</span>
              <span className="text-ct-text-secondary/70">Verified quality workflows</span>
              <span className="text-ct-text-secondary/70">Next-day fulfillment rails</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-ct-text-secondary/10 pt-5 text-xs uppercase tracking-[0.18em] text-ct-text-secondary/70 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 CellTech B2B Solutions</span>
        <span>High-volume sourcing for modern repair operations</span>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="transition-colors hover:text-ct-accent">
      {children}
    </Link>
  );
}
