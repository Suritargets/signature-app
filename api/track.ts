/**
 * ═══════════════════════════════════════════════════════════
 * POWERED BY SURITARGETS N.V. - PROPRIETARY SOFTWARE
 * ═══════════════════════════════════════════════════════════
 * Copyright © 2026 Suritargets N.V. All Rights Reserved.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 * ═══════════════════════════════════════════════════════════
 */

import { put, list } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/* ═══════════════════════════════════════════════════════════
 * SURITARGETS N.V. - API TRACKING ENDPOINT
 * ═══════════════════════════════════════════════════════════ */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { signatureData, hasCopied } = req.body;

    // Get IP address
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    
    // Create log entry
    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ipAddress: ip,
      userName: signatureData.name || 'Unknown',
      userEmail: signatureData.email || 'Unknown',
      companyName: signatureData.companyName || 'Unknown',
      signatureData: signatureData,
      hasCopied: hasCopied || false,
    };

    // Get existing data
    const blobList = await list({ prefix: 'signature-logs.json' });
    let existingData: any[] = [];

    if (blobList.blobs.length > 0) {
      const blob = blobList.blobs[0];
      const response = await fetch(blob.url);
      existingData = await response.json();
    }

    // Add new entry
    existingData.push(logEntry);

    // Save updated data
    await put('signature-logs.json', JSON.stringify(existingData, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });

    return res.status(200).json({ success: true, message: 'Data logged successfully' });
  } catch (error) {
    console.error('Error logging data:', error);
    return res.status(500).json({ error: 'Failed to log data' });
  }
}
