import React from 'react';
import { Museum, MuseumStatus, UserMuseumData } from '../context/MuseumsContext';

interface MuseumCardProps {
  museum: Museum;
  userData: UserMuseumData;
  onStatusChange: (status: MuseumStatus) => void;
  onClick?: () => void;
}

const statusColors: Record<MuseumStatus, string> = {
  none: 'bg-gray-300 text-gray-700',
  wish: 'bg-yellow-200 text-yellow-800',
  visited: 'bg-green-200 text-green-800',
};

export default function MuseumCard({ museum, userData, onStatusChange, onClick }: MuseumCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow bg-white cursor-pointer" onClick={onClick}>
      <img src={museum.image} alt={museum.name} className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
        <div className="text-white text-xl font-semibold drop-shadow mb-1">{museum.name}</div>
        <div className="text-white text-sm drop-shadow mb-2">{museum.location}</div>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[userData.status]}`}>
          {userData.status === 'none' ? 'Unmarked' : userData.status === 'wish' ? 'Wish to Visit' : 'Visited'}
        </span>
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          className={`px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium shadow ${userData.status === 'wish' ? 'ring-2 ring-yellow-400' : ''}`}
          onClick={e => { e.stopPropagation(); onStatusChange('wish'); }}
        >
          Wish
        </button>
        <button
          className={`px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium shadow ${userData.status === 'visited' ? 'ring-2 ring-green-400' : ''}`}
          onClick={e => { e.stopPropagation(); onStatusChange('visited'); }}
        >
          Visited
        </button>
      </div>
    </div>
  );
} 