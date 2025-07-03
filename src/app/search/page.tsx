"use client";
import React, { useState } from 'react';
import MuseumCard from '../../components/MuseumCard';

interface Museum {
  id: string;
  name: string;
  city?: string;
  country?: string;
  description?: string;
  website?: string;
  image?: string;
  logo?: string;
}

const PLACEHOLDER = '/placeholder-museum.svg';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(q: string) {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search-museums?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Failed to fetch search results');
      const data = await res.json();
      setResults(data.museums || []);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Deduplicate results by id (Wikidata entity URI)
  const seen = new Set<string>();
  const dedupedResults = results.filter(m => {
    if (!m.id) return false;
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Museums</h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Type to search museums..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          className="w-full max-w-xl px-6 py-4 border rounded-lg shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          autoFocus
        />
      </div>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {dedupedResults.map((museum) => (
          <MuseumCard
            key={museum.id}
            museum={museum}
            userData={{ status: 'none', notes: '' }}
          />
        ))}
        {dedupedResults.length === 0 && query && !loading && !error && (
          <div className="col-span-full text-center text-gray-500">No museums found.</div>
        )}
      </div>
    </div>
  );
} 