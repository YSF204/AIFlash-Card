import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full spin mx-auto mb-4" />
          <p className="font-[family-name:var(--font-body)] text-stone-500 text-sm tracking-widest">
            LOADING
          </p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
}
