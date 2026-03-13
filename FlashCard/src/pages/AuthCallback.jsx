import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * After Google OAuth the backend redirects to:
 *   /auth/callback?token=<JWT>
 * This page grabs the token, stores it, then redirects to /create
 */
export default function AuthCallback() {
  const [params] = useSearchParams();
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');
    if (token) {
      setToken(token);
      navigate('/create', { replace: true });
    } else {
      navigate(`/?error=${error || 'auth_failed'}`, { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF0]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full spin mx-auto mb-4" />
        <p className="font-[family-name:var(--font-display)] text-xs text-black tracking-widest uppercase">
          Signing you in...
        </p>
      </div>
    </div>
  );
}
