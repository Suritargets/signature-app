import { list } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Hardcoded credentials
const ADMIN_USERNAME = 'Ken';
const ADMIN_CODE = 'OG4712345';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const { username, code } = req.query;

    if (username !== ADMIN_USERNAME || code !== ADMIN_CODE) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get existing data from blob storage
    const blobList = await list({ prefix: 'signature-logs.json' });
    let data: any[] = [];

    if (blobList.blobs.length > 0) {
      const blob = blobList.blobs[0];
      const response = await fetch(blob.url);
      data = await response.json();
    }

    // Return data sorted by timestamp (newest first)
    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
