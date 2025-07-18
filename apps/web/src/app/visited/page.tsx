"use client";
import React, { useEffect, useState } from "react";
import { getMuseums } from "../../context/MuseumsContext";
import MuseumGrid from "../../components/MuseumGrid";
import { fetchMuseumsByIds } from "@museum-app/shared";

export default function VisitedPage() {
  const { userData } = getMuseums();
  const [visitedMuseums, setVisitedMuseums] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

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
    fetchMuseumsByIds(visitedIds)
      .then(museums => {
        setVisitedMuseums(museums);
      })
      .catch(err => {
        setError("Failed to load visited museums.");
      })
      .finally(() => setLoading(false));
  }, [userData]);

  // Pagination logic
  const pagedVisitedMuseums = visitedMuseums.slice(0, page * PAGE_SIZE);
  const canLoadMore = pagedVisitedMuseums.length < visitedMuseums.length;

  // Reset page when visitedMuseums changes
  useEffect(() => {
    setPage(1);
  }, [visitedMuseums.length]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 mt-6 text-center">Visited Museums</h1>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <MuseumGrid
        museums={pagedVisitedMuseums}
        userData={userData}
        emptyMessage="You haven't marked any museums as visited yet."
      />
      {canLoadMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
} 