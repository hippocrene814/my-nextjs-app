import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchMuseumsTypeahead } from '@museum-app/shared';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;
  if (!q || typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ museums: [] });
  }
  try {
    const museums = await fetchMuseumsTypeahead(q);
    res.status(200).json({ museums });
  } catch (err: any) {
    console.error('Typeahead error:', err);
    res.status(500).json({ museums: [], error: err.message || 'Unknown error' });
  }
} 