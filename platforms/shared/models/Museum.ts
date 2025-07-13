// shared/models/Museum.ts

export type MuseumStatus = 'none' | 'wish' | 'visited';

export interface Museum {
  id: string;
  name: string;
  city?: string;
  country?: string;
  description?: string;
  website?: string;
  image?: string;
  logo?: string;
}

export interface UserMuseumData {
  wish: boolean;
  visited: boolean;
  notes: string;
} 