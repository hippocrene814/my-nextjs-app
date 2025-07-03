import type { NextApiRequest, NextApiResponse } from 'next';

function sanitizeQuery(q: string) {
  // Remove quotes and special SPARQL characters
  return q.replace(/[^\w\s-]/g, '').trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;
  if (!q || typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ museums: [] });
  }
  const safeQ = sanitizeQuery(q);
  const endpoint = 'https://query.wikidata.org/sparql';
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
  `;
  const url = endpoint + '?query=' + encodeURIComponent(query) + '&format=json';
  try {
    const wikidataRes = await fetch(url);
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