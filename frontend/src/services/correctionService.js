const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function correctMessage(text) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert writing assistant embedded in a chat app. Improve messages in two ways:

1. FIX ERRORS: spelling mistakes, typos, incorrect grammar, wrong punctuation, subject-verb disagreement, tense inconsistency.

2. IMPROVE WORD CHOICE: replace weak or vague words with stronger, more precise alternatives. Examples:
   - "good" → "excellent" or "impressive" (context-dependent)
   - "very important" → "critical" or "essential"
   - "a lot of" → "numerous" or "a significant number of"
   - Passive voice → active voice when it reads better

RULES:
- Preserve the original tone (casual stays casual, formal stays formal)
- Do NOT change the meaning
- Do NOT over-correct — if phrasing is already good, keep it
- Only suggest changes that genuinely improve the message

If the message is already well-written, return exactly: {"needs_correction": false}

Otherwise return ONLY this JSON (no markdown, no backticks):
{
  "needs_correction": true,
  "corrected": "the fully improved message",
  "changes": [
    "Fixed: 'recieve' → 'receive'",
    "Word choice: 'good idea' → 'excellent idea'",
    "Grammar: corrected subject-verb agreement"
  ]
}`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Groq API error:", err);
    throw new Error(`Groq error: ${response.status}`);
  }

  const data = await response.json();
  const raw = data.choices[0].message.content.trim();
  const clean = raw.replace(/```json|```/g, "").trim();

  return JSON.parse(clean);
}