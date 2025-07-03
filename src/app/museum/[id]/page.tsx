"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMuseum } from '../../../context/MuseumsContext';

export default function MuseumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { museum, user, setStatus, setNotes } = useMuseum(id);
  const [note, setNote] = useState(user.notes);

  if (!museum) {
    return <div className="max-w-2xl mx-auto p-8 text-center text-gray-500">Museum not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <button className="mb-4 text-blue-600 hover:underline" onClick={() => router.back()}>&larr; Back</button>
      <div className="rounded-xl overflow-hidden shadow mb-6">
        <img src={museum.image} alt={museum.name} className="w-full h-64 object-cover" />
      </div>
      <h1 className="text-3xl font-bold mb-2">{museum.name}</h1>
      <div className="text-lg text-gray-600 mb-2">{museum.location}</div>
      <div className="mb-6 text-gray-800">{museum.description}</div>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Status:</label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${user.status === 'none' ? 'bg-gray-300 text-gray-700' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setStatus(museum.id, 'none')}
          >Unmarked</button>
          <button
            className={`px-4 py-2 rounded ${user.status === 'wish' ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-100 text-yellow-600'}`}
            onClick={() => setStatus(museum.id, 'wish')}
          >Wish to Visit</button>
          <button
            className={`px-4 py-2 rounded ${user.status === 'visited' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-600'}`}
            onClick={() => setStatus(museum.id, 'visited')}
          >Visited</button>
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2">Your Notes / Reflections:</label>
        <textarea
          className="w-full min-h-[100px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={note}
          onChange={e => setNote(e.target.value)}
          onBlur={() => setNotes(museum.id, note)}
          placeholder="Write your thoughts, memories, or plans..."
        />
        <div className="text-xs text-gray-400 mt-1">Notes are saved automatically.</div>
      </div>
    </div>
  );
} 