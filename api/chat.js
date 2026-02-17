export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system, getVoice, text } = req.body;

 if (getVoice && text) {
    const elevenKey = process.env.ELEVENLABS_API_KEY;
    
    try {
      const voiceId = 'pNInz6obpgDQGcFmaJgB';
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

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', audioBuffer.byteLength.toString());
      
      return res.send(Buffer.from(audioBuffer));
    } catch (error) {
      console.error('ElevenLabs error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
