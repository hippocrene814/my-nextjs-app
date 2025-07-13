"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getAllUserMuseums } from '@/lib/userMuseums';
import { Museum, MuseumStatus, UserMuseumData } from '@museum-app/shared';
import { fetchMuseums } from '@museum-app/shared';

export interface MuseumsState {
  museums: Museum[];
  userData: Record<string, UserMuseumData>; // key: museum id
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  nextOffset: number;
}

// --- Actions ---
type Action =
  | { type: 'SET_WISH'; id: string; wish: boolean }
  | { type: 'SET_VISITED'; id: string; visited: boolean }
  | { type: 'SET_NOTES'; id: string; notes: string }
  | { type: 'LOAD_USER_DATA'; userData: Record<string, UserMuseumData> }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; museums: Museum[]; hasMore: boolean; nextOffset: number }
  | { type: 'FETCH_ERROR'; error: string };

function reducer(state: MuseumsState, action: Action): MuseumsState {
  switch (action.type) {
    case 'SET_WISH':
      return {
        ...state,
        userData: {
          ...state.userData,
          [action.id]: {
            ...state.userData[action.id],
            wish: action.wish,
          },
        },
      };
    case 'SET_VISITED':
      return {
        ...state,
        userData: {
          ...state.userData,
          [action.id]: {
            ...state.userData[action.id],
            visited: action.visited,
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
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS': {
      // Deduplicate by name+city+country (case-insensitive)
      const makeKey = (m: Museum) => `${(m.name || '').toLowerCase()}|${(m.city || '').toLowerCase()}|${(m.country || '').toLowerCase()}`;
      const existingKeys = new Set(state.museums.map(makeKey));
      const newMuseums = action.museums.filter(m => !existingKeys.has(makeKey(m)));
      return {
        ...state,
        museums: [...state.museums, ...newMuseums],
        loading: false,
        error: null,
        hasMore: action.hasMore,
        nextOffset: action.nextOffset,
      };
    }
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// --- Context ---
interface MuseumsContextProps extends MuseumsState {
  setWish: (id: string, wish: boolean) => void;
  setVisited: (id: string, visited: boolean) => void;
  setNotes: (id: string, notes: string) => void;
  fetchNextPage: () => void;
}

const MuseumsContext = createContext<MuseumsContextProps | undefined>(undefined);

// --- Fetch Museums from Wikidata SPARQL API ---
const PAGE_SIZE = 20;

// --- Provider ---
export const MuseumsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    museums: [],
    userData: {},
    loading: false,
    error: null,
    hasMore: true,
    nextOffset: 0,
  });
  const didFetchFirstPage = useRef(false);
  const { data: session } = useSession();
  const userId = session?.user?.email;

  // Load user data from localStorage (with migration/cleanup)
  useEffect(() => {
    const stored = localStorage.getItem('museumUserData');
    if (stored) {
      const parsed = JSON.parse(stored);
      const keys = Object.keys(parsed);
      const allValid = keys.every(k => k.startsWith('http://www.wikidata.org/entity/'));
      if (!allValid) {
        // Remove legacy/invalid data
        localStorage.removeItem('museumUserData');
        console.log('MuseumsContext: Cleared legacy/invalid userData from localStorage');
      } else {
        dispatch({ type: 'LOAD_USER_DATA', userData: parsed });
      }
    }
  }, []);

  // Load user data from Firestore on login
  useEffect(() => {
    if (!userId) return;
    let ignore = false;
    getAllUserMuseums(userId).then(docs => {
      if (ignore) return;
      // Convert Firestore docs to userData shape
      const userData: Record<string, UserMuseumData> = {};
      docs.forEach(doc => {
        userData[doc.museum_id] = {
          wish: !!doc.wish,
          visited: !!doc.visited,
          notes: doc.notes || '',
        };
      });
      dispatch({ type: 'LOAD_USER_DATA', userData });
    });
    return () => { ignore = true; };
  }, [userId]);

  // Fetch only the first page on mount
  useEffect(() => {
    if (!didFetchFirstPage.current) {
      dispatch({ type: 'FETCH_START' });
      fetchMuseums(0)
        .then(({ museums, hasMore }) => {
          dispatch({ type: 'FETCH_SUCCESS', museums, hasMore, nextOffset: PAGE_SIZE });
        })
        .catch((err) => {
          dispatch({ type: 'FETCH_ERROR', error: err.message });
        });
      didFetchFirstPage.current = true;
    }
  }, []);

  const setWish = (id: string, wish: boolean) => {
    dispatch({ type: 'SET_WISH', id, wish });
  };

  const setVisited = (id: string, visited: boolean) => {
    dispatch({ type: 'SET_VISITED', id, visited });
  };

  const setNotes = (id: string, notes: string) => {
    dispatch({ type: 'SET_NOTES', id, notes });
  };

  const fetchNextPage = () => {
    if (!state.loading && state.hasMore) {
      dispatch({ type: 'FETCH_START' });
      fetchMuseums(state.nextOffset)
        .then(({ museums, hasMore }) => {
          dispatch({ type: 'FETCH_SUCCESS', museums, hasMore, nextOffset: state.nextOffset + PAGE_SIZE });
        })
        .catch((err) => {
          dispatch({ type: 'FETCH_ERROR', error: err.message });
        });
    }
  };

  return (
    <MuseumsContext.Provider value={{ ...state, setWish, setVisited, setNotes, fetchNextPage }}>
      {children}
    </MuseumsContext.Provider>
  );
};

// --- Hooks ---
export function getMuseums() {
  const context = useContext(MuseumsContext);
  if (!context) throw new Error('getMuseums must be used within MuseumsProvider');
  return context;
}

export function getMuseum(id: string) {
  const { museums, userData, setWish, setVisited, setNotes } = getMuseums();
  const museum = museums.find((m) => m.id === id);
  const user = userData[id] || { wish: false, visited: false, notes: '' };
  return { museum, user, setWish, setVisited, setNotes };
} 