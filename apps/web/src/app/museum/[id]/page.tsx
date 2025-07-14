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

// Star icon SVGs
const StarFilled = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="#facc15" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#eab308" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25l-6.172 3.245 1.179-6.873L2.25 9.755l6.9-1.002L12 2.25l2.85 6.503 6.9 1.002-4.757 4.867 1.179 6.873z" />
  </svg>
);
const StarOutline = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#eab308" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25l-6.172 3.245 1.179-6.873L2.25 9.755l6.9-1.002L12 2.25l2.85 6.503 6.9 1.002-4.757 4.867 1.179 6.873z" />
  </svg>
);

export default function MuseumDetailPage() {
  const params = useParams<{ id?: string }>() ?? {};
  const id = decodeURIComponent(params.id ?? "");
  const router = useRouter();
  const { data: session } = useSession();
  // Use email as userId fallback
  const userId = session?.user?.email;

  const { museum: contextMuseum, user, setWish, setVisited, setNotes } = getMuseum(id);
  const [museum, setMuseum] = useState(contextMuseum);
  const [fetchingMuseum, setFetchingMuseum] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Local state for toggles
  const [visitedLocal, setVisitedLocal] = useState(!!user.visited);
  const [wishLocal, setWishLocal] = useState(user.wish);
  const [note, setNote] = useState(user.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // If not found in context, fetch from API
  useEffect(() => {
    if (contextMuseum) {
      setMuseum(contextMuseum);
      setVisitedLocal(!!user.visited);
      setWishLocal(user.wish);
      setNote(user.notes ?? "");
      setFetchError(null);
      return;
    }
    if (!id) return;
    setFetchingMuseum(true);
    setFetchError(null);
    fetch(`/api/search-museums?id=${encodeURIComponent(id)}`)
      .then(res => res.ok ? res.json() : Promise.reject('Not found'))
      .then(data => {
        if (data && data.museum) {
          setMuseum(data.museum);
          setVisitedLocal(!!user.visited);
          setWishLocal(user.wish);
          setNote(user.notes ?? "");
          setFetchError(null);
        } else {
          setMuseum(undefined);
          setFetchError('Museum not found.');
        }
      })
      .catch(() => {
        setMuseum(undefined);
        setFetchError('Museum not found.');
      })
      .finally(() => setFetchingMuseum(false));
  }, [contextMuseum, id, user.visited, user.wish, user.notes]);

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
        setVisited(museum.id, !!doc.visited);
        setWish(museum.id, !!doc.wish);
        setNote(doc.notes || "");
      }
      setInitialLoading(false);
    }
    fetchUserMuseum();
    return () => { ignore = true; };
  }, [userId, museum]);

  if (fetchingMuseum) {
    return <div className="max-w-2xl mx-auto p-8 text-center text-gray-400">Loading...</div>;
  }
  if (!museum || fetchError) {
    return <div className="max-w-2xl mx-auto p-8 text-center text-gray-500">Museum not found.</div>;
  }

  // Handlers for toggling status (local state only)
  const handleToggleVisited = () => {
    const newVisited = !(visitedLocal ?? false);
    setVisitedLocal(newVisited);
    setVisited(museum.id, newVisited);
    setSaved(false);
  };

  const handleToggleWish = () => {
    const newWish = !wishLocal;
    setWishLocal(newWish);
    setWish(museum.id, newWish);
    setSaved(false);
  };

  // Handler for editing notes (local state only)
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    setNotes(museum.id, e.target.value);
    setSaved(false);
  };

  // Handler for saving to Firestore
  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await saveUserMuseum({
        userId,
        museumId: museum.id,
        visited: visitedLocal ?? false,
        wish: wishLocal ?? false,
        notes: note,
      });
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Wish to Visit Section */}
      <div className="mb-6 flex items-center gap-3">
        <span className="font-semibold">Wish to Visit:</span>
        <button
          aria-label={wishLocal ? "Remove from Wish to Visit" : "Add to Wish to Visit"}
          className={`focus:outline-none transition-transform ${wishLocal ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
          onClick={handleToggleWish}
          disabled={loading}
        >
          {wishLocal ? StarFilled : StarOutline}
        </button>
        <span className="text-sm text-gray-500">{wishLocal ? "Added to your wish list" : "Not in wish list"}</span>
      </div>
      {/* Visited Section */}
      <div className="mb-6 flex items-center gap-3">
        <span className="font-semibold">Visited:</span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={visitedLocal ?? false}
            onChange={handleToggleVisited}
            className="sr-only peer"
            disabled={loading}
          />
          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-green-400 transition-all duration-200 relative`}>
            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-200 ${visitedLocal ? 'translate-x-5' : ''}`}></div>
          </div>
        </label>
        <span className="text-sm text-gray-500">{visitedLocal ? "You've visited this museum" : "Not visited yet"}</span>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Your Notes / Reflections:</label>
        <textarea
          className="w-full min-h-[100px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={note}
          onChange={handleNoteChange}
          placeholder="Write your thoughts, memories, or plans..."
          disabled={loading}
        />
        <div className="text-xs text-gray-400 mt-1">Notes are saved when you click Save.</div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <button
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        {saved && <span className="text-green-600 font-medium">Saved!</span>}
      </div>
    </div>
  );
} 