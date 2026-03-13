import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '../context/CardContext';
import { useAuth } from '../context/AuthContext';
import FlipCard from '../components/FlipCard';

export default function LibraryPage() {
  const { cards, loading, removeCard } = useCards();
  const { showToast } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await removeCard(id);
      showToast('Card Deleted', 'info');
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const totalErrors = cards.reduce((s, c) => s + (c.wrongCount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12 animate-fade-up">
        <div>
          <div className="inline-block bg-[#FFEB3B] border-4 border-black px-3 py-1 mb-4" style={{ boxShadow: '4px 4px 0 #000' }}>
            <span className="font-[family-name:var(--font-display)] text-xs tracking-widest uppercase">
              Step 02 — Library
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-tight text-black">
            YOUR CARDS
          </h1>
        </div>

        {cards.length > 0 && (
          <div className="flex flex-wrap bg-white border-4 border-black p-4 gap-6" style={{ boxShadow: '6px 6px 0 #000' }}>
            <div className="flex flex-col items-center justify-center">
              <span className="font-[family-name:var(--font-display)] text-3xl">{cards.length}</span>
              <span className="brutal-label text-black/60">TOTAL</span>
            </div>
            <div className="w-1 bg-black" />
            <div className="flex flex-col items-center justify-center">
              <span className="font-[family-name:var(--font-display)] text-3xl text-[#FF2D2D]">{totalErrors}</span>
              <span className="brutal-label text-[#FF2D2D]/60 w-full text-center">ERRORS</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate('/study')}
                className="btn-brutal btn-brutal-yellow ml-2 h-full"
              >
                STUDY ALL →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 bg-black text-white p-4 border-4 border-black shadow-[6px_6px_0_#FFEB3B] inline-flex">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full spin" />
          <span className="font-[family-name:var(--font-display)] text-sm tracking-widest uppercase">LOADING...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && cards.length === 0 && (
        <div className="border-4 border-dashed border-black py-24 flex flex-col items-center gap-6 bg-white shadow-[8px_8px_0_#000]">
          <div className="font-[family-name:var(--font-display)] text-7xl text-black">∅</div>
          <p className="font-[family-name:var(--font-body)] text-sm font-bold tracking-widest uppercase">NO CARDS YET</p>
          <button
            onClick={() => navigate('/create')}
            className="btn-brutal btn-brutal-yellow"
          >
            CREATE YOUR FIRST CARD →
          </button>
        </div>
      )}

      {/* Flip card grid */}
      {!loading && cards.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cards.map((card, i) => (
            <div
              key={card._id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
            >
              <FlipCard
                question={card.question}
                answer={card.answer}
                wrongCount={card.wrongCount || 0}
                correctCount={card.correctCount || 0}
                compact
                onDelete={deleting === card._id ? null : () => handleDelete(card._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
