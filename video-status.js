export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { taskId } = req.query;
  const RUNWAY_KEY = process.env.RUNWAY_KEY;

  if (!taskId) return res.status(400).json({ error: 'taskId is required' });

  try {
    const response = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${RUNWAY_KEY}`,
        'X-Runway-Version': '2024-11-06'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Status check failed' });
    }

    const status = data.status || data.state;
    const videoUrl = data.output?.[0] || data.artifacts?.[0]?.url;
    const progress = data.progress || 0;
    const failureReason = data.failure_reason || data.error;

    return res.status(200).json({ status, videoUrl, progress, failureReason, raw: data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
