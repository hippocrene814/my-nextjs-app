"use client";
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { getAllUserMuseums } from "@/lib/userMuseums";
import { getMuseums } from '../context/MuseumsContext';
import MuseumGrid from '../components/MuseumGrid';

export default function Home() {
  const { museums, userData, loading, error, hasMore, fetchNextPage } = getMuseums();
  const [tab, setTab] = useState<'explore' | 'wish'>('explore');
  const { data: session } = useSession();
  const userId = session?.user?.email;

  // Deduplicate by id (Wikidata entity URI)
  const seen = new Set<string>();
  const allMuseums = museums.filter(m => {
    if (!m.id) return false;
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  // Filter for wish museums
  const wishMuseums = allMuseums.filter(m => userData[m.id]?.wish);

  // Debug output
  console.log('Current tab:', tab);
  console.log('userData:', userData);
  console.log('allMuseums:', allMuseums);
  console.log('wishMuseums:', wishMuseums);

  // Choose which museums to show
  const museumsToShow = tab === 'explore' ? allMuseums : wishMuseums;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 mt-6 text-center">Explore Museums</h1>
      {/* Tab Bar */}
      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 font-semibold rounded-t-lg border-b-2 transition ${
            tab === 'explore'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-600'
          }`}
          onClick={() => setTab('explore')}
        >
          Explore
        </button>
        <button
          className={`px-6 py-2 font-semibold rounded-t-lg border-b-2 transition ${
            tab === 'wish'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-600'
          }`}
          onClick={() => setTab('wish')}
        >
          Wish to Visit
        </button>
      </div>
      {/* Content */}
      <MuseumGrid
        museums={museumsToShow}
        userData={userData}
        emptyMessage={
          tab === 'wish'
            ? 'No museums marked as wish to visit.'
            : 'No museums found.'
        }
      />
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {hasMore && tab === 'explore' && museumsToShow.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={fetchNextPage}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
