'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';

import { CartDrawer } from '@/components/cart/CartDrawer';

import { Button } from '../ui/Button';

type HeaderActionsProps = {
  cartItemCount: number;
};

export function HeaderActions({ cartItemCount }: HeaderActionsProps) {
  const { isSignedIn } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </SignInButton>
        ) : null}
        {!isSignedIn ? (
          <Link href="/catalog">
            <Button size="sm">Catalog</Button>
          </Link>
        ) : null}

        {isSignedIn ? (
          <Link href="/orders" className="hidden text-sm font-medium text-ct-text-secondary transition-colors hover:text-ct-accent md:block">
            My Orders
          </Link>
        ) : null}
        {isSignedIn ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="relative px-2"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5 text-ct-text" />
            {cartItemCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ct-accent text-[10px] font-bold text-ct-bg">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            ) : null}
          </Button>
        ) : null}
        {isSignedIn ? <UserButton /> : null}
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
