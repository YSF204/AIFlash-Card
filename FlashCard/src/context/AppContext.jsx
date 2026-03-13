import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { storage, uid } from '../utils/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cards, setCards] = useState(() => storage.getCards());
  const [apiKey, setApiKeyState] = useState(() => storage.getApiKey());
  const [view, setView] = useState('create'); // 'create' | 'library' | 'study'
  const [studyCardId, setStudyCardId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  // Persist cards whenever they change
  useEffect(() => { storage.saveCards(cards); }, [cards]);

  const saveApiKey = useCallback((key) => {
    storage.saveApiKey(key);
    setApiKeyState(key);
  }, []);

  const addCard = useCallback((question, answer) => {
    const card = {
      id: uid(),
      question,
      answer,
      wrongCount: 0,
      correctCount: 0,
      lastSeen: null,
      createdAt: Date.now(),
    };
    setCards(prev => [card, ...prev]);
    return card;
  }, []);

  const deleteCard = useCallback((id) => {
    setCards(prev => prev.filter(c => c.id !== id));
  }, []);

  const markWrong = useCallback((id) => {
    setCards(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, wrongCount: (c.wrongCount || 0) + 1, lastSeen: Date.now() }
          : c
      )
    );
  }, []);

  const markCorrect = useCallback((id) => {
    setCards(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, correctCount: (c.correctCount || 0) + 1, lastSeen: Date.now() }
          : c
      )
    );
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const startStudy = useCallback((cardId = null) => {
    setStudyCardId(cardId);
    setView('study');
  }, []);

  return (
    <AppContext.Provider
      value={{
        cards, apiKey, saveApiKey,
        addCard, deleteCard, markWrong, markCorrect,
        view, setView,
        studyCardId, startStudy,
        toasts, showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
