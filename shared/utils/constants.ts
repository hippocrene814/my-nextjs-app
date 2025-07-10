// shared/utils/constants.ts

export const API_CONSTANTS = {
  PAGE_SIZE: 20,
  WIKIDATA_ENDPOINT: 'https://query.wikidata.org/sparql',
} as const;

export const MUSEUM_STATUS = {
  NONE: 'none',
  WISH: 'wish', 
  VISITED: 'visited',
} as const;

export const ERROR_MESSAGES = {
  FETCH_MUSEUMS_FAILED: 'Failed to fetch museums',
  INVALID_MUSEUM_DATA: 'Invalid museum data received',
} as const; 