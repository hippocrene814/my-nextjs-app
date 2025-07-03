"use client";
import React, { useState } from 'react';
import { useMuseums } from '../context/MuseumsContext';
import MuseumCard from '../components/MuseumCard';

export default function Home() {
  const { museums, userData, setStatus } = useMuseums();
  const [search, setSearch] = useState('');

  const filtered = museums.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.location.toLowerCase().includes(search.toLowerCase())
  );

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
        {filtered.map(museum => (
          <MuseumCard
            key={museum.id}
            museum={museum}
            userData={userData[museum.id] || { status: 'none', notes: '' }}
            onStatusChange={status => setStatus(museum.id, status)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No museums found.</div>
        )}
      </div>
    </div>
  );
}
