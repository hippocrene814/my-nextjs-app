"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const navItems = [
  { href: '/', label: 'Home' },
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          href="/visited"
          className={`text-lg font-medium pb-1 border-b-2 transition-colors duration-200 ${
            pathname === '/visited' ? 'border-black' : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Visited
        </Link>
        <Link
          href="/search"
          className={`text-lg font-medium pb-1 border-b-2 transition-colors duration-200 ${
            pathname === '/search' ? 'border-black' : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Search
        </Link>
        {/* Auth UI */}
        {status === 'loading' ? null : user ? (
          <div className="relative flex items-center gap-3">
            {user.image && (
              <button
                className="focus:outline-none"
                aria-haspopup="true"
                aria-expanded={dropdownOpen ? 'true' : 'false'}
                onClick={() => setDropdownOpen((open) => !open)}
                tabIndex={0}
                type="button"
              >
                <img src={user.image} alt={user.name || 'User'} className="w-8 h-8 rounded-full border" />
              </button>
            )}
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                className="fixed mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                style={{
                  right: '24px', // match page padding
                  top: '72px', // below navbar (navbar height + gap)
                }}
              >
                <div className="px-6 py-4 border-b">
                  <span className="block text-lg font-semibold text-gray-900 truncate">{user.name || user.email}</span>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); signOut(); }}
                  className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-b-lg text-base font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
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