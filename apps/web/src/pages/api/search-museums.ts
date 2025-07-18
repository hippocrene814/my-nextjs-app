import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchMuseumsByIds, fetchMuseumsSearch } from '@museum-app/shared';

function sanitizeQuery(q: string) {
  return q.replace(/[^\w\s-]/g, '').trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, id, offset } = req.query;

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
  try {
    const { museums } = await fetchMuseumsSearch(safeQ, offsetNum);
    res.status(200).json({ museums });
  } catch (err: any) {
    console.error('Wikidata search error:', err);
    res.status(500).json({ museums: [], error: err.message || 'Unknown error' });
  }
} 