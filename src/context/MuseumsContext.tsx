"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// --- Types ---
export type MuseumStatus = 'none' | 'wish' | 'visited';

export interface Museum {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
}

export interface UserMuseumData {
  status: MuseumStatus;
  notes: string;
}

export interface MuseumsState {
  museums: Museum[];
  userData: Record<string, UserMuseumData>; // key: museum id
}

// --- Static Museums List ---
const initialMuseums: Museum[] = [
  {
    id: '1',
    name: 'Museum of Fine Arts, Boston',
    location: 'Boston, USA',
    description: 'One of the most comprehensive art museums in the world.',
    image: '/mfa-boston.jpg',
  },
  {
    id: '2',
    name: 'The Louvre',
    location: 'Paris, France',
    description: "The world's largest art museum and a historic monument.",
    image: '/louvre.jpg',
  },
  {
    id: '3',
    name: 'The British Museum',
    location: 'London, UK',
    description: 'A museum dedicated to human history, art and culture.',
    image: '/british-museum.jpg',
  },
];

// --- Actions ---
type Action =
  | { type: 'SET_STATUS'; id: string; status: MuseumStatus }
  | { type: 'SET_NOTES'; id: string; notes: string }
  | { type: 'LOAD_USER_DATA'; userData: Record<string, UserMuseumData> };

function reducer(state: MuseumsState, action: Action): MuseumsState {
  switch (action.type) {
    case 'SET_STATUS':
      return {
        ...state,
        userData: {
          ...state.userData,
          [action.id]: {
            ...state.userData[action.id],
            status: action.status,
          },
        },
      };
    case 'SET_NOTES':
      return {
        ...state,
        userData: {
          ...state.userData,
          [action.id]: {
            ...state.userData[action.id],
            notes: action.notes,
          },
        },
      };
    case 'LOAD_USER_DATA':
      return {
        ...state,
        userData: action.userData,
      };
    default:
      return state;
  }
}

// --- Context ---
interface MuseumsContextProps extends MuseumsState {
  setStatus: (id: string, status: MuseumStatus) => void;
  setNotes: (id: string, notes: string) => void;
}

const MuseumsContext = createContext<MuseumsContextProps | undefined>(undefined);

// --- Provider ---
export const MuseumsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    museums: initialMuseums,
    userData: {},
  });

  // Load user data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('museumUserData');
    if (stored) {
      dispatch({ type: 'LOAD_USER_DATA', userData: JSON.parse(stored) });
    }
  }, []);

  // Save user data to localStorage
  useEffect(() => {
    localStorage.setItem('museumUserData', JSON.stringify(state.userData));
  }, [state.userData]);

  const setStatus = (id: string, status: MuseumStatus) => {
    dispatch({ type: 'SET_STATUS', id, status });
  };

  const setNotes = (id: string, notes: string) => {
    dispatch({ type: 'SET_NOTES', id, notes });
  };

  return (
    <MuseumsContext.Provider value={{ ...state, setStatus, setNotes }}>
      {children}
    </MuseumsContext.Provider>
  );
};

// --- Hooks ---
export function useMuseums() {
  const context = useContext(MuseumsContext);
  if (!context) throw new Error('useMuseums must be used within MuseumsProvider');
  return context;
}

export function useMuseum(id: string) {
  const { museums, userData, setStatus, setNotes } = useMuseums();
  const museum = museums.find((m) => m.id === id);
  const user = userData[id] || { status: 'none', notes: '' };
  return { museum, user, setStatus, setNotes };
} 