// shared/api/museums.ts

import { Museum } from '../models/Museum';
import { API_CONSTANTS, ERROR_MESSAGES } from '../utils/constants';

export async function fetchMuseums(offset = 0): Promise<{ museums: Museum[]; hasMore: boolean }> {
  const query = `
    SELECT ?museum ?museumLabel ?cityLabel ?countryLabel ?desc ?website ?thumb ?logo WHERE {
      ?museum wdt:P31 wd:Q33506; # instance of museum
              wdt:P17 wd:Q30.   # country = United States
      OPTIONAL { ?museum wdt:P131 ?city. }
      OPTIONAL { ?museum wdt:P17 ?country. }
      OPTIONAL { ?museum schema:description ?desc. FILTER(LANG(?desc) = "en") }
      OPTIONAL { ?museum wdt:P856 ?website. }
      OPTIONAL { ?museum wdt:P18 ?thumb. }
      OPTIONAL { ?museum wdt:P154 ?logo. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
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