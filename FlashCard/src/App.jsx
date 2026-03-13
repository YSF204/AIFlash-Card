import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CardProvider } from './context/CardContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Toast from './components/ToastContainer';
import LoginPage    from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import CreatePage   from './pages/CreatePage';
import LibraryPage  from './pages/LibraryPage';
import StudyPage    from './pages/StudyPage';
import './index.css';

function AppShell() {
  return (
    <div className="min-h-screen bg-[#FFFDF0]">

      <Navbar />
      <main>
        <Routes>
          <Route path="/create"  element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
          <Route path="/study"   element={<ProtectedRoute><StudyPage /></ProtectedRoute>} />
          <Route path="*"        element={<Navigate to="/create" replace />} />
        </Routes>
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CardProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/"              element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected shell */}
            <Route path="/*" element={<AppShell />} />
          </Routes>
        </CardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
