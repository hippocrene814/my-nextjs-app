"use client";
import React, { useState } from 'react';
import { getMuseums } from '../context/MuseumsContext';
import MuseumCard from '../components/MuseumCard';

function makeKey(museum: { name?: string; city?: string; country?: string }) {
  return `${(museum.name || '').toLowerCase()}|${(museum.city || '').toLowerCase()}|${(museum.country || '').toLowerCase()}`;
}

export default function Home() {
  const { museums, userData, loading, error, hasMore, fetchNextPage } = getMuseums();
  const [search, setSearch] = useState('');

  const filteredRaw = museums.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.city?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
    (m.country?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );
  // Deduplicate by name+city+country
  const seen = new Set<string>();
  const filtered = filteredRaw.filter(m => {
    const key = makeKey(m);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose your dream museum</h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search museums..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((museum, idx) => (
          <MuseumCard
            key={makeKey(museum)}
            museum={museum}
            userData={userData[museum.id] || { status: 'none', notes: '' }}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No museums found.</div>
        )}
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {hasMore && filtered.length > 0 && (
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
