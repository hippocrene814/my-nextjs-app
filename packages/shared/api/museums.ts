// shared/api/museums.ts

import { Museum } from '../models/Museum';
import { API_CONSTANTS, ERROR_MESSAGES } from '../utils/constants';

export async function fetchMuseums(offset = 0): Promise<{ museums: Museum[]; hasMore: boolean }> {
  const query = `
    SELECT ?museum ?museumLabel
          (MIN(STR(?cityLabel)) AS ?cityLabel)
          (MIN(STR(?countryLabel)) AS ?countryLabel)
          (MIN(STR(?desc)) AS ?desc)
          (MIN(STR(?website)) AS ?website)
          (MIN(STR(?thumb)) AS ?thumb)
          (MIN(STR(?logo)) AS ?logo)
    WHERE {
      ?museum wdt:P31 wd:Q33506;      # instance of museum
              wdt:P17 wd:Q30.         # country = United States

      OPTIONAL { ?museum wdt:P131 ?city. }
      OPTIONAL { ?museum wdt:P17 ?country. }
      OPTIONAL { ?museum schema:description ?desc. FILTER(LANG(?desc) = "en") }
      OPTIONAL { ?museum wdt:P856 ?website. }
      OPTIONAL { ?museum wdt:P18 ?thumb. }
      OPTIONAL { ?museum wdt:P154 ?logo. }

      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "en".
      }
    }
    GROUP BY ?museum ?museumLabel
    LIMIT ${API_CONSTANTS.PAGE_SIZE}
    OFFSET ${offset}
  `;

  const url = API_CONSTANTS.WIKIDATA_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=json';
  const res = await fetch(url);
  if (!res.ok) throw new Error(ERROR_MESSAGES.FETCH_MUSEUMS_FAILED);
  const data = await res.json() as any;
  const museums: Museum[] = data.results.bindings.map((item: any) => ({
    id: item.museum.value,
    name: item.museumLabel?.value || '',
    city: item.cityLabel?.value,
    country: item.countryLabel?.value,
    description: item.desc?.value,
    website: item.website?.value,
    image: item.thumb?.value,
    logo: item.logo?.value,
  }));
  return { museums, hasMore: museums.length === API_CONSTANTS.PAGE_SIZE };
}

export async function fetchMuseumsByIds(ids: string[]): Promise<Museum[]> {
  if (!ids.length) return [];
  // Format IDs for SPARQL: <id1> <id2> ...
  const idFilters = ids.map(id => `(<${id}>)`).join(' ');
  const query = `
    SELECT ?museum ?museumLabel
          (MIN(STR(?cityLabel)) AS ?cityLabel)
          (MIN(STR(?countryLabel)) AS ?countryLabel)
          (MIN(STR(?desc)) AS ?desc)
          (MIN(STR(?website)) AS ?website)
          (MIN(STR(?thumb)) AS ?thumb)
          (MIN(STR(?logo)) AS ?logo)
    WHERE {
      VALUES (?museum) { ${idFilters} }
      ?museum wdt:P31 wd:Q33506;
              wdt:P17 wd:Q30.
      OPTIONAL { ?museum wdt:P131 ?city. }
      OPTIONAL { ?museum wdt:P17 ?country. }
      OPTIONAL { ?museum schema:description ?desc. FILTER(LANG(?desc) = "en") }
      OPTIONAL { ?museum wdt:P856 ?website. }
      OPTIONAL { ?museum wdt:P18 ?thumb. }
      OPTIONAL { ?museum wdt:P154 ?logo. }
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "en".
      }
    }
    GROUP BY ?museum ?museumLabel
  `;
  const url = API_CONSTANTS.WIKIDATA_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=json';
  const res = await fetch(url);
  if (!res.ok) throw new Error(ERROR_MESSAGES.FETCH_MUSEUMS_FAILED);
  const data = await res.json() as any;
  const museums: Museum[] = data.results.bindings.map((item: any) => ({
    id: item.museum.value,
    name: item.museumLabel?.value || '',
    city: item.cityLabel?.value,
    country: item.countryLabel?.value,
    description: item.desc?.value,
    website: item.website?.value,
    image: item.thumb?.value,
    logo: item.logo?.value,
  }));
  return museums;
}

/**
 * Fetch typeahead museum results for a query string.
 * Deduplicates and sorts (startsWith > contains, then alpha).
 */
export async function fetchMuseumsTypeahead(query: string): Promise<Museum[]> {
  if (!query.trim()) return [];
  const safeQ = query.replace(/[^\w\s-]/g, '').trim();
  const sparql = `
    SELECT ?museum ?museumLabel ?cityLabel ?countryLabel ?desc ?website ?thumb ?logo WHERE {
      ?museum wdt:P31 wd:Q33506;
              wdt:P17 wd:Q30.
      ?museum rdfs:label ?museumLabel.
      FILTER(CONTAINS(LCASE(?museumLabel), LCASE("${safeQ}")))
      OPTIONAL { ?museum wdt:P131 ?city. }
      OPTIONAL { ?museum wdt:P17 ?country. }
      OPTIONAL { ?museum schema:description ?desc. FILTER(LANG(?desc) = "en") }
      OPTIONAL { ?museum wdt:P856 ?website. }
      OPTIONAL { ?museum wdt:P18 ?thumb. }
      OPTIONAL { ?museum wdt:P154 ?logo. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT ${API_CONSTANTS.TYPEAHEAD_FETCH_LIMIT}
  `;
  const url = API_CONSTANTS.WIKIDATA_ENDPOINT + '?query=' + encodeURIComponent(sparql) + '&format=json';
  try {
    // Wikidata requires a custom User-Agent for API requests from Node.js environments.
    // Browsers and React Native will ignore this header.
    const headers: Record<string, string> = {};
    if (typeof process !== 'undefined' && process.release?.name === 'node') {
      headers['User-Agent'] = 'MuseumApp/1.0 (https://github.com/your-repo; your-email@example.com)';
    }
    const res = await fetch(url, { headers });
    const data = await res.json() as any;
    let museums: Museum[] = data.results.bindings.map((item: any) => ({
      id: item.museum.value,
      name: item.museumLabel?.value || '',
      city: item.cityLabel?.value,
      country: item.countryLabel?.value,
      description: item.desc?.value,
      website: item.website?.value,
      image: item.thumb?.value,
      logo: item.logo?.value,
    }));
    // Sort: names that start with the query first, then those that contain it, then alpha
    const qLower = safeQ.toLowerCase();
    museums = museums.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(qLower);
      const bStarts = bName.startsWith(qLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return aName.localeCompare(bName);
    });
    // Deduplicate by id
    const seen = new Set<string>();
    museums = museums.filter(m => {
      if (!m.id || seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
    return museums.slice(0, API_CONSTANTS.TYPEAHEAD_DISPLAY_LIMIT);
  } catch (err) {
    // Optionally log error
    return [];
  }
}

/**
 * Fetch paginated museum search results for a query string.
 * Deduplicates and returns hasMore flag.
 */
export async function fetchMuseumsSearch(query: string, offset = 0): Promise<{ museums: Museum[]; hasMore: boolean }> {
  if (!query.trim()) return { museums: [], hasMore: false };
  const safeQ = query.replace(/[^\w\s-]/g, '').trim();
  const sparql = `
    SELECT ?museum ?museumLabel ?cityLabel ?countryLabel ?desc ?website ?thumb ?logo WHERE {
      ?museum wdt:P31 wd:Q33506;
              wdt:P17 wd:Q30.
      ?museum rdfs:label ?museumLabel.
      FILTER(CONTAINS(LCASE(?museumLabel), LCASE("${safeQ}")))
      OPTIONAL { ?museum wdt:P131 ?city. }
      OPTIONAL { ?museum wdt:P17 ?country. }
      OPTIONAL { ?museum schema:description ?desc. FILTER(LANG(?desc) = "en") }
      OPTIONAL { ?museum wdt:P856 ?website. }
      OPTIONAL { ?museum wdt:P18 ?thumb. }
      OPTIONAL { ?museum wdt:P154 ?logo. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT ${API_CONSTANTS.SEARCH_FETCH_LIMIT}
    OFFSET ${offset}
  `;
  const url = API_CONSTANTS.WIKIDATA_ENDPOINT + '?query=' + encodeURIComponent(sparql) + '&format=json';
  try {
    // Wikidata requires a custom User-Agent for API requests from Node.js environments.
    // Browsers and React Native will ignore this header.
    const headers: Record<string, string> = {};
    if (typeof process !== 'undefined' && process.release?.name === 'node') {
      headers['User-Agent'] = 'MuseumApp/1.0 (https://github.com/your-repo; your-email@example.com)';
    }
    const res = await fetch(url, { headers });
    const data = await res.json() as any;
    let museums: Museum[] = data.results.bindings.map((item: any) => ({
      id: item.museum.value,
      name: item.museumLabel?.value || '',
      city: item.cityLabel?.value,
      country: item.countryLabel?.value,
      description: item.desc?.value,
      website: item.website?.value,
      image: item.thumb?.value,
      logo: item.logo?.value,
    }));
    // Deduplicate by id
    const seen = new Set<string>();
    museums = museums.filter(m => {
      if (!m.id || seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
    return { museums, hasMore: museums.length === API_CONSTANTS.SEARCH_FETCH_LIMIT };
  } catch (err) {
    // Optionally log error
    return { museums: [], hasMore: false };
  }
} 