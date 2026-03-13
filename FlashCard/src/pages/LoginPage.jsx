const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function LoginPage() {
  const features = [
    'AI generates cards from any text',
    'Flip cards to test yourself',
    'Spaced repetition engine',
    'Personal card library',
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex flex-col">
      {/* Top bar */}
      <div className="border-b-4 border-black px-8 py-3 flex justify-between items-center bg-black text-[#FFEB3B]">
        <div className="flex items-center gap-0">
          <span className="font-[family-name:var(--font-display)] text-sm tracking-widest">FLASH</span>
          <span className="font-[family-name:var(--font-display)] text-sm tracking-widest bg-[#FFEB3B] text-black px-1">AI</span>
        </div>
        <span className="font-[family-name:var(--font-body)] text-[10px] tracking-widest opacity-50">v1.0</span>
      </div>

      {/* Main grid */}
      <div className="flex-1 grid md:grid-cols-[1fr_1fr] border-b-4 border-black">
        {/* Left — hero */}
        <div className="p-12 md:p-16 flex flex-col justify-center border-r-4 border-black animate-fade-up">
          {/* Big accent block */}
          <div className="inline-block bg-[#FFEB3B] border-4 border-black px-3 py-1 mb-8 self-start"
            style={{ boxShadow: '4px 4px 0 #000' }}>
            <span className="font-[family-name:var(--font-display)] text-xs tracking-widest uppercase">
              AI-Powered Learning
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,6rem)] leading-[0.9] tracking-tight text-black mb-8">
            LEARN<br />
            MORE.<br />
            <span style={{ WebkitTextStroke: '3px #000', color: 'transparent' }}>FORGET</span><br />
            LESS.
          </h1>

          <div className="flex flex-col gap-2 mb-10">
            {features.map((f, i) => (
              <div key={f} className={`flex items-center gap-3 animate-fade-up delay-${(i + 1) * 100}`}>
                <div className="w-4 h-4 bg-[#FFEB3B] border-2 border-black flex-shrink-0" />
                <span className="font-[family-name:var(--font-body)] text-sm">{f}</span>
              </div>
            ))}
          </div>

          {/* Decorative stripe */}
          <div className="flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`h-3 flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-[#FFEB3B]'}`} />
            ))}
          </div>
        </div>

        {/* Right — sign in */}
        <div className="p-12 md:p-16 flex flex-col justify-center items-center animate-fade-up delay-200">
          <div className="w-full max-w-sm">
            {/* Panel */}
            <div className="bg-white p-8" style={{ border: '4px solid #000', boxShadow: '8px 8px 0 #000' }}>
              <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-2">
                Sign in
              </h2>
              <p className="font-[family-name:var(--font-body)] text-sm text-black/60 mb-8">
                to start building your flashcard library.
              </p>

              <a
                href={`${API_URL}/auth/google`}
                className="btn-brutal w-full gap-3 py-3"
                style={{ border: '3px solid #000', boxShadow: '4px 4px 0 #000', background: '#fff' }}
              >
                {/* Google G */}
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                  <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067C3.196 21.336 7.26 24 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                  <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                  <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
                </svg>
                <span className="font-[family-name:var(--font-display)] text-xs tracking-widest uppercase">
                  Continue with Google
                </span>
              </a>

              <p className="font-[family-name:var(--font-body)] text-[10px] text-black/40 mt-6 text-center leading-relaxed">
                Your cards are private and stored securely.<br />No credit card required.
              </p>
            </div>

            <p className="font-[family-name:var(--font-body)] text-[10px] text-black/30 mt-4 text-center">
              Powered by OpenAI GPT-4o-mini
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-4 border-black px-8 py-3 flex justify-between bg-[#FFEB3B]">
        <span className="font-[family-name:var(--font-display)] text-[10px] tracking-widest uppercase">FlashAI</span>
        <span className="font-[family-name:var(--font-display)] text-[10px] tracking-widest">©{new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
