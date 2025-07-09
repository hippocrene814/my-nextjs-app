"use client";
import React, { useEffect, useState } from "react";
import { getMuseums } from "../../context/MuseumsContext";
import MuseumGrid from "../../components/MuseumGrid";

export default function VisitedPage() {
  const { userData } = getMuseums();
  const [visitedMuseums, setVisitedMuseums] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const visitedIds = Object.entries(userData)
      .filter(([_, data]) => data.visited)
      .map(([id]) => id);
    if (visitedIds.length === 0) {
      setVisitedMuseums([]);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all(
      visitedIds.map(id =>
        fetch(`/api/search-museums?id=${encodeURIComponent(id)}`)
          .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch"))
          .then(data => data.museum)
          .catch(() => null)
      )
    )
      .then(museums => {
        setVisitedMuseums(museums.filter(Boolean));
      })
      .catch(err => {
        setError("Failed to load visited museums.");
      })
      .finally(() => setLoading(false));
  }, [userData]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 mt-6 text-center">Visited Museums</h1>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <MuseumGrid
        museums={visitedMuseums}
        userData={userData}
        emptyMessage="You haven't marked any museums as visited yet."
      />
    </div>
  );
} 