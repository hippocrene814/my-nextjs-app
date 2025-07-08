import React from 'react';
import MuseumCard from './MuseumCard';

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

interface UserData {
  [museumId: string]: {
    status: 'none' | 'wish' | 'visited';
    notes: string;
  };
}

interface MuseumGridProps {
  museums: Museum[];
  userData: UserData;
  emptyMessage?: string;
}

export default function MuseumGrid({ museums, userData, emptyMessage }: MuseumGridProps) {
  // Debug: log all IDs and check for duplicates
  const ids = museums.map(m => m.id);
  const idCounts = ids.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('MuseumGrid ids:', ids);
  console.log('MuseumGrid duplicate id counts:', Object.entries(idCounts).filter(([_, count]) => (count as number) > 1));
  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {museums.map((museum) => (
        <MuseumCard
          key={museum.id}
          museum={museum}
          userData={userData[museum.id] || { status: 'none', notes: '' }}
        />
      ))}
      {museums.length === 0 && (
        <div className="col-span-full text-center text-gray-500">
          {emptyMessage || 'No museums found.'}
        </div>
      )}
    </div>
  );
} 