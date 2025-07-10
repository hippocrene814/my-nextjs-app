// shared/models/UserMuseum.ts

export type UserMuseumDoc = {
  user_id: string;
  museum_id: string;
  visited: boolean;
  wish: boolean;
  notes?: string;
}; 