"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Museum, MuseumStatus, UserMuseumData } from '../context/MuseumsContext';

interface MuseumCardProps {
  museum: Museum;
  userData: UserMuseumData;
}

const statusColors: Record<MuseumStatus, string> = {
  none: 'bg-gray-300 text-gray-700',
  wish: 'bg-yellow-200 text-yellow-800',
  visited: 'bg-green-200 text-green-800',
};

function getLocation(city?: string, country?: string) {
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return '';
}

const PLACEHOLDER = '/placeholder-museum.svg'; // Place a simple SVG in public/

export default function MuseumCard({ museum, userData }: MuseumCardProps) {
  const router = useRouter();
  return (
    <div
      className="relative rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow bg-white cursor-pointer"
      onClick={() => router.push(`/museum/${encodeURIComponent(museum.id)}`)}
      style={{ minHeight: 192 }} // h-48
    >
      {/* Background image absolutely positioned */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={museum.image || PLACEHOLDER}
          alt={museum.name}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
      </div>
      {/* Gradient overlay at bottom for text readability, always visible */}
      <div className="absolute bottom-0 left-0 w-full h-28 z-10 pointer-events-none" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.15) 90%, rgba(0,0,0,0.0) 100%)'}} />
      {/* Status tag at top right, only if visited */}
      {userData.status === 'visited' && (
        <span className={`absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-semibold shadow bg-green-200 text-green-800`}>
          Visited
        </span>
      )}
      {/* Museum name and location */}
      <div className="absolute bottom-0 left-0 w-full p-4 z-20">
        <div className="text-white text-xl font-semibold drop-shadow mb-1">{museum.name}</div>
        <div className="text-white text-sm drop-shadow mb-0.5">{getLocation(museum.city, museum.country)}</div>
      </div>
    </div>
  );
} 