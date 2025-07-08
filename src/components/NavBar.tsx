"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const navItems = [
  { href: '/', label: 'Home' },
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-30" style={{background: '#fff'}}>
      <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:underline focus:outline-none focus:ring-2 focus:ring-blue-200 transition">
        <img src="/logo.svg" alt="Museum Passport Logo" className="w-8 h-8" />
        Museum Passport
      </Link>
      <div className="flex items-center gap-6">
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
        <Link
          href="/search"
          className={`text-lg font-medium pb-1 border-b-2 transition-colors duration-200 ${
            pathname === '/search' ? 'border-black' : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Search
        </Link>
        <Link
          href="/visited"
          className={`text-lg font-medium pb-1 border-b-2 transition-colors duration-200 ${
            pathname === '/visited' ? 'border-black' : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Visited
        </Link>
        {/* Auth UI */}
        {status === 'loading' ? null : user ? (
          <div className="flex items-center gap-3">
            {user.image && <img src={user.image} alt={user.name || 'User'} className="w-8 h-8 rounded-full border" />}
            <span className="text-base font-medium text-gray-700">{user.name || user.email}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-1 rounded bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="px-4 py-1 rounded bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
} 