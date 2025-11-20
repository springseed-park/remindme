// Vercel Serverless Function - API 프록시
import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API_KEY not configured' });
  }

  try {
    const openai = new OpenAI({ apiKey: API_KEY });
    const { endpoint, data } = req.body;

    let response;

    switch (endpoint) {
      case 'chat':
        response = await openai.chat.completions.create(data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({
      error: 'OpenAI API request failed',
      message: error.message
    });
  }
}
