// Storage keys
const CARDS_KEY = 'flashcard_cards';
const API_KEY_KEY = 'flashcard_apikey';

export const storage = {
  getCards: () => {
    try {
      return JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
    } catch { return []; }
  },
  saveCards: (cards) => {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  },
  getApiKey: () => localStorage.getItem(API_KEY_KEY) || '',
  saveApiKey: (key) => localStorage.setItem(API_KEY_KEY, key),
};

// Generate a unique ID
export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Spaced repetition: build study queue sorted by due weight (higher = more due)
export const buildStudyQueue = (cards) => {
  const now = Date.now();
  return [...cards]
    .map(card => ({
      ...card,
      dueScore: computeDueScore(card, now),
    }))
    .sort((a, b) => b.dueScore - a.dueScore);
};

const computeDueScore = (card, now) => {
  // Base: wrong count increases priority
  const wrongWeight = (card.wrongCount || 0) * 3;
  // Cards not studied recently surface first
  const daysSinceSeen = card.lastSeen
    ? (now - card.lastSeen) / 86400000
    : 99;
  return wrongWeight + daysSinceSeen;
};
