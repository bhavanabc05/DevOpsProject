const express = require('express');
const router = express.Router();

const TONE_INSTRUCTIONS = {
  formal: "Rewrite in a formal, professional academic tone. Use complete sentences, proper grammar, and avoid contractions or slang.",
  casual: "Rewrite in a relaxed, everyday conversational tone. Keep it natural and easy-going, like texting a friend.",
  friendly: "Rewrite in a warm, positive, and approachable tone. Make it sound cheerful and welcoming.",
  professional: "Rewrite in a polished business tone. Be concise, clear, and respectful — suitable for workplace communication.",
  empathetic: "Rewrite with empathy and emotional sensitivity. Acknowledge feelings and use compassionate language.",
  assertive: "Rewrite in a confident, direct tone. Be clear and firm without being rude.",
  persuasive: "Rewrite to be more convincing and compelling. Use strong, positive language that motivates action.",
  diplomatic: "Rewrite in a tactful, balanced tone. Be polite and considerate while still being clear.",
  enthusiastic: "Rewrite with energy and excitement. Use expressive, upbeat language that shows genuine interest.",
  concise: "Rewrite as briefly as possible. Remove all unnecessary words while keeping the full meaning."
};

router.post('/', async (req, res) => {
  const { text, tone = 'formal' } = req.body;
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.formal;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are an expert writing assistant. Always improve the user's message.

TONE: ${toneInstruction}

STRICT RULES:
- "improved" must ALWAYS be a complete, natural sentence — never a list, never bullet points, never corrections like "'word' should be 'word'"
- "changes" must be short descriptions of what you changed, like "Fixed spelling of 'hav' to 'Have'"
- Always fix spelling and grammar AND rewrite in the requested tone
- Keep the original meaning

EXAMPLE INPUT: "hav a nice day"
EXAMPLE OUTPUT:
{
  "improved": "Have a wonderful day!",
  "changes": ["Fixed spelling: 'hav' → 'Have'", "Added enthusiasm for friendly tone"],
  "tone": "friendly"
}

Return ONLY valid JSON. No markdown, no backticks, no explanation outside the JSON.`

          },
          { role: 'user', content: text }
        ],
        temperature: 0.4,
        max_tokens: 500
      })
    });

    const data = await response.json();
    console.log('Groq raw response:', JSON.stringify(data));
    const raw = data.choices[0].message.content.trim();
    console.log('RAW GROQ RESPONSE:', raw);
    const clean = raw.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(clean));

  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: 'AI correction failed' });
  }
});

module.exports = router;