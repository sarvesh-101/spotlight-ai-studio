export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { prompt, ratio = '1280:768' } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  const RUNWAY_KEY = process.env.RUNWAY_API_KEY;

  try {
    const response = await fetch('https://api.dev.runwayml.com/v1/text_to_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RUNWAY_KEY}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06'
      },
      body: JSON.stringify({
        model: 'gen3a_turbo',
        promptText: prompt,
        ratio: ratio,
        duration: 5
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Try alternate endpoint format
      const resp2 = await fetch('https://api.dev.runwayml.com/v1/generation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RUNWAY_KEY}`,
          'Content-Type': 'application/json',
          'X-Runway-Version': '2024-11-06'
        },
        body: JSON.stringify({
          model: 'gen3a_turbo',
          prompt_text: prompt,
          ratio: ratio,
          duration: 5
        })
      });
      if (!resp2.ok) {
        const e2 = await resp2.json();
        throw new Error(e2.error || e2.message || JSON.stringify(e2).slice(0, 200));
      }
      const d2 = await resp2.json();
      const taskId = d2.id || d2.task_id || d2.uuid;
      if (!taskId) throw new Error('No task ID returned');
      return res.status(200).json({ taskId });
    }

    const taskId = data.id || data.task_id || data.uuid;
    if (!taskId) throw new Error('No task ID returned from Runway');

    return res.status(200).json({ taskId });

  } catch (err) {
    console.error('Video generation error:', err);
    return res.status(500).json({ error: err.message || 'Video generation failed' });
  }
}
