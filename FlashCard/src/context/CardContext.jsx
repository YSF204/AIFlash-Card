import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CardContext = createContext(null);

export function CardProvider({ children }) {
  const { user } = useAuth();
  const [cards, setCards]     = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cards whenever user changes
  useEffect(() => {
    if (!user) { setCards([]); return; }
    setLoading(true);
    api.get('/cards')
      .then(({ data }) => setCards(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const addCard = useCallback(async (question, answer) => {
    const { data } = await api.post('/cards', { question, answer });
    setCards(prev => [data.data, ...prev]);
    return data.data;
  }, []);

  const recordResult = useCallback(async (id, result) => {
    const { data } = await api.patch(`/cards/${id}`, { result });
    setCards(prev => prev.map(c => c._id === id ? data.data : c));
    return data.data;
  }, []);

  const removeCard = useCallback(async (id) => {
    await api.delete(`/cards/${id}`);
    setCards(prev => prev.filter(c => c._id !== id));
  }, []);

  const generateCard = useCallback(async (text) => {
    const { data } = await api.post('/ai/generate', { text });
    return data.data; // { question, answer }
  }, []);

  return (
    <CardContext.Provider value={{ cards, loading, addCard, removeCard, recordResult, generateCard }}>
      {children}
    </CardContext.Provider>
  );
}

export const useCards = () => useContext(CardContext);
