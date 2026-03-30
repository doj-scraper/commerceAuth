import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/lib/prisma';

import { HeaderActions } from './HeaderActions';

export async function Header() {
  const { userId: clerkId } = await auth();
  let cartItemCount = 0;

  if (clerkId) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (user) {
      const cartSummary = await prisma.cartItem.aggregate({
        where: { userId: user.id },
        _sum: { quantity: true },
      });

      cartItemCount = cartSummary._sum.quantity ?? 0;
    }
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-ct-text-secondary/10 bg-ct-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ct-accent font-bold italic text-ct-bg">
            CT
          </div>
          <span className="heading-display text-xl tracking-tighter">
            CELL<span className="text-ct-accent">TECH</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-ct-text-secondary md:flex">
          <Link href="/catalog" className="transition-colors hover:text-ct-accent">
            Catalog
          </Link>
          <Link href="/features" className="transition-colors hover:text-ct-accent">
            Features
          </Link>
          <Link href="/orders" className="transition-colors hover:text-ct-accent">
            Orders
          </Link>
        </div>

        <HeaderActions cartItemCount={cartItemCount} />
      </div>
    </nav>
  );
}
