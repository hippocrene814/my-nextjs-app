"use client";
import React, { useState } from 'react';
import MuseumCard from '../../components/MuseumCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import MuseumGrid from '../../components/MuseumGrid';

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
  const [typeahead, setTypeahead] = useState<Museum[]>([]);
  const [showTypeahead, setShowTypeahead] = useState(false);
  const [typeaheadLoading, setTypeaheadLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 30;
  const router = useRouter();
  let debounceTimeout: NodeJS.Timeout;
  const searchParams = useSearchParams();

  // On mount, restore state from URL
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const offsetParam = parseInt(searchParams.get('offset') || '0', 10) || 0;
    if (qParam) {
      setQuery(qParam);
      setOffset(offsetParam);
      setLoading(true);
      setError(null);
      fetch(`/api/search-museums?q=${encodeURIComponent(qParam)}&offset=${offsetParam}`)
        .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
        .then(data => {
          setResults(data.museums || []);
          setHasMore((data.museums?.length || 0) === PAGE_SIZE);
        })
        .catch(err => {
          setError(err.message || 'Unknown error');
          setResults([]);
          setHasMore(false);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // Debounced typeahead fetch
  async function fetchTypeahead(q: string) {
    if (!q.trim()) {
      setTypeahead([]);
      setShowTypeahead(false);
      return;
    }
    setTypeaheadLoading(true);
    try {
      const res = await fetch(`/api/typeahead-museums?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Failed to fetch typeahead');
      const data = await res.json();
      setTypeahead(data.museums || []);
      setShowTypeahead(true);
    } catch {
      setTypeahead([]);
      setShowTypeahead(false);
    } finally {
      setTypeaheadLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    setShowTypeahead(!!q);
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => fetchTypeahead(q), 250);
  }

  // Update URL when search or load more
  async function handleSearch(q: string) {
    setQuery(q);
    setShowTypeahead(false);
    setOffset(0);
    if (!q.trim()) {
      setResults([]);
      setError(null);
      setHasMore(false);
      router.push('/search');
      return;
    }
    setLoading(true);
    setError(null);
    router.push(`/search?q=${encodeURIComponent(q)}&offset=0`);
    try {
      const res = await fetch(`/api/search-museums?q=${encodeURIComponent(q)}&offset=0`);
      if (!res.ok) throw new Error('Failed to fetch search results');
      const data = await res.json();
      setResults(data.museums || []);
      setHasMore((data.museums?.length || 0) === PAGE_SIZE);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMore() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    const nextOffset = offset + PAGE_SIZE;
    router.push(`/search?q=${encodeURIComponent(query)}&offset=${nextOffset}`);
    try {
      const res = await fetch(`/api/search-museums?q=${encodeURIComponent(query)}&offset=${nextOffset}`);
      if (!res.ok) throw new Error('Failed to fetch more results');
      const data = await res.json();
      setResults(prev => [...prev, ...(data.museums || [])]);
      setOffset(nextOffset);
      setHasMore((data.museums?.length || 0) === PAGE_SIZE);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  function handleTypeaheadClick(museum: Museum) {
    setShowTypeahead(false);
    // Update URL and search state to match the typeahead query
    const typeaheadQuery = museum.name;
    setQuery(typeaheadQuery);
    setOffset(0);
    router.push(`/search?q=${encodeURIComponent(typeaheadQuery)}&offset=0`);
    setLoading(true);
    setError(null);
    fetch(`/api/search-museums?q=${encodeURIComponent(typeaheadQuery)}&offset=0`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then(data => {
        setResults(data.museums || []);
        setHasMore((data.museums?.length || 0) === PAGE_SIZE);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setResults([]);
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
        // Navigate to museum details after state is set
        router.push(`/museum/${encodeURIComponent(museum.id)}`);
      });
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch(query);
      setShowTypeahead(false);
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
      <div className="flex flex-col items-center mb-8 relative">
        <div className="w-full max-w-xl">
          <input
            type="text"
            placeholder="Type to search museums..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-full px-6 py-4 border rounded-lg shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            autoFocus
            onBlur={() => setTimeout(() => setShowTypeahead(false), 200)}
            onFocus={() => query && setShowTypeahead(true)}
          />
          <button
            className="absolute right-2 top-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            style={{ zIndex: 20 }}
            onClick={() => handleSearch(query)}
          >
            Search
          </button>
          {showTypeahead && (typeaheadLoading ? (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-30 p-4 text-center text-gray-400">Loading...</div>
          ) : typeahead.length > 0 ? (
            <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-30 max-h-80 overflow-y-auto">
              {typeahead.map(museum => (
                <li
                  key={museum.id}
                  className="px-4 py-3 cursor-pointer hover:bg-blue-50 flex flex-col"
                  onMouseDown={() => handleTypeaheadClick(museum)}
                >
                  <span className="font-semibold text-base">{museum.name}</span>
                  <span className="text-sm text-gray-500">{[museum.city, museum.country].filter(Boolean).join(', ')}</span>
                </li>
              ))}
            </ul>
          ) : query && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-30 p-4 text-center text-gray-400">No results</div>
          ))}
        </div>
      </div>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <MuseumGrid
        museums={dedupedResults}
        userData={{}}
        emptyMessage={query && !loading && !error ? 'No museums found.' : undefined}
      />
      {hasMore && dedupedResults.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
} 