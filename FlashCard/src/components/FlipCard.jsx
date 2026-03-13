import { useState } from 'react';

/**
 * Reusable Neo-Brutal flip card.
 * Front: white bg, bold black border, hard shadow → question
 * Back:  yellow bg, bold black border → answer
 */
export default function FlipCard({ question, answer, wrongCount = 0, correctCount = 0, onDelete, compact = false }) {
  const [flipped, setFlipped] = useState(false);
  const height = compact ? '210px' : '300px';

  return (
    <div className="flex flex-col gap-2">
      {/* Urgency indicator */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[1, 2, 3].map(dot => (
            <div
              key={dot}
              className={`w-2 h-2 border border-black ${wrongCount >= dot * 2 ? 'bg-[#FF2D2D]' : 'bg-transparent'}`}
            />
          ))}
        </div>
        <span className="font-[family-name:var(--font-body)] text-[10px] text-black/50">
          {wrongCount}✕ {correctCount}✓
        </span>
      </div>

      {/* Flip card */}
      <div
        style={{ perspective: '1000px', height, cursor: 'pointer' }}
        onClick={() => setFlipped(f => !f)}
        className="w-full"
      >
        <div
          className="flip-card-inner relative w-full h-full"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front — Question */}
          <div
            className="flip-card-face absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center"
            style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000' }}
          >
            <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.2em] uppercase border border-black px-2 py-0.5 mb-4 bg-[#FFEB3B]">
              Question
            </span>
            <p className="font-[family-name:var(--font-display)] text-sm leading-snug text-black">
              {question}
            </p>
            <p className="absolute bottom-3 font-[family-name:var(--font-body)] text-[9px] text-black/30">
              tap to flip →
            </p>
          </div>

          {/* Back — Answer */}
          <div
            className="flip-card-face flip-card-back absolute inset-0 bg-[#FFEB3B] flex flex-col items-center justify-center p-6 text-center"
            style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000' }}
          >
            <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.2em] uppercase border border-black px-2 py-0.5 mb-4 bg-white">
              Answer
            </span>
            <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed text-black">
              {answer}
            </p>
            <p className="absolute bottom-3 font-[family-name:var(--font-body)] text-[9px] text-black/30">
              ← tap to flip back
            </p>
          </div>
        </div>
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="btn-brutal btn-brutal-red text-[10px] py-1.5 w-full"
          style={{ border: '3px solid #000', boxShadow: '3px 3px 0 #000', background: '#fff', color: '#000' }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
