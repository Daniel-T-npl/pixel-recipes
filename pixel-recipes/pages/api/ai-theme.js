// Server API route to forward a theme to OpenAI and return a Lightroom specification.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { theme } = req.body || {};
  if (!theme || typeof theme !== 'string') {
    return res.status(400).json({ error: 'Missing theme in request body' });
  }

  // Build a system + user prompt to instruct the model to return a Lightroom-style spec.
  const systemPrompt = `You are a helpful assistant that converts a short photography theme into a concise Adobe Lightroom development specification. Respond in plain text (not code block) and include clear keys like exposure, contrast, highlights, shadows, whites, blacks, clarity, dehaze, vibrance, saturation, HSL adjustments (grouped by color), split toning, tone curve notes, grain, vignette and color grading notes. Be concrete with numeric values or short descriptive values. Keep output concise and easy to copy.`;

  const userPrompt = `Theme: "${theme.trim()}"\n\nProvide the Lightroom settings as a short human-readable list or JSON-like object.`;

  try {
    const apiKey = process.env.OPEN_AI_KEY || 'OPEN_AI_KEY';
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 600,
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: 'Upstream error from OpenAI', details: text });
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({ result: content });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
}
