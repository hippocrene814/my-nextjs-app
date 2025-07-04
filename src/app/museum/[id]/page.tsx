"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { saveUserMuseum, getUserMuseum } from "@/lib/userMuseums";
import { getMuseum } from '../../../context/MuseumsContext';

function getLocation(city?: string, country?: string) {
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return '';
}

const PLACEHOLDER = '/placeholder-museum.svg';

export default function MuseumDetailPage() {
  const params = useParams<{ id?: string }>() ?? {};
  const id = decodeURIComponent(params.id ?? "");
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.email;

  const { museum, user } = getMuseum(id);

  // Map user.status to booleans (default)
  const [visited, setVisited] = useState(user.status === 'visited');
  const [wish, setWish] = useState(user.status === 'wish');
  const [note, setNote] = useState(user.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // On mount, fetch Firestore data if logged in
  useEffect(() => {
    let ignore = false;
    async function fetchUserMuseum() {
      if (!userId || !museum) {
        setInitialLoading(false);
        return;
      }
      setInitialLoading(true);
      const doc = await getUserMuseum(userId, museum.id);
      if (!ignore && doc) {
        setVisited(!!doc.visited);
        setWish(!!doc.wish);
        setNote(doc.notes || "");
      }
      setInitialLoading(false);
    }
    fetchUserMuseum();
    return () => { ignore = true; };
  }, [userId, museum]);

  if (!museum) {
    return <div className="max-w-2xl mx-auto p-8 text-center text-gray-500">Museum not found.</div>;
  }

  // Handlers for toggling status
  const handleToggleVisited = async () => {
    if (!userId) return;
    const newVisited = !visited;
    setVisited(newVisited);
    setLoading(true);
    try {
      await saveUserMuseum({
        userId,
        museumId: museum.id,
        visited: newVisited,
        wish,
        notes: note,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWish = async () => {
    if (!userId) return;
    const newWish = !wish;
    setWish(newWish);
    setLoading(true);
    try {
      await saveUserMuseum({
        userId,
        museumId: museum.id,
        visited,
        wish: newWish,
        notes: note,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler for saving notes
  const handleSaveNotes = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await saveUserMuseum({
        userId,
        museumId: museum.id,
        visited,
        wish,
        notes: note,
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="max-w-2xl mx-auto p-8 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <button className="mb-4 px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 transition" onClick={() => router.back()}>
        &larr; Back
      </button>
      <div className="rounded-xl overflow-hidden shadow mb-6 relative">
        <img
          src={museum.image || PLACEHOLDER}
          alt={museum.name}
          className="w-full h-64 object-cover"
          onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        {museum.logo && (
          <img src={museum.logo} alt="Logo" className="absolute top-3 left-3 w-12 h-12 object-contain bg-white bg-opacity-80 rounded p-1 shadow" />
        )}
      </div>
      <h1 className="text-3xl font-bold mb-2">{museum.name}</h1>
      <div className="text-lg text-gray-600 mb-2">{getLocation(museum.city, museum.country)}</div>
      <div className="mb-6 text-gray-800">{museum.description}</div>
      {museum.website && (
        <div className="mb-6">
          <a href={museum.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
            {museum.website}
          </a>
        </div>
      )}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Status:</label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${wish ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-100 text-yellow-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleToggleWish}
            disabled={loading}
          >Wish to Visit</button>
          <button
            className={`px-4 py-2 rounded ${visited ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleToggleVisited}
            disabled={loading}
          >Visited</button>
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2">Your Notes / Reflections:</label>
        <textarea
          className="w-full min-h-[100px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={note}
          onChange={e => setNote(e.target.value)}
          onBlur={handleSaveNotes}
          placeholder="Write your thoughts, memories, or plans..."
          disabled={loading}
        />
        <div className="text-xs text-gray-400 mt-1">Notes are saved automatically.</div>
      </div>
    </div>
  );
} 