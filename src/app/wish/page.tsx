"use client";
import React from 'react';
import { useMuseums } from '../../context/MuseumsContext';
import MuseumCard from '../../components/MuseumCard';

export default function WishPage() {
  const { museums, userData, setStatus } = useMuseums();
  const wishMuseums = museums.filter(m => userData[m.id]?.status === 'wish');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Wish to Visit</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {wishMuseums.map(museum => (
          <MuseumCard
            key={museum.id}
            museum={museum}
            userData={userData[museum.id] || { status: 'none', notes: '' }}
            onStatusChange={status => setStatus(museum.id, status)}
          />
        ))}
        {wishMuseums.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No museums marked as wish to visit.</div>
        )}
      </div>
    </div>
  );
} 