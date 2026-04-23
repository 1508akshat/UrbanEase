export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Read the secure API key from Vercel Environment Variables
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      console.error("GEMINI_API_KEY is not set in Vercel Environment Variables.");
      return res.status(500).json({ error: 'Internal Server Configuration Error' });
    }

    const payload = req.body;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    // Forward the request to Google
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof payload === 'string' ? payload : JSON.stringify(payload)
    });

    const data = await response.json();
    
    // Return the Google response back to the frontend
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
