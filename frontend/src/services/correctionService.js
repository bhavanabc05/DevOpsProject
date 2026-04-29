const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function correctMessage(text, tone = 'formal') {
  const res = await fetch(`${BACKEND_URL}/api/correct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, tone })
  });
  if (!res.ok) throw new Error('Correction failed');
  return res.json();
}

export async function saveMessage(text, originalText, wasCorrected, tone) {
  await fetch(`${BACKEND_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, originalText, wasCorrected, tone })
  });
}

export async function loadMessages() {
  const res = await fetch(`${BACKEND_URL}/api/messages`);
  if (!res.ok) return [];
  return res.json();
}