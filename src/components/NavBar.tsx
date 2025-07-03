"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/wish', label: 'Wish to Visit' },
  { href: '/visited', label: 'Visited' },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-30" style={{background: '#fff'}}>
      <Link href="/" className="text-xl font-bold tracking-tight hover:underline focus:outline-none focus:ring-2 focus:ring-blue-200 transition">
        Museum Tracker
      </Link>
      <div className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-lg font-medium pb-1 border-b-2 transition-colors duration-200 ${
              pathname === item.href ? 'border-black' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
} 