"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { getAllUserMuseums } from "@/lib/userMuseums";
import { getMuseums } from '../context/MuseumsContext';
import MuseumCard from '../components/MuseumCard';

export default function Home() {
  const { museums, userData: contextUserData, loading, error, hasMore, fetchNextPage } = getMuseums();
  const { data: session } = useSession();
  const userId = session?.user?.email;

  // Local userData state for Firestore data
  const [userData, setUserData] = useState(contextUserData);
  const [userDataLoading, setUserDataLoading] = useState(false);

  // Fetch all user-museum docs on login
  useEffect(() => {
    let ignore = false;
    async function fetchUserData() {
      if (!userId) {
        setUserData(contextUserData);
        return;
      }
      setUserDataLoading(true);
      const docs = await getAllUserMuseums(userId);
      if (!ignore) {
        // Map Firestore docs to userData shape: { [museum_id]: { status, notes } }
        const mapped: Record<string, { status: 'none' | 'wish' | 'visited'; notes: string }> = {};
        for (const doc of docs) {
          let status: 'none' | 'wish' | 'visited' = 'none';
          if (doc.visited) status = 'visited';
          else if (doc.wish) status = 'wish';
          mapped[doc.museum_id] = { status, notes: doc.notes || "" };
        }
        setUserData(mapped);
      }
      setUserDataLoading(false);
    }
    fetchUserData();
    return () => { ignore = true; };
  }, [userId, contextUserData]);

  // Deduplicate by id (Wikidata entity URI)
  const seen = new Set<string>();
  const filtered = museums.filter(m => {
    if (!m.id) return false;
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 mt-6 text-center">Explore Museums</h1>
      {userDataLoading ? (
        <div className="text-center text-gray-400 mb-4">Loading your data...</div>
      ) : null}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((museum) => (
          <MuseumCard
            key={museum.id}
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
