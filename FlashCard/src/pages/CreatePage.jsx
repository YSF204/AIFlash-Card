import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '../context/CardContext';
import { useAuth } from '../context/AuthContext';
import FlipCard from '../components/FlipCard';

export default function CreatePage() {
  const { generateCard, addCard } = useCards();
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const [text, setText]           = useState('');
  const [cards, setCards]         = useState([]);   // all generated cards so far
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState({}); // { [index]: true }
  const [saved, setSaved]         = useState({}); // { [index]: true }
  const [error, setError]         = useState('');

  const doGenerate = async (append = false) => {
    if (text.trim().length < 10) return;
    setLoading(true);
    setError('');
    try {
      // generateCard now returns an array from backend
      const result = await generateCard(text.trim());
      const newCards = Array.isArray(result) ? result : [result];
      setCards(prev => append ? [...prev, ...newCards] : newCards);
      if (append) setSaved({}); // don't reset saved state of previous batch
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOne = async (card, idx) => {
    setSaving(p => ({ ...p, [idx]: true }));
    try {
      await addCard(card.question, card.answer);
      setSaved(p => ({ ...p, [idx]: true }));
      showToast('Card saved!', 'success');
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(p => ({ ...p, [idx]: false }));
    }
  };

  const handleSaveAll = async () => {
    const unsaved = cards.filter((_, i) => !saved[i]);
    if (!unsaved.length) return;
    try {
      await Promise.all(unsaved.map(c => addCard(c.question, c.answer)));
      const newSaved = {};
      cards.forEach((_, i) => { newSaved[i] = true; });
      setSaved(newSaved);
      showToast(`${unsaved.length} cards saved!`, 'success');
    } catch {
      showToast('Failed to save some cards', 'error');
    }
  };

  const unsavedCount = cards.filter((_, i) => !saved[i]).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Page header */}
      <div className="mb-14 animate-fade-up">
        <div className="inline-block bg-[#FFEB3B] border-4 border-black px-3 py-1 mb-4" style={{ boxShadow: '4px 4px 0 #000' }}>
          <span className="font-[family-name:var(--font-display)] text-xs tracking-widest uppercase">
            Step 01 — Generate
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,4rem)] leading-[0.9] tracking-tight text-black">
          PASTE TEXT.<br />
          <span className="text-black" style={{ WebkitTextStroke: '2px #000', color: 'transparent' }}>GET CARDS.</span>
        </h1>
      </div>

      {/* Input panel */}
      <div className="brutal-card p-8 mb-12 animate-fade-up delay-100">
        <label className="brutal-label">Source Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste any text — a paragraph from a book, lecture notes, documentation..."
          rows={6}
          className="brutal-input mb-6"
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-body)] text-xs text-black/60 font-bold">
            {text.length} CHARS
          </span>
          <div className="flex gap-3">
            {cards.length > 0 && (
              <button
                onClick={() => doGenerate(true)}
                disabled={text.trim().length < 10 || loading}
                className="btn-brutal btn-brutal-black"
                style={{ background: '#fff', color: '#000' }}
              >
                {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full spin" /> : '+'}
                GENERATE MORE
              </button>
            )}
            <button
              onClick={() => doGenerate(false)}
              disabled={text.trim().length < 10 || loading}
              className="btn-brutal btn-brutal-yellow"
            >
              {loading && cards.length === 0 && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full spin" />}
              {loading && cards.length === 0 ? 'GENERATING...' : 'GENERATE CARDS →'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-4 bg-[#FF2D2D] text-white border-3 border-black p-3 font-[family-name:var(--font-body)] text-sm font-bold shadow-[4px_4px_0_#000]">
            ✕ {error}
          </div>
        )}
      </div>

      {/* Loading indicator for "Generate More" */}
      {loading && cards.length > 0 && (
        <div className="flex items-center gap-3 mb-8 bg-black text-white p-3 border-3 border-black inline-flex shadow-[4px_4px_0_#FFEB3B]">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spin" />
          <span className="font-[family-name:var(--font-display)] text-xs tracking-widest uppercase">
            GENERATING...
          </span>
        </div>
      )}

      {/* Generated cards grid */}
      {cards.length > 0 && (
        <>
          {/* Batch actions */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8 bg-[#FFEB3B] border-4 border-black p-6 shadow-[6px_6px_0_#000]">
            <div>
              <p className="brutal-label mb-2">RESULTS</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl">
                {cards.length} CARDS
                <span className="text-black/60 font-[family-name:var(--font-body)] text-lg ml-3">
                  ({unsavedCount} UNSAVED)
                </span>
              </h2>
            </div>
            <div className="flex gap-3">
              {unsavedCount > 0 && (
                <button
                  onClick={handleSaveAll}
                  className="btn-brutal btn-brutal-black"
                >
                  SAVE ALL ({unsavedCount}) →
                </button>
              )}
              {unsavedCount === 0 && (
                <button
                  onClick={() => navigate('/study')}
                  className="btn-brutal btn-brutal-green"
                >
                  STUDY NOW →
                </button>
              )}
            </div>
          </div>

          {/* Card grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, i) => (
              <div key={`${card.question}-${i}`} className="animate-fade-up flex flex-col gap-4" style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}>
                <FlipCard
                  question={card.question}
                  answer={card.answer}
                  compact
                />
                {/* Per-card save */}
                <button
                  onClick={() => handleSaveOne(card, i)}
                  disabled={saving[i] || saved[i]}
                  className={`btn-brutal w-full ${saved[i] ? 'btn-brutal-green shadow-none transform-none cursor-default' : 'btn-brutal-black bg-white text-black'}`}
                >
                  {saved[i] ? '✓ SAVED' : saving[i] ? 'SAVING...' : 'SAVE TO LIBRARY'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {cards.length === 0 && !loading && (
        <div className="border-4 border-dashed border-black py-24 flex flex-col items-center gap-4 bg-white shadow-[8px_8px_0_#000]">
          <div className="font-[family-name:var(--font-display)] text-6xl text-black">⚡</div>
          <p className="font-[family-name:var(--font-body)] text-sm font-bold text-black uppercase tracking-widest text-center">
            PASTE TEXT ABOVE<br />CLICK GENERATE CARDS
          </p>
        </div>
      )}
    </div>
  );
}
