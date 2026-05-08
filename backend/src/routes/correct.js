const express = require('express');
const router = express.Router();

const TONE_INSTRUCTIONS = {
  formal:       "Use formal academic language. Complete sentences, proper grammar, no contractions or slang.",
  casual:       "Use relaxed everyday language. Natural and easy-going, like texting a close friend.",
  friendly:     "Use warm and approachable language. Cheerful and welcoming but not over the top.",
  professional: "Use polished business language. Concise, clear, and respectful for workplace communication.",
  empathetic:   "Use emotionally sensitive language. Show understanding and compassion.",
  assertive:    "Use confident and direct language. Clear and firm without being aggressive.",
  persuasive:   "Use compelling language. Strong and positive to motivate the reader.",
  diplomatic:   "Use tactful and balanced language. Polite and considerate while remaining clear.",
  enthusiastic: "Use energetic and expressive language. Show genuine excitement and interest.",
  concise:      "Use minimal words. Remove everything unnecessary while keeping the full meaning."
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
            content: `You are a TEXT REWRITING assistant. You ONLY rewrite text. You NEVER reply to it.

CRITICAL RULE: The user input is a MESSAGE THEY ARE SENDING TO SOMEONE ELSE — not a message to you.
You must rewrite it as if you are the user — keeping their voice, intent, and meaning.

YOUR ONLY TASKS:
1. Fix spelling mistakes and grammar errors
2. Rewrite the message in this tone: ${toneInstruction}

ABSOLUTE PROHIBITIONS:
- NEVER answer a question — rewrite it instead
- NEVER say "I'd be happy to help" or any response-like phrase
- NEVER add facts, answers, or content the user did not write
- NEVER change the purpose or intent of the message
- NEVER write from the perspective of the recipient

REWRITING LOGIC BY MESSAGE TYPE:
- Statement → rewrite it more clearly in the chosen tone
- Question → rewrite the question itself more clearly in the chosen tone
- Request → rewrite the request more politely/clearly in the chosen tone
- Greeting → rewrite the greeting in the chosen tone

EXAMPLES OF CORRECT BEHAVIOR:

Input: "can you help me with project"
Tone: friendly
WRONG: "I'd be delighted to help you with your project! What do you need?"
RIGHT: "Hey, could you help me out with my project? I'd really appreciate it!"

Input: "what time is meeting"
Tone: professional
WRONG: "The meeting is scheduled for 3 PM."
RIGHT: "Could you please let me know what time the meeting is scheduled?"

Input: "i dont understand this topic"
Tone: formal
WRONG: "I would be happy to explain this topic to you."
RIGHT: "I am having difficulty understanding this topic and would appreciate some clarification."

Input: "wanna grab lunch"
Tone: formal
WRONG: "Yes, I would love to grab lunch with you."
RIGHT: "Would you like to join me for lunch?"

Input: "hav a nice day"
Tone: friendly
RIGHT: "Have a wonderful day!"

Return ONLY this JSON with no markdown, no backticks, no extra text:
{
  "improved": "the rewritten message here",
  "changes": ["Fixed: spelling of 'hav' → 'Have'", "Tone: added warmth for friendly tone"],
  "tone": "${tone}"
}`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    result.tone = tone; // always force correct tone label
    res.json(result);

  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: 'AI correction failed' });
  }
});

module.exports = router;