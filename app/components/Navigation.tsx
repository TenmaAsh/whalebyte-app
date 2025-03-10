'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useBlockchain } from '@/contexts/BlockchainContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Wallet', href: '/wallet' },
  { name: 'Spheres', href: '/spheres' },
];

export function Navigation() {
  const pathname = usePathname();
  const { isConnected } = useBlockchain();

  return (
    <nav className="flex space-x-4">
      {navigation.map((item) => {
        // Hide wallet and spheres links if not connected
        if (!isConnected && (item.href === '/wallet' || item.href === '/spheres')) {
          return null;
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-primary hover:bg-muted'
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}