import { useCallback, useState } from 'react';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are a flashcard generator. The user will give you a piece of text.
Your job is to extract ONE clear question and a concise answer from that text.
Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{"question":"...","answer":"..."}`;

export function useAI(apiKey) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateCard = useCallback(
    async (text) => {
      if (!apiKey) throw new Error('No API key set. Click the key icon to add one.');
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: SYSTEM_PROMPT + '\n\nText:\n' + text },
                ],
              },
            ],
            generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData?.error?.message || `API error ${res.status}`
          );
        }

        const data = await res.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // strip potential markdown code fences
        const cleaned = raw.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (!parsed.question || !parsed.answer) throw new Error('Unexpected AI response format.');
        return parsed;
      } catch (err) {
        const msg = err.message || 'Something went wrong';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  return { generateCard, loading, error };
}
