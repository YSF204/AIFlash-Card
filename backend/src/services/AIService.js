/**
 * S — Single Responsibility: OpenAI API calls only.
 * O — Open/Closed: swap model or provider by extending this class.
 */
class AIService {
  constructor() {
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    this.model   = 'gpt-4o-mini';
  }

  get #apiKey() {
    return process.env.OPENAI_API_KEY;
  }

  /**
   * Generate multiple flashcard Q&A pairs from raw text.
   * @param {string} text  - Source text
   * @param {number} count - How many cards to generate (default 5)
   * @returns {{ cards: Array<{ question: string, answer: string }> }}
   */
  async generateCards(text, count = 5) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.#apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.6,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              `You are a flashcard generator. Extract up to ${count} distinct, non-overlapping questions and concise answers from the user's text. ` +
              `Each card should cover a different concept. ` +
              `Respond ONLY with valid JSON in this exact format: {"cards":[{"question":"...","answer":"..."}]}`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(
        new Error(err?.error?.message || `OpenAI API error ${res.status}`),
        { status: 502 }
      );
    }

    const data  = await res.json();
    const raw   = data?.choices?.[0]?.message?.content || '';

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.cards) || parsed.cards.length === 0)
        throw new Error('Bad shape');
      // Validate each card has question + answer
      return parsed.cards.filter(c => c.question && c.answer);
    } catch {
      throw Object.assign(new Error('Unexpected AI response format'), { status: 502 });
    }
  }
}

module.exports = new AIService();

