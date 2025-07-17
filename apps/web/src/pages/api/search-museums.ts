import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchMuseumsByIds } from '@museum-app/shared';

function sanitizeQuery(q: string) {
  // Remove quotes and special SPARQL characters
  return q.replace(/[^\w\s-]/g, '').trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, id, offset } = req.query;
  const endpoint = 'https://query.wikidata.org/sparql';

  // Fetch by id if provided
  if (id && typeof id === 'string' && id.trim()) {
    const safeId = id.trim();
    try {
      const museums = await fetchMuseumsByIds([safeId]);
      const museum = museums[0] || null;
      return res.status(200).json({ museum });
    } catch (err: any) {
      console.error('Wikidata fetch-by-id error:', err);
      return res.status(500).json({ museum: null, error: err.message || 'Unknown error' });
    }
  }

  // Otherwise, search by query string
  if (!q || typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ museums: [] });
  }
  const safeQ = sanitizeQuery(q);
  let offsetNum = 0;
  if (typeof offset === 'string') {
    const parsed = parseInt(offset, 10);
    if (!isNaN(parsed) && parsed >= 0) offsetNum = parsed;
  }
  const query = `
    SELECT ?museum ?museumLabel ?cityLabel ?countryLabel ?desc ?website ?thumb ?logo WHERE {
      ?museum wdt:P31 wd:Q33506; # instance of museum
              wdt:P17 wd:Q30.   # country = United States
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
    LIMIT 30
    OFFSET ${offsetNum}
  `;
  const url = endpoint + '?query=' + encodeURIComponent(query) + '&format=json';
  try {
    const wikidataRes = await fetch(url, {
      headers: {
        'User-Agent': 'MuseumApp/1.0 (https://github.com/your-repo; your-email@example.com)'
      }
    });
    if (!wikidataRes.ok) throw new Error('Failed to fetch from Wikidata');
    const data = await wikidataRes.json();
    const museums = data.results.bindings.map((item: any) => ({
      id: item.museum.value,
      name: item.museumLabel?.value || '',
      city: item.cityLabel?.value,
      country: item.countryLabel?.value,
      description: item.desc?.value,
      website: item.website?.value,
      image: item.thumb?.value,
      logo: item.logo?.value,
    }));
    res.status(200).json({ museums });
  } catch (err: any) {
    console.error('Wikidata search error:', err);
    res.status(500).json({ museums: [], error: err.message || 'Unknown error' });
  }
} 