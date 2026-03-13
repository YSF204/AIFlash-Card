import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '../context/CardContext';
import { useAuth } from '../context/AuthContext';

const buildQueue = (cards) =>
  [...cards].sort((a, b) => (b.dueScore || 0) - (a.dueScore || 0));

export default function StudyPage() {
  const { cards, recordResult } = useCards();
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const queue = useMemo(() => buildQueue(cards), []);
  const [index, setIndex]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState({ correct: 0, wrong: 0 });
  const [done, setDone]       = useState(false);
  const [saving, setSaving]   = useState(false);

  const current = queue[index];

  const handleFlip = () => {
    if (!answered) setFlipped(f => !f);
  };

  const handleResult = useCallback(async (result) => {
    if (answered || saving) return;
    setAnswered(true);
    setSaving(true);
    try {
      await recordResult(current._id, result);
      setResults(r => ({ ...r, [result]: r[result] + 1 }));
    } catch {
      showToast('Failed to save result', 'error');
    } finally {
      setSaving(false);
    }
  }, [answered, saving, current, recordResult, showToast]);

  const handleNext = useCallback(() => {
    if (index + 1 >= queue.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setFlipped(false);
      setAnswered(false);
    }
  }, [index, queue.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'f') handleFlip();
      if (answered && e.key === 'ArrowRight') handleNext();
      if (answered && e.key === 'g') handleResult('correct');
      if (answered && e.key === 'b') handleResult('wrong');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleFlip, handleNext, handleResult, answered]);

  if (cards.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <p className="brutal-label mb-6">NOTHING TO STUDY</p>
        <button onClick={() => navigate('/create')} className="btn-brutal btn-brutal-yellow">
          CREATE CARDS FIRST →
        </button>
      </div>
    );
  }

  if (done) {
    const total = results.correct + results.wrong;
    const pct   = total ? Math.round((results.correct / total) * 100) : 0;
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center animate-fade-up">
        <div className="inline-block bg-[#FFEB3B] border-4 border-black px-3 py-1 mb-8" style={{ boxShadow: '4px 4px 0 #000' }}>
          <span className="font-[family-name:var(--font-display)] text-xs tracking-widest uppercase">
            SESSION COMPLETE
          </span>
        </div>

        <div className="bg-white border-4 border-black p-12 text-center mb-10 w-full max-w-lg shadow-[8px_8px_0_#000]">
          <div className={`font-[family-name:var(--font-display)] text-[clamp(4rem,10vw,8rem)] leading-none mb-4 ${pct >= 70 ? 'text-[#16A34A]' : 'text-black'}`}>
            {pct}<span className="text-4xl text-black">A%</span>
          </div>
          <p className="brutal-label mb-8 border-b-4 border-black pb-4">ACCURACY</p>

          <div className="flex justify-center gap-12">
            <div className="text-center">
              <div className="font-[family-name:var(--font-display)] text-5xl text-[#16A34A]">{results.correct}</div>
              <div className="brutal-label mt-2 text-[#16A34A]">CORRECT</div>
            </div>
            <div className="w-1 bg-black" />
            <div className="text-center">
              <div className="font-[family-name:var(--font-display)] text-5xl text-[#FF2D2D]">{results.wrong}</div>
              <div className="brutal-label mt-2 text-[#FF2D2D]">WRONG</div>
            </div>
          </div>
        </div>

        {results.wrong > 0 && (
          <div className="bg-[#FF2D2D] text-white border-4 border-black p-4 mb-8 font-[family-name:var(--font-body)] text-xs uppercase font-bold tracking-widest shadow-[4px_4px_0_#000]">
            {results.wrong} card(s) marked wrong will resurface more frequently.
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => navigate('/library')} className="btn-brutal btn-brutal-black">
            RETURN TO LIBRARY
          </button>
          <button onClick={() => { setIndex(0); setFlipped(false); setAnswered(false); setResults({ correct:0, wrong:0 }); setDone(false); }} className="btn-brutal btn-brutal-yellow">
            STUDY AGAIN ↺
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Progress */}
      <div className="flex items-center gap-4 mb-10 animate-fade-up bg-white border-4 border-black p-3 shadow-[4px_4px_0_#000]">
        <span className="font-[family-name:var(--font-display)] text-xs tracking-widest w-12 text-center">
          {index + 1}/{queue.length}
        </span>
        <div className="flex-1 h-3 bg-[#FFFDF0] border-2 border-black overflow-hidden relative">
          <div
            className="absolute top-0 left-0 bottom-0 bg-[#FFEB3B] border-r-2 border-black transition-all duration-300"
            style={{ width: `${((index) / queue.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Study Card */}
      <div
        className="w-full mx-auto"
        style={{ perspective: '1200px', cursor: !answered ? 'pointer' : 'default' }}
        onClick={!answered ? handleFlip : undefined}
      >
        <div
          className="flip-card-inner relative w-full"
          style={{
            height: '380px',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front — Question */}
          <div
            className="flip-card-face absolute inset-0 bg-white flex flex-col items-center justify-center p-12 text-center border-4 border-black"
            style={{ boxShadow: '8px 8px 0 #000' }}
          >
            <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase border-2 border-black px-3 py-1 mb-8 bg-[#FFEB3B]">
              Question
            </span>
            <p className="font-[family-name:var(--font-display)] text-2xl leading-snug text-black">
              {current.question}
            </p>
            {!flipped && (
              <p className="absolute bottom-6 font-[family-name:var(--font-body)] text-xs font-bold text-black/40 uppercase tracking-widest">
                CLICK OR PRESS [F] TO REVEAL
              </p>
            )}
          </div>

          {/* Back — Answer */}
          <div
            className="flip-card-face flip-card-back absolute inset-0 bg-[#FFEB3B] flex flex-col items-center justify-center p-12 text-center border-4 border-black"
            style={{ boxShadow: '8px 8px 0 #000' }}
          >
            <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase border-2 border-black px-3 py-1 mb-8 bg-white">
              Answer
            </span>
            <p className="font-[family-name:var(--font-body)] text-xl leading-relaxed text-black font-bold">
              {current.answer}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 animate-fade-up delay-100 min-h-[60px]">
        {!flipped && !answered && (
          <div className="flex justify-center">
            <button
              onClick={handleFlip}
              className="btn-brutal btn-brutal-black text-sm px-12 py-4"
            >
              REVEAL ANSWER ↓
            </button>
          </div>
        )}

        {flipped && !answered && (
          <div className="flex gap-4">
            <button
              onClick={() => handleResult('wrong')}
              disabled={saving}
              className="btn-brutal btn-brutal-red flex-1 text-sm py-4"
            >
              ✕ GOT IT WRONG
            </button>
            <button
              onClick={() => handleResult('correct')}
              disabled={saving}
              className="btn-brutal btn-brutal-green flex-1 text-sm py-4"
            >
              ✓ GOT IT RIGHT
            </button>
          </div>
        )}

        {answered && (
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="btn-brutal btn-brutal-yellow text-sm px-16 py-4"
            >
              NEXT CARD →
            </button>
          </div>
        )}
      </div>

      {/* Keyboard hints */}
      <div className="mt-10 flex justify-center gap-6 bg-white border-3 border-black p-3 inline-flex mx-auto shadow-[4px_4px_0_#000]">
        {[
          { key: 'F', desc: 'FLIP' },
          ...(answered ? [{ key: '→', desc: 'NEXT' }] : []),
          ...(flipped && !answered ? [{ key: 'G', desc: 'GOOD' }, { key: 'B', desc: 'BAD' }] : []),
        ].map(({ key, desc }) => (
          <div key={key} className="flex items-center gap-2">
            <kbd className="border-2 border-black px-2 py-0.5 font-[family-name:var(--font-display)] text-[10px] bg-[#FFFDF0]">
              {key}
            </kbd>
            <span className="font-[family-name:var(--font-body)] text-[10px] font-bold text-black opacity-60">
              {desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
