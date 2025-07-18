// shared/utils/constants.ts

export const API_CONSTANTS = {
  PAGE_SIZE: 20,
  SEARCH_FETCH_LIMIT: 30,
  TYPEAHEAD_FETCH_LIMIT: 20,
  TYPEAHEAD_DISPLAY_LIMIT: 7,
  WIKIDATA_ENDPOINT: 'https://query.wikidata.org/sparql',
} as const;

export const ERROR_MESSAGES = {
  FETCH_MUSEUMS_FAILED: 'Failed to fetch museums',
  INVALID_MUSEUM_DATA: 'Invalid museum data received',
} as const; 