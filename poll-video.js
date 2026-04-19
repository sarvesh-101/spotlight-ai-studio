export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: 'taskId is required' });

  const RUNWAY_KEY = process.env.RUNWAY_API_KEY;

  try {
    const response = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${RUNWAY_KEY}`,
        'X-Runway-Version': '2024-11-06'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to poll task');
    }

    const status = data.status || data.state;
    const progress = data.progress || null;

    // Extract video URL from various possible response shapes
    const videoUrl =
      data.output?.[0] ||
      data.artifacts?.[0]?.url ||
      data.task?.artifacts?.[0]?.url ||
      null;

    return res.status(200).json({ status, progress, videoUrl, raw: data });

  } catch (err) {
    console.error('Poll error:', err);
    return res.status(500).json({ error: err.message });
  }
}
