'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-ct-text-secondary/10 px-6 py-12 text-ct-text-secondary lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2 opacity-50 grayscale">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-ct-text-secondary text-[10px] font-bold italic text-ct-bg">
            CT
          </div>
          <span className="heading-display text-sm tracking-tighter">CELLTECH</span>
        </div>
        <p className="text-xs uppercase tracking-widest">© 2026 CellTech B2B Solutions. All rights reserved.</p>
        <div className="flex gap-6 text-xs font-mono uppercase tracking-widest">
          <Link href="#" className="transition-all hover:text-ct-accent">
            Privacy
          </Link>
          <Link href="#" className="transition-all hover:text-ct-accent">
            Terms
          </Link>
          <Link href="#" className="transition-all hover:text-ct-accent">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
