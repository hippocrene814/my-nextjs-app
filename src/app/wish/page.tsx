"use client";
import React from 'react';
import { getMuseums } from '../../context/MuseumsContext';
import MuseumCard from '../../components/MuseumCard';

function makeKey(museum: { name?: string; city?: string; country?: string }) {
  return `${(museum.name || '').toLowerCase()}|${(museum.city || '').toLowerCase()}|${(museum.country || '').toLowerCase()}`;
}

export default function WishPage() {
  const { museums, userData } = getMuseums();
  // Filter and deduplicate wish museums by name+city+country
  const wishMuseumsRaw = museums.filter(m => userData[m.id]?.status === 'wish');
  const seen = new Set<string>();
  const wishMuseums = wishMuseumsRaw.filter(m => {
    const key = makeKey(m);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Wish to Visit</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {wishMuseums.map((museum, idx) => (
          <MuseumCard
            key={makeKey(museum)}
            museum={museum}
            userData={userData[museum.id] || { status: 'none', notes: '' }}
          />
        ))}
        {wishMuseums.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No museums marked as wish to visit.</div>
        )}
      </div>
    </div>
  );
} 