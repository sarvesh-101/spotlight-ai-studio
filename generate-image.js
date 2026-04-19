export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { prompt, aspectRatio = '1:1', referenceImage = null } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  try {
    const body = {
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: aspectRatio,
        safetyFilterLevel: 'block_few',
        personGeneration: 'allow_adult'
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Imagen API error');
    }

    const b64 = data.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) throw new Error('No image returned from API');

    const imageUrl = `data:image/png;base64,${b64}`;
    return res.status(200).json({ imageUrl });

  } catch (err) {
    console.error('Image generation error:', err);
    return res.status(500).json({ error: err.message || 'Image generation failed' });
  }
}
