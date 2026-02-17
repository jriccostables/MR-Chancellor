export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system, getVoice, text } = req.body;

  // Voice generation request
  if (getVoice && text) {
    const elevenKey = process.env.ELEVENLABS_API_KEY;
    
    try {
      const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam - distinguished British male voice
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.75
          }
        })
      });

      const audioData = await response.arrayBuffer();
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(audioData));
    } catch (error) {
      console.error('ElevenLabs error:', error);
      res.status(500).json({ error: error.message });
    }
    return;
  }

  // Regular chat request
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: system,
        messages: messages,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search"
          }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
