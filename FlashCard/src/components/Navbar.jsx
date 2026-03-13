import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCards } from '../context/CardContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cards }        = useCards();
  const { pathname }     = useLocation();

  const link = (to, label, count = null) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`font-[family-name:var(--font-display)] text-xs tracking-widest uppercase px-4 py-2 border-3 border-black transition-all duration-100
          ${active
            ? 'bg-[#FFEB3B] shadow-[3px_3px_0_#000]'
            : 'bg-transparent hover:bg-[#FFEB3B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000]'
          }`}
        style={{ border: '3px solid #000', boxShadow: active ? '3px 3px 0 #000' : undefined }}
      >
        {label}
        {count !== null && count > 0 && (
          <span className="ml-2 bg-black text-[#FFEB3B] text-[9px] px-1 py-0.5 font-[family-name:var(--font-display)]">
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFDF0] border-b-4 border-black">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/create" className="flex items-center gap-0 group">
          <div className="bg-black text-[#FFEB3B] font-[family-name:var(--font-display)] text-sm px-3 py-1.5 tracking-widest">
            FLASH
          </div>
          <div className="bg-[#FFEB3B] text-black font-[family-name:var(--font-display)] text-sm px-3 py-1.5 tracking-widest border-y-4 border-r-4 border-black">
            AI
          </div>
        </Link>

        {/* Nav links */}
        {user && (
          <div className="hidden sm:flex items-center gap-3">
            {link('/create',  'Create')}
            {link('/library', 'Library', cards.length)}
            {cards.length > 0 && link('/study', 'Study')}
          </div>
        )}

        {/* User area */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 border-3 border-black px-3 py-1.5" style={{ border: '3px solid #000' }}>
              {user.avatar
                ? <img src={user.avatar} alt="" className="w-5 h-5 object-cover grayscale" style={{ imageRendering: 'pixelated' }} />
                : <div className="w-5 h-5 bg-[#FFEB3B] border border-black flex items-center justify-center text-[10px] font-[family-name:var(--font-display)]">{user.name?.[0]}</div>
              }
              <span className="font-[family-name:var(--font-body)] text-xs">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="btn-brutal btn-brutal-black text-xs px-3 py-1.5"
              style={{ border: '3px solid #000', boxShadow: '3px 3px 0 #000' }}
            >
              Exit
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
